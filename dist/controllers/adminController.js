"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderDetail = exports.allOrders = exports.totalBooks = exports.totalSoldBooks = exports.totalRentedBooks = exports.unBlockUser = exports.walletTransactions = exports.blockUser = exports.updateGenre = exports.genresList = exports.getUsersList = exports.genre = exports.addGenre = exports.adminLogin = void 0;
const passwordValidation_1 = require("../utils/ReuseFunctions/passwordValidation");
const adminService_1 = require("../services/adminService");
const adminGenerateToken_1 = require("../utils/jwt/adminGenerateToken");
const walletService_1 = require("../services/walletService");
const adminService = new adminService_1.AdminService();
const walletService = new walletService_1.WalletService();
const addGenre = async (req, res) => {
    try {
        const { genreName } = req.body;
        const existGenre = await adminService.getGenreName(genreName);
        if (existGenre) {
            return res.status(400).json({ message: "Genre is already exist" });
        }
        if (!genreName) {
            return res
                .status(400)
                .json({ message: "Please provide a genre name" });
        }
        const file = req.file;
        if (!file) {
            return res.status(400).json({ message: "Please provide image" });
        }
        const image = file.location;
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
        const { accessToken, refreshToken } = (0, adminGenerateToken_1.adminGenerateTokens)(res, {
            adminId,
            role: "admin",
        });
        const wallet = await walletService.getCreateWalletAdmin(adminId);
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
        const wallet = await adminService.getWalletTransactionsAdmin();
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
const genresList = async (req, res) => {
    try {
        const genres = await adminService.getAllGenres();
        return res.status(200).json(genres);
    }
    catch (error) {
        console.log(error.message);
        return res.status(500).json({ message: "Internal server error" });
    }
};
exports.genresList = genresList;
const genre = async (req, res) => {
    try {
        const genreId = req.params.genreId;
        const genre = await adminService.getGenre(genreId);
        return res.status(200).json(genre);
    }
    catch (error) {
        console.log(error.message);
        return res.status(500).json({ message: "Internal server error" });
    }
};
exports.genre = genre;
const updateGenre = async (req, res) => {
    try {
        const genreId = req.params.genreId;
        const { genreName, exisitingImage } = req.body;
        let image;
        if (req.file) {
            const file = req.file;
            image = file.location;
        }
        else if (exisitingImage) {
            image = exisitingImage;
        }
        else {
            return res.status(400).json({ message: "Please provide image" });
        }
        const data = {
            genreName,
            image,
        };
        const genre = await adminService.getUpdateGenre(data, genreId);
        return res.status(200).json(genre);
    }
    catch (error) {
        console.log(error.message);
        return res.status(400).json({ message: "Internal server error" });
    }
};
exports.updateGenre = updateGenre;
//# sourceMappingURL=adminController.js.map