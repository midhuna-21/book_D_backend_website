import { Request, Response } from "express";
import {
    comparePassword,
    hashPassword,
} from "../utils/ReuseFunctions/passwordValidation";
import { UserService } from "../services/user/userService";
import { generateOtp } from "../utils/ReuseFunctions/otpGenerator";
import { generateUserTokens } from "../utils/jwt/userGenerateToken";
import crypto from "crypto";
import axios from "axios";
import {
    PutObjectCommand,
    PutObjectCommandInput,
    DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import config from "../config/config";
import { s3Client } from "../utils/imageFunctions/store";
import { IUser } from "../model/userModel";
import { User } from "../interfaces/data";
import { Types } from "mongoose";
import { sendEmail } from "../utils/ReuseFunctions/sendEmail";
import { AuthenticatedRequest } from "../utils/middleware/userAuthMiddleware";
import { UserRepository } from "../respository/user/userRepository";

interface CustomFile extends Express.Multer.File {
    location?: string;
}
const uploadImageToS3 = async (
    imageBuffer: Buffer,
    fileName: string
): Promise<string> => {
    const uploadParams: PutObjectCommandInput = {
        Bucket: config.BUCKET_NAME,
        Key: fileName,
        Body: imageBuffer,
        ContentType: "image/jpeg",
    };

    const command = new PutObjectCommand(uploadParams);
    await s3Client.send(command);

    return `https://${config.BUCKET_NAME}.s3.${config.BUCKET_REGION}.amazonaws.com/${fileName}`;
};

const userRepository = new UserRepository();
const userService = new UserService(userRepository);

const createNewUser = async (req: Request, res: Response) => {
    try {
        const { name, email, phone, password } = req.body;

        let existUser = await userService.getUserByEmail(email);
        if (existUser) {
            return res.status(400).json({ message: "Email already exist" });
        }
        if (!name || !email || !phone || !password) {
            return res.status(400).json({
                message: "Please ensure all required fields are filled out.",
            });
        }
        const securePassword = await hashPassword(password);
        const user: User = { name, email, phone, password: securePassword };
        const otp = await generateOtp(email);
        console.log(otp, "createNewUser");
        res.cookie('otp', otp, {
            httpOnly: true, 
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'none', 
            maxAge: 60 * 1000,
        });
        // res.cookie("otp", otp, { maxAge: 60000 });
        return res.status(200).json({ user });
    } catch (error: any) {
        console.error(error.message);
        return res.status(400).json({ message: "Internal server error" });
    }
};

const requestOtpResend = async (req: Request, res: Response) => {
    try {
        const { email } = req.body;
        let otp = await generateOtp(email);
        console.log(otp, "resend");
        res.cookie("otp", otp, { maxAge: 60000 });
        return res
            .status(200)
            .json({ message: "OTP generated and sent successfully" });
    } catch (error: any) {
        console.log(error.message);
        return res.status(400).json({ message: "internal s erver error" });
    }
};

const validateOtp = async (req: Request, res: Response) => {
    try {
        const { response, origin, otp } = req.body;
        const { name, email, phone, password } = response;
        if (!otp) {
            return res.status(400).json({ message: "please enter otp" });
        }
       
        const otpFromCookie = req.cookies.otp;
        console.log(otpFromCookie,'otpFromCookie')
        if (!otpFromCookie) {
            return res.status(400).json({ message: "please click Resend OTP" });
        }
        if (otp !== otpFromCookie) {
            return res.status(400).json({ message: "Invalid OTP" });
        }
        if (origin === "sign-up") {
            const user: IUser | null = await userService.getCreateUser({
                name,
                email,
                phone,
                password,
            });
            if (user) {
                const userId = user._id.toString()!;
                const { accessToken, refreshToken } = generateUserTokens(res, {
                    userId,
                    role: "user",
                });
                return res
                    .status(200)
                    .json({ user, accessToken, refreshToken, origin });
            }
        } else {
            let user: IUser | null = await userService.getUserByEmail(email);
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }
            return res.status(200).json({ user, origin });
        }
    } catch (error: any) {
        console.error(error.message);
        return res.status(500).json({ message: "Internal server error" });
    }
};

const authenticateUser = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        let user: IUser | null = await userService.getUserByEmail(email);
        if (!user) {
            return res.status(401).json({ message: "Invalid email" });
        }
        if (user.isBlocked) {
            return res.status(400).json({
                message:
                    "user is blocked, please contact admin to get your account back",
            });
        }
        if (!user.password) {
            return res.status(401).json({ message: "Invalid password" });
        }
        const isPasswordValid = await comparePassword(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid password" });
        }

        const userId: string = (user._id as Types.ObjectId).toString();
        const { accessToken, refreshToken } = generateUserTokens(res, {
            userId,
            role: "user",
        });
        console.log(user);
        return res.status(200).json({ user, accessToken, refreshToken });
    } catch (error: any) {
        console.error(error.message);
        return res.status(500).json({ message: "Internal server error" });
    }
};

