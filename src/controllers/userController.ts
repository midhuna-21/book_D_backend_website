import { Request, Response } from "express";
import {
    comparePassword,
    hashPassword,
} from "../utils/ReuseFunctions/passwordValidation";
import { UserService } from "../services/userService";
import { AdminService } from "../services/adminService";
import { otpGenerate } from "../utils/ReuseFunctions/otpGenerate";
import { generateTokens } from "../utils/jwt/generateToken";
import crypto from "crypto";
import axios from "axios";
import sharp from "sharp";
import {
    GetObjectCommand,
    GetObjectCommandInput,
    PutObjectCommand,
    DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import config from "../config/config";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { IUser } from "../model/userModel";
import { User} from "../interfaces/data";
import { IGenre } from "../model/genresModel";
import { Types } from "mongoose";
import { AuthenticatedRequest } from "../utils/middleware/authMiddleware";
import { s3Client } from "../utils/imageFunctions/store";
import { sendEmail } from "../utils/ReuseFunctions/sendEmail";

const userService = new UserService();

const signUp = async (req: Request, res: Response) => {
    try {
        const { name, email, phone, password } = req.body;
        console.log(req.body);
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

        return res.status(200).json({ user });
    } catch (error: any) {
        console.error(error.message);
        return res.status(400).json({ message: "Internal server error" });
    }
};

const randomImageName = (bytes = 32) =>
    crypto.randomBytes(bytes).toString("hex");

const generateOtp = async (req: Request, res: Response) => {
    try {
        const { email } = req.body;
        let otp = await otpGenerate(email);
        console.log(otp, "otp");
        res.cookie("otp", otp, { maxAge: 60000 });
        return res
            .status(200)
            .json({ message: "OTP generated and sent successfully" });
    } catch (error: any) {
        console.log(error.message);
        return res.status(400).json({ message: "internal s erver error" });
    }
};

const verifyOtp = async (req: Request, res: Response) => {
    try {
        const { response, origin, otp } = req.body;
        const { name, email, phone, password } = response;
        if (!otp) {
            return res.status(400).json({ message: "please enter otp" });
        }
        const otpFromCookie = req.cookies.otp;
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
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            } else {
                const userId = user._id.toString();
                const { accessToken, refreshToken } = generateTokens(res, {
                    userId,
                    userRole: "user",
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

const loginUser = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        let user: IUser | null = await userService.getUserByEmail(email);
        if (!user) {
            return res.status(400).json({ message: "Invalid email" });
        }
        if (user.isBlocked) {
            return res.status(400).json({
                message:
                    "user is blocked, please contact admin to get your account back",
            });
        }
        if (!user.password) {
            return res.status(400).json({ message: "Invalid password" });
        }
        const isPasswordValid = await comparePassword(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid password" });
        }

        const userId: string = (user._id as Types.ObjectId).toString();
        const { accessToken, refreshToken } = generateTokens(res, {
            userId,
            userRole: "user",
        });
        const imageUrl = user.image
        if (imageUrl) {
            const signedUrl = await getSignedUrl(
                s3Client, 
                new GetObjectCommand({
                    Bucket: "bookstore-web-app",
                    Key: imageUrl
                }), 
                { expiresIn: 604800 } 
            );

            return res.status(200).json({ user: { ...user.toObject(), image: signedUrl , accessToken, refreshToken} });
        }
        
        // return res.status(200).json({ user, accessToken, refreshToken });
    } catch (error: any) {
        console.error(error.message);
        return res.status(500).json({ message: "Internal server error" });
    }
};

const loginByGoogle = async (req: Request, res: Response) => {
    try {
        const { name, email, image } = req.body;

        let user = await userService.getUserByEmail(email);

        if (user?.isBlocked == true) {
            return res.status(401).json({ message: "User is Blocked" });
        }
        if (user?.isGoogle == true) {
            const userId = user._id.toString();
            const { accessToken, refreshToken } = generateTokens(res, {
                userId,
                userRole: "user",
            });
             const imageUrl = user.image
                if (imageUrl) {
                    const signedUrl = await getSignedUrl(
                        s3Client, 
                        new GetObjectCommand({
                            Bucket: "bookstore-web-app",
                            Key: imageUrl
                        }), 
                        { expiresIn: 604800 } 
                    );
    
                    return res.status(200).json({ user: { ...user.toObject(), image: signedUrl,accessToken, refreshToken } });
                }

        } else if (user?.isGoogle == false) {
            return res
                .status(400) 
                .json({
                    message:
                        "Your email is not linked with google.Enter your email and password.",
                });
        } else {
            let imageUrl: string | undefined;
            if (image) {
                try {
                    const imageResponse = await axios.get(image, {
                        responseType: "arraybuffer",
                    });
                    const buffer = await sharp(imageResponse.data)
                        .resize({ height: 1920, width: 1080, fit: "contain" })
                        .toBuffer();
                   const imageKey = randomImageName();
                    const params = {
                        Bucket: "bookstore-web-app",
                        Key: imageKey,
                        Body: buffer,
                        ContentType: "image/jpeg",
                    };
                    const command = new PutObjectCommand(params);
                    await s3Client.send(command);
                    imageUrl = imageKey;
                } catch (error: any) {
                    console.error("Error uploading image:", error);
                    return res
                        .status(500)
                        .json({ message: "Failed to upload image" });
                }
            }

            // if (imageKey) {
            //     const getObjectParams: GetObjectCommandInput = {
            //         Bucket: config.BUCKET_NAME,
            //         Key: imageKey,
            //     };
            //     const command = new GetObjectCommand(getObjectParams);
            //     imageUrl =
            //         (await getSignedUrl(s3Client, command, {
            //             expiresIn: 3600,
            //         })) || undefined;
            // }

            const data = { name, email, image: imageUrl };
            user = await userService.getCreateUserByGoogle(data);

            if (user) {
                const userId = user._id.toString();
                const { accessToken, refreshToken } = generateTokens(res, {
                    userId,
                    userRole: "user",
                });
                const imagee = user.image
                if (imagee) {
                    const signedUrl = await getSignedUrl(
                        s3Client, 
                        new GetObjectCommand({
                            Bucket: "bookstore-web-app",
                            Key: imagee
                        }), 
                        { expiresIn: 604800 } 
                    );
    
                    return res.status(200).json({ user: { ...user.toObject(), image: signedUrl ,accessToken, refreshToken } });
                }
    
                // return res
                //     .status(200)
                //     .json({ user, accessToken, refreshToken });
            } else {
                return res
                    .status(500)
                    .json({ message: "Failed to create user" });
            }
        }
    } catch (error: any) {
        console.error("Error in loginByGoogle:", error);
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

const googleLog = async (req: Request, res: Response) => {
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
        console.log("Error googleLog:", error);
        return res.status(400).json({ message: "Internal server error" });
    }
};

const updateUser = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const { formData } = req.body;
        const { name, email, phone,street, city, district, state,pincode } = formData;
        const userId = req.userId!;

        const userExist: IUser | null = await userService.getUserById(userId);
        if (!userExist) {
            return res.status(404).json({ message: "User not found" });
        }

        const user: Partial<IUser> = {
            name,
            email,
            phone,
            address:{
            street,
            city,
            district,
            state,
            pincode
            }
        };
        // const filteredUser = Object.fromEntries(
        //     Object.entries(user).filter(
        //       ([_, value]) => typeof value === 'string' && value.trim() !== ""
        //     )
        //   );
          
        const updatedUser = await userService.getUpdateUser(
            userId,
            user
        );

        return res.status(200).json({ user: updatedUser });
    } catch (error: any) {
        console.error("Error updating user:", error.message);
        return res.status(500).json({ error: "Internal server error" });
    }
};
const updateProfileImage = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const userId = req.userId!;
        const userExist: IUser | null = await userService.getUserById(userId);
        if (!userExist) {
            return res.status(404).json({ message: "User not found" });
        }
        let imageUrl: string = "";
        if (req.file) {
            const buffer = await sharp(req.file.buffer)
                .resize({ height: 1920, width: 1080, fit: "contain" })
                .toBuffer();

           const imageKey = randomImageName();
            const params = {
                Bucket: "bookstore-web-app",
                Key: imageKey,
                Body: buffer,
                ContentType: req.file.mimetype,
            };

            const command = new PutObjectCommand(params);
            try {
                await s3Client.send(command);
                imageUrl=imageKey
                console.log(imageUrl,'imageurl is saved')
            } catch (error: any) {
                console.error("Error uploading image:", error);
                return res
                    .status(500)
                    .json({ message: "Failed to upload image" });
            }
        }
        const user = await userService.getUpdateProfileImage(userId, imageUrl);
        if (user) {
            if (imageUrl) {
                const signedUrl = await getSignedUrl(
                    s3Client, 
                    new GetObjectCommand({
                        Bucket: "bookstore-web-app",
                        Key: imageUrl
                    }), 
                    { expiresIn: 604800 } 
                );

                return res.status(200).json({ user: { ...user.toObject(), image: signedUrl } });
            }

            // return res.status(200).json({ user });
        } else {
            return res.status(404).json({ message: "User not found after updating profile image" });
        }
      
    } catch (error: any) {
        console.error("Error updating user:", error.message);
        return res.status(500).json({ error: "Internal server error" });
    }
};

