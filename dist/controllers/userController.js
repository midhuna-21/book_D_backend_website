"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyEmail = exports.sendOTP = exports.userDetails = exports.calculateDistance = exports.linkGoogleAccount = exports.googleLog = exports.sendUnlinkEmail = exports.getUser = exports.deleteUserImage = exports.updateProfileImage = exports.updateUser = exports.logoutUser = exports.updatePassword = exports.verifyOtp = exports.verifyPhoneNumber = exports.loginByGoogle = exports.loginUser = exports.generateOtp = exports.signUp = void 0;
const passwordValidation_1 = require("../utils/ReuseFunctions/passwordValidation");
const userService_1 = require("../services/userService");
const otpGenerate_1 = require("../utils/ReuseFunctions/otpGenerate");
const userGenerateToken_1 = require("../utils/jwt/userGenerateToken");
const crypto_1 = __importDefault(require("crypto"));
const axios_1 = __importDefault(require("axios"));
const client_s3_1 = require("@aws-sdk/client-s3");
const config_1 = __importDefault(require("../config/config"));
const store_1 = require("../utils/imageFunctions/store");
const getImageFromS3_1 = require("../utils/imageFunctions/getImageFromS3");
const sendEmail_1 = require("../utils/ReuseFunctions/sendEmail");
const twilio_1 = require("twilio");
const uploadImageToS3 = async (imageBuffer, fileName) => {
    const uploadParams = {
        Bucket: config_1.default.BUCKET_NAME,
        Key: fileName,
        Body: imageBuffer,
        ContentType: "image/jpeg",
    };
    const command = new client_s3_1.PutObjectCommand(uploadParams);
    await store_1.s3Client.send(command);
    return `https://${config_1.default.BUCKET_NAME}.s3.${config_1.default.BUCKET_REGION}.amazonaws.com/${fileName}`;
};
const twilioClient = new twilio_1.Twilio(config_1.default.TWILIO_ACCOUNT_SID, config_1.default.TWILIO_AUTH_TOKEN);
const userService = new userService_1.UserService();
const sendOTP = async (req, res) => {
    try {
        const { phone } = req.body;
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        console.log(otp, "otp");
        const message = await twilioClient.messages.create({
            body: `Your verification code is ${otp} for our Book.D website`,
            from: "+13146280298",
            to: phone,
        });
        res.cookie("otp", otp, { maxAge: 60000 });
        return res
            .status(200)
            .json({ message: "OTP generated and sent successfully" });
    }
    catch (error) {
        console.error("Error sending OTP:", error);
        throw error;
    }
};
exports.sendOTP = sendOTP;
const signUp = async (req, res) => {
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
        const securePassword = await (0, passwordValidation_1.hashPassword)(password);
        const user = { name, email, phone, password: securePassword };
        return res.status(200).json({ user });
    }
    catch (error) {
        console.error(error.message);
        return res.status(400).json({ message: "Internal server error" });
    }
};
exports.signUp = signUp;
const randomImageName = (bytes = 32) => crypto_1.default.randomBytes(bytes).toString("hex");
const generateOtp = async (req, res) => {
    try {
        const { email } = req.body;
        let otp = await (0, otpGenerate_1.otpGenerate)(email);
        console.log(otp, "otp");
        res.cookie("otp", otp, { maxAge: 60000 });
        return res
            .status(200)
            .json({ message: "OTP generated and sent successfully" });
    }
    catch (error) {
        console.log(error.message);
        return res.status(400).json({ message: "internal s erver error" });
    }
};
exports.generateOtp = generateOtp;
const verifyOtp = async (req, res) => {
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
            const user = await userService.getCreateUser({
                name,
                email,
                phone,
                password,
            });
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }
            else {
                const userId = user._id.toString();
                const { accessToken, refreshToken } = (0, userGenerateToken_1.userGenerateTokens)(res, {
                    userId,
                    role: "user",
                });
                return res
                    .status(200)
                    .json({ user, accessToken, refreshToken, origin });
            }
        }
        else {
            let user = await userService.getUserByPhone(phone);
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }
            return res.status(200).json({ user, origin });
        }
    }
    catch (error) {
        console.error(error.message);
        return res.status(500).json({ message: "Internal server error" });
    }
};
exports.verifyOtp = verifyOtp;
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        let user = await userService.getUserByEmail(email);
        if (!user) {
            return res.status(400).json({ message: "Invalid email" });
        }
        if (user.isBlocked) {
            return res.status(400).json({
                message: "user is blocked, please contact admin to get your account back",
            });
        }
        if (!user.password) {
            return res.status(400).json({ message: "Invalid password" });
        }
        const isPasswordValid = await (0, passwordValidation_1.comparePassword)(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid password" });
        }
        const userId = user._id.toString();
        const { accessToken, refreshToken } = (0, userGenerateToken_1.userGenerateTokens)(res, {
            userId,
            role: "user",
        });
        return res.status(200).json({ user, accessToken, refreshToken });
    }
    catch (error) {
        console.error(error.message);
        return res.status(500).json({ message: "Internal server error" });
    }
};
exports.loginUser = loginUser;
const loginByGoogle = async (req, res) => {
    try {
        const { name, email, image } = req.body;
        let existUser = await userService.getUserByEmail(email);
        if (existUser?.isBlocked == true) {
            return res.status(401).json({ message: "User is Blocked" });
        }
        if (existUser?.isGoogle == true) {
            const userId = existUser._id.toString();
            const { accessToken, refreshToken } = (0, userGenerateToken_1.userGenerateTokens)(res, {
                userId,
                role: "user",
            });
            return res
                .status(200)
                .json({ user: existUser, accessToken, refreshToken });
        }
        else if (existUser?.isGoogle == false) {
            return res.status(400).json({
                message: "Your email is not linked with google.",
            });
        }
        else {
            let imageUrl;
            if (image) {
                try {
                    const response = await axios_1.default.get(image, {
                        responseType: "arraybuffer",
                    });
                    const imageBuffer = Buffer.from(response.data, "binary");
                    const fileName = `${Date.now()}-${name.replace(/\s+/g, "_")}-google-profile.jpg`;
                    imageUrl = await uploadImageToS3(imageBuffer, fileName);
                }
                catch (uploadError) {
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
            }
            else {
                const userId = user._id.toString();
                const { accessToken, refreshToken } = (0, userGenerateToken_1.userGenerateTokens)(res, {
                    userId,
                    role: "user",
                });
                return res.status(200).json({
                    user: {
                        ...user.toObject(),
                        accessToken,
                        refreshToken,
                    },
                });
            }
        }
    }
    catch (error) {
        console.error("Error in loginByGoogle:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};
exports.loginByGoogle = loginByGoogle;
const linkGoogleAccount = async (req, res) => {
    try {
        const { email, password } = req.body;
        const isUser = await userService.getUserByEmail(email);
        if (!isUser) {
            return res.status(400).json({ message: "user not found" });
        }
        const isPasswordValid = await (0, passwordValidation_1.comparePassword)(password, isUser.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: "password is incorrect" });
        }
        const user = await userService.getUpdateIsGoogleTrue(email);
        return res.status(200).json({ user });
    }
    catch (error) {
        console.log("Error linkGoogleAccount:", error);
        return res.status(400).json({ message: "Internal server error" });
    }
};
exports.linkGoogleAccount = linkGoogleAccount;
const googleLog = async (req, res) => {
    try {
        const credentialResponse = req.body;
        if (!credentialResponse) {
            return res.status(400).json({ message: "Internal server error" });
        }
        const response = await axios_1.default.get("https://www.googleapis.com/oauth2/v1/userinfo", {
            headers: {
                Authorization: `Bearer ${credentialResponse.access_token}`,
            },
        });
        return res.status(200).json(response.data);
    }
    catch (error) {
        console.log("Error googleLog:", error);
        return res.status(400).json({ message: "Internal server error" });
    }
};
exports.googleLog = googleLog;
const updateUser = async (req, res) => {
    try {
        const { formData } = req.body;
        const { name, email, phone, address } = formData;
        const { street, city, district, state, pincode } = address;
        const userId = req.userId;
        const userExist = await userService.getUserById(userId);
        if (!userExist) {
            return res.status(404).json({ message: "User not found" });
        }
        const user = {
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
    }
    catch (error) {
        console.error("Error updating user:", error.message);
        return res.status(500).json({ error: "Internal server error" });
    }
};
exports.updateUser = updateUser;
const updateProfileImage = async (req, res) => {
    try {
        const userId = req.userId;
        const userExist = await userService.getUserById(userId);
        if (!userExist) {
            return res.status(404).json({ message: "User not found" });
        }
        const file = req.file;
        if (!file || !file.location) {
            return res.status(400).json({ message: "No file uploaded" });
        }
        let imageUrl = file.location;
        const user = await userService.getUpdateProfileImage(userId, imageUrl);
        return res.status(200).json({ user });
    }
    catch (error) {
        console.error("Error updating user:", error.message);
        return res.status(500).json({ error: "Internal server error" });
    }
};
exports.updateProfileImage = updateProfileImage;
const deleteUserImage = async (req, res) => {
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
            Bucket: config_1.default.BUCKET_NAME,
            Key: imageToRemove,
        };
        const command = new client_s3_1.DeleteObjectCommand(deleteParams);
        await store_1.s3Client.send(command);
        const user = await userService.getDeleteUserImage(userId);
        return res.status(200).json({ user });
    }
    catch (error) {
        console.log("Error deleteUserImage:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};
exports.deleteUserImage = deleteUserImage;
const verifyEmail = async (req, res) => {
    try {
        const { email } = req.body;
        let isValidEmail = await userService.getUserByEmail(email);
        if (isValidEmail) {
            return res.status(200).json({ isValidEmail });
        }
        else {
            return res.status(401).json({ message: "Invalid email id" });
        }
    }
    catch (error) {
        console.log(error.message);
        return res.status(500).json({ error: "Internal server error" });
    }
};
exports.verifyEmail = verifyEmail;
const verifyPhoneNumber = async (req, res) => {
    try {
        const { phone } = req.body;
        let isValidPhone = await userService.getUserByPhone(phone);
        if (isValidPhone) {
            return res.status(200).json({ isValidPhone });
        }
        else {
            return res.status(401).json({ message: "Invalid Phone number" });
        }
    }
    catch (error) {
        console.log(error.message);
        return res.status(500).json({ error: "Internal server error" });
    }
};
exports.verifyPhoneNumber = verifyPhoneNumber;
const updatePassword = async (req, res) => {
    try {
        const { resetToken, resetTokenExpiration, password, email } = req.body;
        const isGmail = await userService.getUserByGmail(email);
        const gmail = isGmail?.email;
        if (isGmail) {
            const udateIsGoogle = await userService.getUpdateIsGoogle(gmail, resetToken, resetTokenExpiration);
        }
        const securePassword = await (0, passwordValidation_1.hashPassword)(password);
        const data = {
            email,
            password: securePassword,
            resetToken,
            resetTokenExpiration,
        };
        const user = await userService.getUpdatePassword(data);
        if (user?.image) {
            user.image = await (0, getImageFromS3_1.getSignedImageUrl)(user.image);
        }
        return res.status(200).json({ user });
    }
    catch (error) {
        console.log(error.message);
        return res.status(500).json({ error: "Internal server error" });
    }
};
exports.updatePassword = updatePassword;
const logoutUser = async (req, res) => {
    try {
        res.clearCookie("token", { httpOnly: true, secure: true });
        return res.status(200).json({ message: "Logout successfully" });
    }
    catch (error) {
        console.error(error.message);
        return res.status(400).json({ message: "Internal server error" });
    }
};
exports.logoutUser = logoutUser;
const sendUnlinkEmail = async (req, res) => {
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
        const resetToken = crypto_1.default.randomBytes(32).toString("hex");
        const resetTokenExpiration = Date.now() + 15 * 60 * 1000;
        const user = await userService.getSaveToken(userId, resetToken, resetTokenExpiration);
        const send = await (0, sendEmail_1.sendEmail)(userId, email, resetToken, resetTokenExpiration);
        return res.status(200).json({ user });
    }
    catch (error) {
        console.error(error.message);
        return res.status(400).json({ message: "Internal server error" });
    }
};
exports.sendUnlinkEmail = sendUnlinkEmail;
const getUser = async (req, res) => {
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
        if (receiver?.image) {
            receiver.image = await (0, getImageFromS3_1.getSignedImageUrl)(receiver?.image);
        }
        return res.status(200).json({ receiver });
    }
    catch (error) {
        console.log(error.message);
        return res
            .status(500)
            .json({ message: "Internal server error at notifications" });
    }
};
exports.getUser = getUser;
const calculateDistance = async (req, res) => {
    try {
        const key = "AIzaSyD06G78Q2_d18EkXbsYsyg7qb2O-WWUU-Q";
        const { lat1, lng1, lat2, lng2 } = req.query;
        if (!lat1 || !lat2 || !lng1 || !lng2) {
            return res.status(500).json({
                message: "Error while getting while calculating distance",
            });
        }
        // console.log(lat1,'lat1',lat2,'lat2',lng1,'lng1',lng2,'lng2')
        const origin = `${lat1},${lng1}`;
        const destination = `${lat2},${lng2}`;
        const url = `https://maps.googleapis.com/maps/api/distancematrix/json?units=metric&origins=${origin}&destinations=${destination}&key=${key}`;
        try {
            const response = await axios_1.default.get(url);
            const data = response.data;
            // console.log(data,'data')
            if (data.status === "OK") {
                const distance = data.rows[0].elements[0].distance.value;
                const distanceResponse = distance / 1000;
                return res.status(200).json({ distanceResponse });
            }
            else {
                console.error("Error in Google Maps API response:", data.error_message);
                return null;
            }
        }
        catch (error) {
            console.error("Error fetching road distance:", error);
            return null;
        }
    }
    catch (error) {
        console.log("Error calculateDistance controller:", error);
        return res
            .status(500)
            .json({ message: "Internal server error at calculateDistance" });
    }
};
exports.calculateDistance = calculateDistance;
const userDetails = async (req, res) => {
    try {
        const { lenderId } = req.params;
        if (!lenderId) {
            return res.status(500).json({ message: "Lender id not found" });
        }
        const lender = await userService.getUserById(lenderId);
        if (lender?.image) {
            lender.image = await (0, getImageFromS3_1.getSignedImageUrl)(lender.image);
        }
        return res.status(200).json({ lender });
    }
    catch (error) {
        console.log("Error userDetails:", error);
        return res
            .status(500)
            .json({ message: "Internal server error at userDetails" });
    }
};
exports.userDetails = userDetails;
//# sourceMappingURL=userController.js.map