const authenticateWithGoogle = async (req: Request, res: Response) => {
    try {
        const { name, email, image } = req.body;
        let existUser = await userService.getUserByEmail(email);
        if (existUser?.isBlocked == true) {
            return res.status(401).json({ message: "User is Blocked" });
        }
        if (existUser?.isGoogle == true) {
            const userId = existUser._id.toString();
            const { accessToken, refreshToken } = generateUserTokens(res, {
                userId,
                role: "user",
            });
            return res
                .status(200)
                .json({ user: existUser, accessToken, refreshToken });
        } else if (existUser?.isGoogle == false) {
            return res.status(400).json({
                message: "Your email is not linked with google.",
            });
        } else {
            let imageUrl: string | undefined;

            if (image) {
                try {
                    const response = await axios.get(image, {
                        responseType: "arraybuffer",
                    });
                    const imageBuffer = Buffer.from(response.data, "binary");

                    const fileName = `${Date.now()}-${name.replace(
                        /\s+/g,
                        "_"
                    )}-google-profile.jpg`;

                    imageUrl = await uploadImageToS3(imageBuffer, fileName);
                } catch (uploadError) {
                    console.error("Error uploading image:", uploadError);
                    return res
                        .status(500)
                        .json({ error: "Failed to upload image." });
                }
            }

            const newUser = { name, email, image: imageUrl, isGoogle: true };
            const user = await userService.getCreateUserByGoogle(newUser);

            if (!user) {
                return res.status(400).json({ message: "user is not created" });
            } else {
                const userId = user._id.toString();
                const { accessToken, refreshToken } = generateUserTokens(res, {
                    userId,
                    role: "user",
                });

                return res.status(200).json({success:true,
                    user: {
                        ...user.toObject(),
                        accessToken,
                        refreshToken,
                    },
                });
            }
        }
    } catch (error: any) {
        console.error("Error in authenticateWithGoogle:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

const linkGoogleAccount = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        const isUser = await userService.getUserByEmail(email);
        if (!isUser) {
            return res.status(400).json({ message: "user not found" });
        }
        const isPasswordValid = await comparePassword(
            password,
            isUser.password
        );
        if (!isPasswordValid) {
            return res.status(400).json({ message: "password is incorrect" });
        }
        const user = await userService.getUpdateIsGoogleTrue(email);

        return res.status(200).json({ user });
    } catch (error: any) {
        console.log("Error linkGoogleAccount:", error);
        return res.status(400).json({ message: "Internal server error" });
    }
};

const processGoogleLogin = async (req: Request, res: Response) => {
    try {
        const credentialResponse = req.body;

        if (!credentialResponse) {
            return res.status(400).json({ message: "Internal server error" });
        }

        const response = await axios.get(
            "https://www.googleapis.com/oauth2/v1/userinfo",
            {
                headers: {
                    Authorization: `Bearer ${credentialResponse.access_token}`,
                },
            }
        );
        return res.status(200).json(response.data);
    } catch (error) {
        console.log("Error processGoogleLogin:", error);
        return res.status(400).json({ message: "Internal server error" });
    }
};
const updateUserProfile = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const { formData } = req.body;
        const { name, email, phone, address } = formData;
        const { street, city, district, state, pincode } = address;
        const userId = req.userId!;

        const userExist: IUser | null = await userService.getUserById(userId);
        if (!userExist) {
            return res.status(404).json({ message: "User not found" });
        }
        const user: Partial<IUser> = {
            name,
            email,
            phone,
            address: {
                street: street,
                city: city,
                district: district,
                state: state,
                pincode: pincode,
            },
        };
        const updatedUser = await userService.getUpdateUser(userId, user);
        return res.status(200).json({ user: updatedUser });
    } catch (error: any) {
        console.error("Error updating user:", error.message);
        return res.status(500).json({ error: "Internal server error" });
    }
};

const updateUserProfileImage = async (
    req: AuthenticatedRequest,
    res: Response
) => {
    try {
        const userId = req.userId!;
        const userExist: IUser | null = await userService.getUserById(userId);
        if (!userExist) {
            return res.status(404).json({ message: "User not found" });
        }

        const file = req.file as CustomFile;
        if (!file || !file.location) {
            return res.status(400).json({ message: "No file uploaded" });
        }

        let imageUrl: string = file.location;

        const user = await userService.getUpdateProfileImage(userId, imageUrl);
        return res.status(200).json({ user });
    } catch (error: any) {
        console.error("Error updating user:", error.message);
        return res.status(500).json({ error: "Internal server error" });
    }
};

