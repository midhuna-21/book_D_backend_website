"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserProfilePassword = exports.checkIsCurrentPassword = exports.checkUserIsblock = exports.sendOtpForForgotPassword = exports.computeLocationDistance = exports.linkGoogleAccount = exports.processGoogleLogin = exports.sendEmailForUnlinking = exports.removeUserProfileImage = exports.updateUserProfileImage = exports.updateUserProfile = exports.logoutUser = exports.resetUserPassword = exports.validateOtp = exports.authenticateWithGoogle = exports.authenticateUser = exports.requestOtpResend = exports.createNewUser = void 0;
const passwordValidation_1 = require("../utils/ReuseFunctions/passwordValidation");
const userService_1 = require("../services/user/userService");
const otpGenerator_1 = require("../utils/ReuseFunctions/otpGenerator");
const userGenerateToken_1 = require("../utils/jwt/userGenerateToken");
const crypto_1 = __importDefault(require("crypto"));
const axios_1 = __importDefault(require("axios"));
const client_s3_1 = require("@aws-sdk/client-s3");
const config_1 = __importDefault(require("../config/config"));
const store_1 = require("../utils/imageFunctions/store");
const sendEmail_1 = require("../utils/ReuseFunctions/sendEmail");
const userRepository_1 = require("../respository/user/userRepository");
const userModel_1 = require("../model/userModel");
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
const userRepository = new userRepository_1.UserRepository();
const userService = new userService_1.UserService(userRepository);
const createNewUser = async (req, res) => {
    try {
        const { name, email, phone, password } = req.body;
        let existUser = await userService.getUserIsVerified(email);
        if (existUser) {
            return res.status(400).json({ message: "Email already exist" });
        }
        if (!name || !email || !phone || !password) {
            return res.status(400).json({
                message: "Please ensure all required fields are filled out.",
            });
        }
        const securePassword = await (0, passwordValidation_1.hashPassword)(password);
        const otp = await (0, otpGenerator_1.generateOtp)(email);
        console.log(otp, "createNewUser");
        const userCreated = await userService.getCreateUser({
            name,
            email,
            phone,
            password: securePassword,
            otp,
        });
        const userId = userCreated?._id;
        setTimeout(async () => {
            await userModel_1.user.updateOne({ _id: userId }, { $unset: { otp: 1 } });
        }, 60000);
        return res.status(200).json({ user: userCreated });
    }
    catch (error) {
        console.error(error.message);
        return res.status(400).json({ message: "Internal server error" });
    }
};
exports.createNewUser = createNewUser;
const requestOtpResend = async (req, res) => {
    try {
        const { email, userId } = req.body;
        let otp = await (0, otpGenerator_1.generateOtp)(email);
        console.log(otp, "resend");
        await userService.getUpdateUserOtp(userId, otp);
        setTimeout(async () => {
            await userModel_1.user.updateOne({ email: email }, { $unset: { otp: 1 } });
        }, 60000);
        return res
            .status(200)
            .json({ message: "OTP generated and sent successfully" });
    }
    catch (error) {
        console.log(error.message);
        return res.status(400).json({ message: "internal s erver error" });
    }
};
exports.requestOtpResend = requestOtpResend;
const validateOtp = async (req, res) => {
    try {
        const { userId, response, origin } = req.body;
        const otp = Number(req.body.otp);
        const { email } = response;
        const isUser = await userService.getUserNotVerified(userId);
        if (!otp) {
            return res.status(400).json({ message: "please enter otp" });
        }
        if (!isUser?.otp) {
            return res.status(400).json({ message: "please click Resend OTP" });
        }
        if (otp !== isUser?.otp) {
            return res.status(400).json({ message: "Invalid OTP" });
        }
        if (origin === "sign-up") {
            const user = await userService.getUpdateUserIsVerified(isUser?._id.toString());
            if (user) {
                const userId = user._id.toString();
                const { accessToken, refreshToken } = (0, userGenerateToken_1.generateUserTokens)(res, {
                    userId,
                    role: "user",
                });
                return res
                    .status(200)
                    .json({ user, accessToken, refreshToken, origin });
            }
        }
        else {
            let user = await userService.getUserByEmail(email);
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
exports.validateOtp = validateOtp;
const authenticateUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        let user = await userService.getUserByEmail(email);
        if (!user) {
            return res.status(401).json({ message: "Invalid email" });
        }
        if (user.isBlocked) {
            return res.status(400).json({
                message: "user is blocked, please contact admin to get your account back",
            });
        }
        if (!user.password) {
            return res.status(401).json({ message: "Invalid password" });
        }
        const isPasswordValid = await (0, passwordValidation_1.comparePassword)(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid password" });
        }
        const userId = user._id.toString();
        const { accessToken, refreshToken } = (0, userGenerateToken_1.generateUserTokens)(res, {
            userId,
            role: "user",
        });
        console.log(user);
        return res.status(200).json({ user, accessToken, refreshToken });
    }
    catch (error) {
        console.error(error.message);
        return res.status(500).json({ message: "Internal server error" });
    }
};
exports.authenticateUser = authenticateUser;
const authenticateWithGoogle = async (req, res) => {
    try {
        const { name, email, image } = req.body;
        let existUser = await userService.getUserByEmail(email);
        if (existUser?.isBlocked == true) {
            return res.status(401).json({ message: "User is Blocked" });
        }
        if (existUser?.isGoogle == true) {
            const userId = existUser._id.toString();
            const { accessToken, refreshToken } = (0, userGenerateToken_1.generateUserTokens)(res, {
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
                const { accessToken, refreshToken } = (0, userGenerateToken_1.generateUserTokens)(res, {
                    userId,
                    role: "user",
                });
                return res.status(200).json({
                    success: true,
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
        console.error("Error in authenticateWithGoogle:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};
exports.authenticateWithGoogle = authenticateWithGoogle;
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
const processGoogleLogin = async (req, res) => {
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
        console.log("Error processGoogleLogin:", error);
        return res.status(400).json({ message: "Internal server error" });
    }
};
exports.processGoogleLogin = processGoogleLogin;
const updateUserProfile = async (req, res) => {
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
exports.updateUserProfile = updateUserProfile;
const updateUserProfileImage = async (req, res) => {
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
        console.log(user, 'user');
        return res.status(200).json({ user });
    }
    catch (error) {
        console.error("Error updating user:", error.message);
        return res.status(500).json({ error: "Internal server error" });
    }
};
exports.updateUserProfileImage = updateUserProfileImage;
const removeUserProfileImage = async (req, res) => {
    try {
        const { imageToRemove } = req.body;
        const userId = req.userId;
        if (!userId) {
            return res.status(500).json({ message: "User not found" });
        }
        if (!imageToRemove) {
            return res.status(500).json({ messag: "Image is required." });
        }
        const userExist = await userService.getUserById(userId);
        if (userExist?.image) {
            const imageKey = userExist.image.split("/").pop();
            if (imageKey) {
                const deleteParams = {
                    Bucket: config_1.default.BUCKET_NAME,
                    Key: imageKey,
                };
                const deleteCommand = new client_s3_1.DeleteObjectCommand(deleteParams);
                try {
                    await store_1.s3Client.send(deleteCommand);
                }
                catch (deleteError) {
                    console.error("Error removing image:", deleteError);
                }
            }
        }
        const user = await userService.getDeleteUserImage(userId);
        return res.status(200).json({ user });
    }
    catch (error) {
        console.log("Error removeUserProfileImage:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};
exports.removeUserProfileImage = removeUserProfileImage;
const sendOtpForForgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        let isValidEmail = await userService.getUserByEmail(email);
        if (isValidEmail) {
            [[[]]];
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
exports.sendOtpForForgotPassword = sendOtpForForgotPassword;
const resetUserPassword = async (req, res) => {
    try {
        const { resetToken, resetTokenExpiration, password, email } = req.body;
        const isGmail = await userService.getUserByGmail(email);
        const gmail = isGmail?.email;
        if (isGmail) {
            await userService.getUpdateIsGoogle(gmail, resetToken, resetTokenExpiration);
        }
        const securePassword = await (0, passwordValidation_1.hashPassword)(password);
        const data = {
            email,
            password: securePassword,
            resetToken,
            resetTokenExpiration,
        };
        const user = await userService.getUpdatePassword(data);
        return res.status(200).json({ user });
    }
    catch (error) {
        console.log(error.message);
        return res.status(500).json({ error: "Internal server error" });
    }
};
exports.resetUserPassword = resetUserPassword;
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
const sendEmailForUnlinking = async (req, res) => {
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
        await (0, sendEmail_1.sendEmail)(userId, email, resetToken, resetTokenExpiration);
        return res.status(200).json({ user });
    }
    catch (error) {
        console.error(error.message);
        return res.status(400).json({ message: "Internal server error" });
    }
};
exports.sendEmailForUnlinking = sendEmailForUnlinking;
const computeLocationDistance = async (req, res) => {
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
            const response = await axios_1.default.get(url);
            const data = response.data;
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
exports.computeLocationDistance = computeLocationDistance;
const checkUserIsblock = async (req, res) => {
    try {
        const userId = req.userId;
        const user = await userService.getUserById(userId);
        const isBlock = user?.isBlocked;
        console.log(isBlock, "isBlock");
        return res.status(200).json({ isBlock });
    }
    catch (error) {
        console.log("Error checkUserIsblock controller:", error);
        return res
            .status(500)
            .json({ message: "Internal server error at checkUserIsblock" });
    }
};
exports.checkUserIsblock = checkUserIsblock;
const checkIsCurrentPassword = async (req, res) => {
    try {
        const { userId, currentPassword } = req.params;
        const user = await userService.getUserById(userId);
        const password = user?.password;
        const compare = await (0, passwordValidation_1.comparePassword)(currentPassword, password);
        return res.status(200).json({ compare });
    }
    catch (error) {
        console.log("Error checkUserIsblock controller:", error);
        return res
            .status(500)
            .json({ message: "Internal server error at checkUserIsblock" });
    }
};
exports.checkIsCurrentPassword = checkIsCurrentPassword;
const updateUserProfilePassword = async (req, res) => {
    try {
        const { userId, newPassword } = req.body;
        const securePassword = await (0, passwordValidation_1.hashPassword)(newPassword);
        const password = securePassword;
        const updatedUser = await userService.getUpdateProfilePassword(userId, password);
        return res.status(200).json({ user: updatedUser });
    }
    catch (error) {
        console.log("Error checkUserIsblock controller:", error);
        return res
            .status(500)
            .json({ message: "Internal server error at checkUserIsblock" });
    }
};
exports.updateUserProfilePassword = updateUserProfilePassword;
//# sourceMappingURL=userController.js.map