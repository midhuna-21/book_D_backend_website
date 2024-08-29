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
    S3Client,
} from "@aws-sdk/client-s3";
import config from "../config/config";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { IUser } from "../model/userModel";
import { User,Books,Requests,Order} from "../interfaces/data";
import { IGenre } from "../model/genresModel";
import { Types } from "mongoose";
import { IBooks } from "../model/bookModel";
import { Notification } from "../interfaces/data";
import { INotification } from "../model/notificationModel";
import rentBookValidation from "../utils/ReuseFunctions/rentBookValidation";
import sellBookValidation from "../utils/ReuseFunctions/sellBookValidation";
import { AuthenticatedRequest } from "../utils/middleware/authMiddleware";
import { s3Client } from "../utils/imageFunctions/store";
import { IChatRoom } from "../model/chatRoom";
import { sendEmail } from "../utils/ReuseFunctions/sendEmail";
import { IMessage } from "../model/message";
import Stripe from 'stripe';

const userService = new UserService();
const adminService = new AdminService();

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

const genresOfBooks = async (req: Request, res: Response) => {
    try {
        const genres: IGenre[] = await userService.getAllGenres();
        for (const genre of genres) {
            if (genre.image) {
                const getObjectParams = {
                    Bucket: config.BUCKET_NAME,
                    Key: genre.image,
                };

                const command = new GetObjectCommand(getObjectParams);
                const url = await getSignedUrl(s3Client, command, {
                    expiresIn: 3600,
                });
                genre.image = url;
            } else {
                genre.image = " ";
            }
        }

        return res.status(200).json(genres);
    } catch (error: any) {
        console.log(error.message);
        return res.status(500).json({ message: "Internal server error" });
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
        return res.status(200).json({ user, accessToken, refreshToken });
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
            return res.status(200).json({ user, accessToken, refreshToken });
        } else if (user?.isGoogle == false) {
            return res
                .status(400)
                .json({
                    message:
                        "Your email is not linked with google.Enter your email and password.",
                });
        } else {
            let imageKey: string | undefined;
            if (image) {
                try {
                    const imageResponse = await axios.get(image, {
                        responseType: "arraybuffer",
                    });
                    const buffer = await sharp(imageResponse.data)
                        .resize({ height: 1920, width: 1080, fit: "contain" })
                        .toBuffer();
                    imageKey = randomImageName();
                    const params = {
                        Bucket: "bookstore-web-app",
                        Key: imageKey,
                        Body: buffer,
                        ContentType: "image/jpeg",
                    };
                    const command = new PutObjectCommand(params);
                    await s3Client.send(command);
                } catch (error: any) {
                    console.error("Error uploading image:", error);
                    return res
                        .status(500)
                        .json({ message: "Failed to upload image" });
                }
            }
            console.log(imageKey,'imageKey')

            let imageUrl: string | undefined;
            if (imageKey) {
                const getObjectParams: GetObjectCommandInput = {
                    Bucket: config.BUCKET_NAME,
                    Key: imageKey,
                };
                const command = new GetObjectCommand(getObjectParams);
                imageUrl =
                    (await getSignedUrl(s3Client, command, {
                        expiresIn: 3600,
                    })) || undefined;
            }

            const data = { name, email, image: imageUrl };
            user = await userService.getCreateUserByGoogle(data);

            if (user) {
                const userId = user._id.toString();
                const { accessToken, refreshToken } = generateTokens(res, {
                    userId,
                    userRole: "user",
                });
                return res
                    .status(200)
                    .json({ user, accessToken, refreshToken });
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
        // console.log(response,'response at controller')
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

        let imageKey: string | undefined;
        if (req.file) {
            const buffer = await sharp(req.file.buffer)
                .resize({ height: 1920, width: 1080, fit: "contain" })
                .toBuffer();

            imageKey = randomImageName();
            const params = {
                Bucket: "bookstore-web-app",
                Key: imageKey,
                Body: buffer,
                ContentType: req.file.mimetype,
            };

            const command = new PutObjectCommand(params);
            try {
                await s3Client.send(command);
            } catch (error: any) {
                console.error("Error uploading image:", error);
                return res
                    .status(500)
                    .json({ message: "Failed to upload image" });
            }
        }
        let imageUrl: string = "";
        if (imageKey) {
            const getObjectParams: GetObjectCommandInput = {
                Bucket: "bookstore-web-app",
                Key: imageKey,
            };
            const command = new GetObjectCommand(getObjectParams);
            imageUrl = await getSignedUrl(s3Client, command, {
                expiresIn: 3600,
            });
        }
        const user = await userService.getUpdateProfileImage(userId, imageUrl);

        return res.status(200).json({ user });
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

const rentBook = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const {
            bookTitle,
            description,
            author,
            publisher,
            publishedYear,
            genre,
            rentalFee,
            extraFee,
            quantity,
            street,
            city,
            district,
            state,
            pincode,
            maxDistance,
            maxDays,
            minDays,
            latitude,
            longitude

        } = req.body;

        if (!req.userId) {
            return res
                .status(403)
                .json({ message: "User ID not found in request" });
        }
        const userId = req.userId;

        const files = req.files as Express.Multer.File[];

        if (!files || files.length === 0) {
            return res
                .status(404)
                .json({ message: "Please provide book images" });
        }

        const imageUrls: string[] = [];

        for (let i = 0; i < files.length; i++) {
            const buffer = await sharp(files[i].buffer)
                .resize({ height: 1920, width: 1080, fit: "contain" })
                .toBuffer();

            const imageKey = randomImageName();

            const params = {
                Bucket: "bookstore-web-app",
                Key: imageKey,
                Body: buffer,
                ContentType: files[i].mimetype,
            };
  
            const command = new PutObjectCommand(params);

            try {
                await s3Client.send(command);
                imageUrls.push(imageKey);
            } catch (error: any) {
                console.error(error);
                return res
                    .status(500)
                    .json({ message: `Failed to upload image ${i}` });
            }
            console.log(imageKey,'imagekey atr rented fucntion ')
        }
        const bookRentData: Books = {
            bookTitle,
            description,
            author,
            publisher,
            publishedYear,
            genre,
            images: imageUrls,
            rentalFee,
            extraFee,
            quantity,
            address:{
                street,
                city,
                district,
                state,
                pincode
               },
            isRented: true,
            lenderId: userId,
            maxDistance,
            maxDays,
            minDays,
            latitude,
            longitude
        };

        const validationError = rentBookValidation(bookRentData);
        if (validationError) {
            return res.status(400).json({ message: validationError });
        }

        const bookAdded = await userService.getAddToBookRent(bookRentData);
        return res
            .status(200)
            .json({ message: "Book rented successfully", bookAdded });
    } catch (error: any) {
        console.error("Error renting book:", error.message);
        return res.status(500).json({ error: "Internal server error" });
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

const sellBook = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const {
            bookTitle,
            description,
            author,
            publisher,
            publishedYear,
            genre,
            price,
            quantity,
            street,
            city,
            district,
            state,
            pincode,
            latitude,
            longitude
        } = req.body;

        if (!req.userId) {
            return res
                .status(403)
                .json({ message: "User ID not found in request" });
        }
        const userId = req.userId;

        const images = req.files as Express.Multer.File[];

        if (!images || images.length === 0) {
            return res
                .status(404)
                .json({ message: "Please provide book images" });
        }

        const bookImages: string[] = [];
        for (let i = 0; i < images.length; i++) {
            const buffer = await sharp(images[i].buffer)
                .resize({ height: 1920, width: 1080, fit: "contain" })
                .toBuffer();

            const image = randomImageName();

            const params = {
                Bucket: "bookstore-web-app",
                Key: image,
                Body: buffer,
                ContentType: images[i].mimetype,
            };

            const command = new PutObjectCommand(params);

            try {
                await s3Client.send(command);
                bookImages.push(image);
            } catch (error: any) {
                console.error(error);
                return res
                    .status(404)
                    .json({ message: `Failed to upload image ${i}` });
            }
        }
        const bookSelldata: Books = {
            bookTitle,
            description,
            author,
            publisher,
            publishedYear,
            genre,
            images: bookImages,
            price,
            quantity,
           address:{
            street,
            city,
            state,
            district,
            pincode
           },
            lenderId: userId,
            latitude,
            longitude
        };
        const validationError = sellBookValidation(bookSelldata);
        if (validationError) {
            return res.status(400).json({ message: validationError });
        }
        await userService.getAddToBookSell(bookSelldata);
        return res
            .status(200)
            .json({ message: "Book sold successfully", bookSelldata });
    } catch (error: any) {
        console.error("Error renting book:", error.message);
        return res.status(404).json({ error: "Internal server error" });
    }
};

const exploreBooks = async (
    req: AuthenticatedRequest,
    res: Response
): Promise<Response> => {
    try {
        const userId = req.userId;

        const allBooks: IBooks[] = await userService.getAllBooks();
        const booksToShow: IBooks[] = [];

        for (const book of allBooks) {
            if (book.lenderId !== userId) {
                const isLenderExist = await userService.getUserById(
                    book.lenderId
                );
                if (isLenderExist && !isLenderExist.isBlocked) {
                    if (book.images && Array.isArray(book.images)) {
                        const imageUrls = await Promise.all(
                            book.images.map(async (imageKey: string) => {
                                const getObjectParams: GetObjectCommandInput = {
                                    Bucket: config.BUCKET_NAME,
                                    Key: imageKey,
                                };
                                const command = new GetObjectCommand(
                                    getObjectParams
                                );
                                return await getSignedUrl(s3Client, command, {
                                    expiresIn: 3600,
                                });
                            })
                        );
                        book.images = imageUrls;
                    } else {
                        book.images = [];
                    }
                }
                booksToShow.push(book);
            }
        }

        return res.status(200).json(booksToShow);
    } catch (error: any) {
        console.log(error.message);
        return res.status(500).json({ message: "Internal server error" });
    }
};

const rentedBooks = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const userId = req.userId;
        const allBooks: IBooks[] = await userService.getAllBooks();
        const booksToShow: IBooks[] = [];

        for (const book of allBooks) {
            if (book.lenderId == userId && book.isRented) {
                // const isLenderExist = await userService.getUserById(book.lenderId);
                // if(isLenderExist && !isLenderExist.isBlocked ){
                if (book.images && Array.isArray(book.images)) {
                    const imageUrls = await Promise.all(
                        book.images.map(async (imageKey: string) => {
                            const getObjectParams: GetObjectCommandInput = {
                                Bucket: config.BUCKET_NAME,
                                Key: imageKey,
                            };
                            const command = new GetObjectCommand(
                                getObjectParams
                            );
                            return await getSignedUrl(s3Client, command, {
                                expiresIn: 3600,
                            });
                        })
                    );
                    book.images = imageUrls;
                } else {
                    book.images = [];
                }
                booksToShow.push(book);
            }
            // }
        }

        return res.status(200).json(booksToShow);
    } catch (error: any) {
        console.log("Error rentedBooks:", error);
    }
};
const soldBooks = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const userId = req.userId;
        const allBooks: IBooks[] = await userService.getAllBooks();
        const booksToShow: IBooks[] = [];

        for (const book of allBooks) {
            if (book.lenderId == userId && book.isSell) {
                if (book.images && Array.isArray(book.images)) {
                    const imageUrls = await Promise.all(
                        book.images.map(async (imageKey: string) => {
                            const getObjectParams: GetObjectCommandInput = {
                                Bucket: config.BUCKET_NAME,
                                Key: imageKey,
                            };
                            const command = new GetObjectCommand(
                                getObjectParams
                            );
                            return await getSignedUrl(s3Client, command, {
                                expiresIn: 3600,
                            });
                        })
                    );
                    book.images = imageUrls;
                } else {
                    book.images = [];
                }
                booksToShow.push(book);
            }
        }
        console.log(booksToShow);

        return res.status(200).json(booksToShow);
    } catch (error: any) {
        console.log("Error rentedBooks:", error);
    }
};
const genres = async (req: Request, res: Response): Promise<Response> => {
    try {
        const genres: IGenre[] = await userService.getAllGenres();

        for (const genre of genres) {
            if (genre.image && typeof genre.image === "string") {
                const getObjectParams: GetObjectCommandInput = {
                    Bucket: config.BUCKET_NAME,
                    Key: genre.image,
                };
                const command = new GetObjectCommand(getObjectParams);
                const imageUrl = await getSignedUrl(s3Client, command, {
                    expiresIn: 3600,
                });
                genre.image = imageUrl;
            } else {
                genre.image = "";
            }
        }

        return res.status(200).json(genres);
    } catch (error: any) {
        console.log(error.message);
        return res.status(500).json({ message: "Internal server error" });
    }
};
 
