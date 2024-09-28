"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderDetail = exports.allOrders = exports.totalBooks = exports.totalSoldBooks = exports.totalRentedBooks = exports.unBlockUser = exports.walletTransactions = exports.blockUser = exports.getUsersList = exports.addGenre = exports.adminLogin = void 0;
const passwordValidation_1 = require("../utils/ReuseFunctions/passwordValidation");
const adminService_1 = require("../services/adminService");
// import generateToken from "../utils/generateToken";
const crypto_1 = __importDefault(require("crypto"));
const sharp_1 = __importDefault(require("sharp"));
const generateToken_1 = require("../utils/jwt/generateToken");
const client_s3_1 = require("@aws-sdk/client-s3");
const config_1 = __importDefault(require("../config/config"));
const store_1 = require("../utils/imageFunctions/store");
const adminService = new adminService_1.AdminService();
const randomImageName = (bytes = 32) => crypto_1.default.randomBytes(bytes).toString("hex");
const addGenre = async (req, res) => {
    try {
        const { genreName } = req.body;
        const existGenre = await adminService.getGenreName(genreName);
        if (existGenre) {
            return res.status(400).json({ message: "Genre is already exist" });
        }
        const buffer = await (0, sharp_1.default)(req.file?.buffer)
            .resize({ height: 1920, width: 1080, fit: "contain" })
            .toBuffer();
        if (!genreName) {
            return res
                .status(400)
                .json({ message: "Please provide a genre name" });
        }
        if (!req.file) {
            return res.status(400).json({ message: "Please provide image" });
        }
        const image = randomImageName();
        const params = {
            Bucket: config_1.default.BUCKET_NAME,
            Key: image,
            Body: buffer,
            ContentType: req.file.mimetype,
        };
        const command = new client_s3_1.PutObjectCommand(params);
        try {
            await store_1.s3Client.send(command);
        }
        catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Failed to upload image" });
        }
        const data = { genreName, image };
        const genre = await adminService.getCreateGenre(data);
        return res.status(200).json({ genre });
    }
    catch (error) {
        console.error("Error adding genre:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};
exports.addGenre = addGenre;
const adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        let admin = await adminService.getAdminByEmail(email);
        if (!admin || !admin.password) {
            return res
                .status(400)
                .json({ message: "Invalid email or password" });
        }
        const isPasswordValid = await (0, passwordValidation_1.comparePassword)(password, admin.password);
        if (!isPasswordValid) {
            return res
                .status(401)
                .json({ message: "Invalid email or password" });
        }
        const adminId = admin._id.toString();
        const { accessToken, refreshToken } = (0, generateToken_1.generateTokens)(res, {
            userId: adminId,
            userRole: "admin",
        });
        return res.status(200).json({ admin, accessToken, refreshToken });
    }
    catch (error) {
        console.log(error.message);
        return res.status(500).json({ message: "Internal server error" });
    }
};
exports.adminLogin = adminLogin;
const getUsersList = async (req, res) => {
    try {
        const users = await adminService.getAllUsers();
        return res.status(200).json(users);
    }
    catch (error) {
        console.log(error.message);
        return res.status(500).json({ message: "Internal server error" });
    }
};
exports.getUsersList = getUsersList;
const walletTransactions = async (req, res) => {
    try {
        const wallet = await adminService.getWalletTransactions();
        return res.status(200).json(wallet);
    }
    catch (error) {
        console.log(error.message);
        return res.status(500).json({ message: "Internal server error" });
    }
};
exports.walletTransactions = walletTransactions;
const totalRentedBooks = async (req, res) => {
    try {
        const users = await adminService.getAllTotalRentedBooks();
        return res.status(200).json(users);
    }
    catch (error) {
        console.log(error.message);
        return res.status(500).json({ message: "Internal server error" });
    }
};
exports.totalRentedBooks = totalRentedBooks;
const totalSoldBooks = async (req, res) => {
    try {
        const users = await adminService.getAllTotalSoldBooks();
        return res.status(200).json(users);
    }
    catch (error) {
        console.log(error.message);
        return res.status(500).json({ message: "Internal server error" });
    }
};
exports.totalSoldBooks = totalSoldBooks;
const totalBooks = async (req, res) => {
    try {
        const users = await adminService.getAllTotalBooks();
        return res.status(200).json(users);
    }
    catch (error) {
        console.log(error.message);
        return res.status(500).json({ message: "Internal server error" });
    }
};
exports.totalBooks = totalBooks;
const blockUser = async (req, res) => {
    try {
        const { _id } = req.body;
        const user = await adminService.getBlockUser(_id);
        return res.status(200).json({ user });
    }
    catch (error) {
        console.log(error.message);
        return res.status(400).json({ message: "Internal server error" });
    }
};
exports.blockUser = blockUser;
const unBlockUser = async (req, res) => {
    try {
        const { _id } = req.body;
        const user = await adminService.getUnblockUser(_id);
        return res.status(200).json({ user });
    }
    catch (error) {
        console.log(error.message);
        return res.status(400).json({ message: "Internal server error" });
    }
};
exports.unBlockUser = unBlockUser;
const allOrders = async (req, res) => {
    try {
        const orders = await adminService.getAllOrders();
        return res.status(200).json(orders);
    }
    catch (error) {
        console.log(error.message);
        return res.status(500).json({ message: "Internal server error" });
    }
};
exports.allOrders = allOrders;
const orderDetail = async (req, res) => {
    try {
        const { orderId } = req.params;
        if (!orderId) {
            return res.status(500).json({ message: "orderId is not found" });
        }
        const order = await adminService.getOrderDetail(orderId);
        return res.status(200).json(order);
    }
    catch (error) {
        console.log(error.message);
        return res.status(500).json({ message: "Internal server error" });
    }
};
exports.orderDetail = orderDetail;
//# sourceMappingURL=adminController.js.map