const deleteUserImage = async (req: AuthenticatedRequest, res: Response) => {
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
        console.log(imageToRemove, "image to remove delte function controller");
        const user = await userService.getDeleteUserImage(userId);
        return res.status(200).json({ user });
    } catch (error) {
        console.log("Error deleteUserImage:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};
const verifyEmail = async (req: Request, res: Response) => {
    try {
        const { email } = req.body;
        let isValidEmail: IUser | null = await userService.getUserByEmail(
            email
        );
        if (isValidEmail) {
            return res.status(200).json({ isValidEmail });
        } else {
            return res.status(401).json({ message: "Invalid email" });
        }
    } catch (error: any) {
        console.log(error.message);
        return res.status(500).json({ error: "Internal server error" });
    }
};

const updatePassword = async (req: Request, res: Response) => {
    try {
        const { resetToken, resetTokenExpiration, password, email } = req.body;

        console.log(email, password);
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
        console.log(user, "user password update");
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

const sendUnlinkEmail = async (req: AuthenticatedRequest, res: Response) => {
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


const getUser = async (req: Request, res: Response) => {
    try {
        const { receiverId } = req.params;
        if (!receiverId) {
            return res
                .status(400)
                .json({ message: "User ID not found in request" });
        }

        const receiver = await userService.getUserById(receiverId);
        if (!receiver) {
            return res.status(404).json({ message: "User not found" });
        }
        return res.status(200).json({ receiver });
    } catch (error: any) {
        console.log(error.message);
        return res
            .status(500)
            .json({ message: "Internal server error at notifications" });
    }
};
const calculateDistance = async(req:Request,res:Response)=>{
    try{
        const key = 'AIzaSyD06G78Q2_d18EkXbsYsyg7qb2O-WWUU-Q';
        const {lat1,lng1,lat2,lng2} = req.query;
        if(!lat1 || !lat2 || !lng1 ||!lng2){
            return res.status(500).json({message:"Error while getting while calculating distance"})
        }
        // console.log(lat1,'lat1',lat2,'lat2',lng1,'lng1',lng2,'lng2')
        const origin = `${lat1},${lng1}`;
        const destination = `${lat2},${lng2}`;

        const url = `https://maps.googleapis.com/maps/api/distancematrix/json?units=metric&origins=${origin}&destinations=${destination}&key=${key}`;
        try {
            const response = await axios.get(url);
            const data = response.data;
            // console.log(data,'data')
            if (data.status === "OK") {
                const distance = data.rows[0].elements[0].distance.value; 
                console.log(distance / 1000, 'distance km');
                const distanceResponse = distance/1000;
                return res.status(200).json({distanceResponse})

            } else {
                console.error('Error in Google Maps API response:', data.error_message);
                return null;
            }
            console.log(data,'data google distance')
        } catch (error) {
            console.error('Error fetching road distance:', error);
            return null;
        }
    }catch(error:any){
        console.log("Error calculateDistance controller:",error)
        return res
        .status(500)
        .json({ message: "Internal server error at calculateDistance" });
    }
}


const userDetails = async(req:Request,res:Response)=>{
    try{
        const {lenderId} = req.params;
        if(!lenderId){
            return res.status(500).json({message:"Lender id not found"});
        }
        const lender = await userService.getUserById(lenderId)
        return res.status(200).json({lender})
    }catch(error:any){
        console.log("Error userDetails:",error);
        return res.status(500).json({message: "Internal server error at userDetails"})
    }
}

export {
    signUp,
    generateOtp,
    loginUser,
    loginByGoogle,
    verifyEmail,
    verifyOtp,
    updatePassword,
    logoutUser,
    updateUser,
    updateProfileImage,
    deleteUserImage,
    getUser,
    sendUnlinkEmail,
    googleLog,
    linkGoogleAccount,
    calculateDistance,
    userDetails,
};