const bookDetail = async (req: Request, res: Response) => {
    try {
        const bookId = req.params.Id as string;
        const book: IBooks | null = await userService.getBookById(bookId);

        if (!book) {
            return res.status(500).json({ message: "Book is not found " });
        }
        const lenderId: string = book.lenderId;
        const lender = await userService.getUserById(lenderId);

        return res.status(200).json({ book, lender });
    } catch (error: any) {
        console.log(error.message);
        return res.status(500).json({ message: "Internal server error" });
    }
};
const lenderDetails = async (req: Request, res: Response) => {
    try {
        // const bookId = req.params.Id as string;
        // const book: IBooks | null = await userService.getBookById(bookId);

        // if (!book) {
        //     return res.status(500).json({ message: "Book is not found " });
        // }
        // const lenderId: string = book.lenderId;
        // const lender = await userService.getUserById(lenderId);

        return res.status(200).json({ });
    } catch (error: any) {
        console.log(error.message);
        return res.status(500).json({ message: "Internal server error" });
    }
};
const sendNotification = async (req: Request, res: Response) => {
    try {
       
        const { senderId, notificationId, receiverId, bookId, type, content,requestId } =
            req.body;
        if (type == "accepted") {
            const notificationUpdate =
                await userService.getUpdateNotificationType(notificationId);
        }
        const data: Notification = {
            senderId,
            receiverId,
            bookId,
            type,
            content,
            requestId
        };
        const notification = await userService.getCreateNotification(data);
        return res.status(200).json({ notification });
    } catch (error: any) {
        console.log(error.message);
        return res.status(500).json({ message: "Internal server error" });
    }
};