const removeUserProfileImage = async (
    req: AuthenticatedRequest,
    res: Response
) => {
    try {
        const { imageToRemove } = req.body;
        const userId = req.userId;
        if (!userId) {
            return res.status(500).json({ message: "User not found" });
        }
        if (!imageToRemove) {
            return res.status(500).json({ messag: "Image is required." });
        }
        const deleteParams = {
            Bucket: config.BUCKET_NAME,
            Key: imageToRemove,
        };

        const command = new DeleteObjectCommand(deleteParams);
        await s3Client.send(command);
        const user = await userService.getDeleteUserImage(userId);
        return res.status(200).json({ user });
    } catch (error) {
        console.log("Error deleteUserImage:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

const sendOtpForForgotPassword = async (req: Request, res: Response) => {
    try {
        const { email } = req.body;
        let isValidEmail: IUser | null = await userService.getUserByEmail(
            email
        );
        if (isValidEmail) {
            const otp = await generateOtp(email);
            console.log(otp, "forgot");

            res.cookie('otp', otp, {
                httpOnly: true, 
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'none', 
                maxAge: 60 * 1000,
            });
            // res.cookie("otp", otp, { maxAge: 60000 });
            return res.status(200).json({ isValidEmail });
        } else {
            return res.status(401).json({ message: "Invalid email id" });
        }
    } catch (error: any) {
        console.log(error.message);
        return res.status(500).json({ error: "Internal server error" });
    }
};

const resetUserPassword = async (req: Request, res: Response) => {
    try {
        const { resetToken, resetTokenExpiration, password, email } = req.body;
        const isGmail = await userService.getUserByGmail(email);
        const gmail = isGmail?.email!;
        if (isGmail) {
            const udateIsGoogle = await userService.getUpdateIsGoogle(
                gmail,
                resetToken,
                resetTokenExpiration
            );
        }
        const securePassword = await hashPassword(password);
        const data: User = {
            email,
            password: securePassword,
            resetToken,
            resetTokenExpiration,
        };
        const user: IUser | null = await userService.getUpdatePassword(data);
        return res.status(200).json({ user });
    } catch (error: any) {
        console.log(error.message);
        return res.status(500).json({ error: "Internal server error" });
    }
};

const logoutUser = async (req: Request, res: Response) => {
    try {
        res.clearCookie("token", { httpOnly: true, secure: true });
        return res.status(200).json({ message: "Logout successfully" });
    } catch (error: any) {
        console.error(error.message);
        return res.status(400).json({ message: "Internal server error" });
    }
};

const sendEmailForUnlinking = async (
    req: AuthenticatedRequest,
    res: Response
) => {
    try {
        const userId = req.userId;
        if (!userId) {
            return res.status(400).json({ message: "user not found" });
        }
        const isUser = await userService.getUserById(userId);
        if (!isUser) {
            return res.status(400).json({ message: "user not found" });
        }
        const email = isUser?.email;
        const resetToken = crypto.randomBytes(32).toString("hex");
        const resetTokenExpiration = Date.now() + 15 * 60 * 1000;
        const user = await userService.getSaveToken(
            userId,
            resetToken,
            resetTokenExpiration
        );
        const send = await sendEmail(
            userId,
            email,
            resetToken,
            resetTokenExpiration
        );
        return res.status(200).json({ user });
    } catch (error: any) {
        console.error(error.message);
        return res.status(400).json({ message: "Internal server error" });
    }
};

const computeLocationDistance = async (req: Request, res: Response) => {
    try {
        const key = "AIzaSyD06G78Q2_d18EkXbsYsyg7qb2O-WWUU-Q";
        const { lat1, lng1, lat2, lng2 } = req.query;
        if (!lat1 || !lat2 || !lng1 || !lng2) {
            return res.status(500).json({
                message: "Error while getting while calculating distance",
            });
        }
        const origin = `${lat1},${lng1}`;
        const destination = `${lat2},${lng2}`;

        const url = `https://maps.googleapis.com/maps/api/distancematrix/json?units=metric&origins=${origin}&destinations=${destination}&key=${key}`;
        try {
            const response = await axios.get(url);
            const data = response.data;
            if (data.status === "OK") {
                const distance = data.rows[0].elements[0].distance.value;
                const distanceResponse = distance / 1000;
                return res.status(200).json({ distanceResponse });
            } else {
                console.error(
                    "Error in Google Maps API response:",
                    data.error_message
                );
                return null;
            }
        } catch (error) {
            console.error("Error fetching road distance:", error);
            return null;
        }
    } catch (error: any) {
        console.log("Error calculateDistance controller:", error);
        return res
            .status(500)
            .json({ message: "Internal server error at calculateDistance" });
    }
};

const checkUserIsblock = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const userId = req.userId;
        const user = await userService.getUserById(userId!);
        const isBlock = user?.isBlocked;
        console.log(isBlock, "isBlock");
        return res.status(200).json({ isBlock });
    } catch (error: any) {
        console.log("Error checkUserIsblock controller:", error);
        return res
            .status(500)
            .json({ message: "Internal server error at checkUserIsblock" });
    }
};

export {
    createNewUser,
    requestOtpResend,
    authenticateUser,
    authenticateWithGoogle,
    validateOtp,
    resetUserPassword,
    logoutUser,
    updateUserProfile,
    updateUserProfileImage,
    removeUserProfileImage,
    sendEmailForUnlinking,
    processGoogleLogin,
    linkGoogleAccount,
    computeLocationDistance,
    sendOtpForForgotPassword,
    checkUserIsblock,
};