const notifications = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const userId: string = req.userId!;

        if (!userId) {
            return res
                .status(400)
                .json({ message: "User ID not found in request" });
        }
        const notifications = await userService.getNotificationsByUserId(
            userId
        );

        return res.status(200).json({ notifications });
    } catch (error: any) {
        console.log(error.message);
        return res
            .status(500)
            .json({ message: "Internal server error at notifications" });
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
const createChatRoom = async (req: Request, res: Response) => {
    try {
        const { senderId, receiverId } = req.body;
        if (!senderId || !receiverId) {
            return res
                .status(400)
                .json({ message: "Missing userId or receiverId" });
        }
        const isExistChatRoom = await userService.getChatRoom(
            senderId,
            receiverId
        );
        if (isExistChatRoom) {
            return res.status(200).json({ isExistChatRoom });
        }
        const chatRoom: IChatRoom | null = await userService.getCreateChatRoom(
            senderId,
            receiverId
        );
        return res.status(200).json({ chatRoom });
    } catch (error: any) {
        console.log(error.message);
        return res.status(500).json({ message: "Internal server error" });
    }
};

const messageCreation = async (req: Request, res: Response) => {
    try {
        const { senderId, chatRoomId, content } = req.body;
    } catch (error) {
        console.log("Error messsageCreation", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

const userMessagesList = async (req: Request, res: Response) => {
    try {
        const { userId } = req.params;

        const conversations: IChatRoom[] | null =
            await userService.getUserMessagesList(userId);

        return res.status(200).json({ conversations });
    } catch (error) {
        console.log("Error messsageCreation", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

const chat = async (req: Request, res: Response) => {
    try {
        const { chatRoomId } = req.params;

        const chat = await userService.getUserChat(chatRoomId);

        return res.status(200).json({ chat });
    } catch (error) {
        console.log("Error messsageCreation", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

const sendMessage = async (req: Request, res: Response) => {
    try {
        const { senderId, receiverId, content, chatRoomId } = req.body;
        if (!senderId && !receiverId && !chatRoomId) {
            return res
                .status(500)
                .json({
                    message:
                        "senderId or receiverId or chatRoomId is not available",
                });
        }
        const savedMessage: IMessage | null = await userService.getSendMessage(
            senderId,
            receiverId,
            content,
            chatRoomId
        );
        const isExistChatRoom: IChatRoom | null = await userService.getChatRoom(
            senderId,
            receiverId
        );

        if (!isExistChatRoom) {
            return res.status(500).json({ message: "ChatRoom not found" });
        }
        if (!savedMessage) {
            return res.status(500).json({ message: "message is not saved" });
        }
        const chatRoomIdStr = isExistChatRoom._id as string;
        const messageIdStr = savedMessage._id as string;

        const saveChatRoom = await userService.getUpdateChatRoom(
            chatRoomIdStr,
            messageIdStr
        );
        const message: IMessage[] | null = await userService.getMesssage(
            messageIdStr
        );

        return res.status(200).json({ message });
    } catch (error) {
        console.log("Error sendMessage", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

const allMessages = async (req: Request, res: Response) => {
    try {
        const { chatRoomId } = req.params;
        if (!chatRoomId) {
            return res.status(400).json({ message: "chatroom ID not found" });
        }

        const messages = await userService.getAllMessages(chatRoomId);
        return res.status(200).json({ messages });
    } catch (error: any) {
        console.log("Error checkUserSent:", error);
        return res
            .status(500)
            .json({ message: "Internal server error at checkUserSent" });
    }
};

const checkAccept = async (req: Request, res: Response) => {
    try {
        const { userId, bookId } = req.params;
        if (!userId || !bookId) {
            return res
                .status(400)
                .json({ message: "User ID or Book ID not found in request" });
        }

        const isAccepted = await userService.getCheckAccepted(userId, bookId);
        console.log(isAccepted, "isRequested");
        return res.status(200).json({ isAccepted });
    } catch (error: any) {
        console.log("Error checkUserSent:", error);
        return res
            .status(500)
            .json({ message: "Internal server error at checkUserSent" });
    }
};

const checkUserSent = async (req: Request, res: Response) => {
    try {
        const { userId, bookId } = req.params;
        // console.log(bookId,'controller')
        if (!userId || !bookId) {
            return res
                .status(400)
                .json({ message: "User ID or Book ID not found in request" });
        }

        const isRequested = await userService.getCheckRequest(userId, bookId);

        return res.status(200).json({ isRequested });
    } catch (error: any) {
        console.log("Error checkUserSent:", error);
        return res
            .status(500)
            .json({ message: "Internal server error at checkUserSent" });
    }
};

const saveRequest = async (req: Request, res: Response) => {
    try {

        const { senderId,receiverId,bookId,types, totalDays,
            quantity,
            totalRentalPrice} = req.body;
        if(!senderId || !receiverId || !bookId){
            return res.status(500).json({message:"id is missing"})
        }
        const data:Requests | null  = { senderId,receiverId,bookId,types,totalDays,
            quantity,
            totalRentalPrice}
      const request = await userService.getSaveRequest(data)
     
      return res.status(200).json({request})
    } catch (error: any) {
        console.log("Error saveRequest:", error);
        return res
            .status(500)
            .json({ message: "Internal server error at saveRequest" });
    }
};

const acceptRequest = async (req: Request, res: Response) => {
    try {
        const {senderId,
            bookId,
            receiverId,
            types,
            requestId} = req.body;

            console.log(req.body,'body')
        if(!senderId || !bookId || !receiverId){
            return res.status(500).json({message:"id is missing"})
        }
        const findRequest = await userService.getRequestById(requestId);
        console.log(findRequest,'findRequest')
        if(!findRequest){
            return res.status(500).json({message:"request is not found"})
        }

      const request = await userService.getAcceptRequest(requestId,types)
     
      return res.status(200).json({request})
    } catch (error: any) {
        console.log("Error saveRequest:", error);
        return res
            .status(500)
            .json({ message: "Internal server error at saveRequest" });
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
const checkRequestAcceptOrNot = async (req: Request, res: Response) => {
    try {
        const { userId, bookId } = req.params;
    } catch (error: any) {
        console.log("Error checkUserSent:", error);
        return res
            .status(500)
            .json({ message: "Internal server error at checkUserSent" });
    }
};

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
const lendingProcess = async(req:Request,res:Response)=>{
    try{
        const {requestId} = req.params;
        console.log(requestId,'lenderId');
        if(!requestId){
            return res.status(500).json({message:"requestId not found"});
        }
        const details = await userService.getRequestDetails(requestId)
        return res.status(200).json({details})
    }catch(error:any){
        console.log("Error userDetails:",error);
        return res.status(500).json({message: "Internal server error at userDetails"})
    }
}
const stripeKey = config.STRIPE_KEY!
const stripe = new Stripe(stripeKey,{ apiVersion: '2024-06-20' })

const createCheckout = async (req:Request,res:Response) => {
    const { bookTitle, totalPrice, quantity,requestId, userId, lenderId, bookId, depositAmount } = req.body;
    try {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
          {
            price_data: {
              currency: "usd",
              product_data: {
                name: bookTitle,
              },
              unit_amount: totalPrice * 100, 
            },
            quantity: quantity,
          },
        ],
        mode: "payment",
        success_url: `${config.API}/home/payment-success?book_id=${bookId}&user_id=${userId}&request_id=${requestId}`,
        cancel_url: `${config.API}/payment-cancel`,
      });
      const sessionData = {
        sessionId:session.id,
        userId,
        lenderId,
        bookId,
        totalPrice,
        quantity,
        depositAmount,
      };
      await userService.getCreateOrderProcess(sessionData); 
      res.json({ id: session.id });
    } catch (error:any) {
      res.status(500).json({ error: error.message });
    }
  };
  
// const createCheckout = async (req: Request, res: Response) => {
//     try {
//         const { bookTitle,totalPrice, requestId, quantity } = req.body;
        
//         if (totalPrice === undefined || requestId === undefined || quantity === undefined || bookTitle === undefined) {
//             return res.status(400).json({ error: 'Invalid request payload. Required fields are missing.' });
//         }
//         const lineItems = [{
//             price_data: {
//                 currency: 'inr',
//                 product_data: {
//                     name:bookTitle
//                 },
//                 unit_amount: totalPrice * 100,
//             },
//             quantity: quantity,
//         }];

//         const session = await stripe.checkout.sessions.create({
//             payment_method_types: ['card'],
//             line_items: lineItems,
//             mode: 'payment',
//             success_url: 'http://localhost:5173/home',
//             cancel_url: 'http://localhost:5173/home',
//         });

//         res.status(200).json({ id: session.id });
//     } catch (error) {
//         console.error('Error creating checkout session:', error);
//         res.status(500).json({ error: 'An error occurred while creating the checkout session.' });
//     }
// };

const createOrder =  async (req: Request, res: Response) => {
    try {
        console.log(req.body,'f')
        const {userId,bookId,requestId} = req.body;
        
        if(!userId || !bookId){
            return res.status(400).json({message:"user or book id is missing"})
        }
        
        const order = await userService.getCreateOrder(userId,bookId)
        const requestUpdate = await userService.getUpdateRequest(requestId)
        res.status(200).json({order});
    } catch (error) {
        console.error('Error createOrder:', error);
        res.status(500).json({ error: 'An error occurred while create Order.' });
    }
};

const orders =  async (req: Request, res: Response) => {
    try {
  
        const {userId} = req.params;
     
        if(!userId){
            return res.status(400).json({message:"user is missing"})
        }
        
        const orders = await userService.getOrders(userId)
        res.status(200).json({orders});
    } catch (error) {
        console.error('Error createOrder:', error);
        res.status(500).json({ error: 'An error occurred getting Orders.' });
    }
};
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
    rentBook,
    sellBook,
    genresOfBooks,
    exploreBooks,
    genres,
    bookDetail,
    sendNotification,
    notifications,
    updateProfileImage,
    deleteUserImage,
    getUser,
    messageCreation,
    createChatRoom,
    checkUserSent,
    checkAccept,
    sendUnlinkEmail,
    googleLog,
    linkGoogleAccount,
    rentedBooks,
    soldBooks,
    userMessagesList,
    chat,
    sendMessage,
    allMessages,
    saveRequest,
    checkRequestAcceptOrNot,
    calculateDistance,
    userDetails,
    lenderDetails,
    acceptRequest,
    lendingProcess,
    createCheckout,
    createOrder,
    orders
};
