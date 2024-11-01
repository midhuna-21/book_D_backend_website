"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteGenre = exports.orderDetail = exports.allOrders = exports.totalBooks = exports.totalRentedBooks = exports.unBlockUser = exports.walletTransactions = exports.blockUser = exports.updateGenre = exports.genresList = exports.getUsersList = exports.genre = exports.addGenre = exports.adminLogin = void 0;
const passwordValidation_1 = require("../utils/ReuseFunctions/passwordValidation");
const adminGenerateToken_1 = require("../utils/jwt/adminGenerateToken");
const index_1 = require("../services/index");
const index_2 = require("../services/index");
const addGenre = async (req, res) => {
    try {
        const { genreName } = req.body;
        const existGenre = await index_1.adminService.getGenreName(genreName);
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
        const genre = await index_1.adminService.getCreateGenre(data);
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
        let admin = await index_1.adminService.getAdminByEmail(email);
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
        const wallet = await index_2.walletService.getCreateWalletAdmin(adminId);
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
        const users = await index_1.adminService.getAllUsers();
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
        const wallet = await index_1.adminService.getWalletTransactionsAdmin();
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
        const users = await index_1.adminService.getAllTotalRentedBooks();
        return res.status(200).json(users);
    }
    catch (error) {
        console.log(error.message);
        return res.status(500).json({ message: "Internal server error" });
    }
};
exports.totalRentedBooks = totalRentedBooks;
const totalBooks = async (req, res) => {
    try {
        const users = await index_1.adminService.getAllTotalBooks();
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
        const user = await index_1.adminService.getBlockUser(_id);
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
        const user = await index_1.adminService.getUnblockUser(_id);
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
        const orders = await index_1.adminService.getAllOrders();
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
        const order = await index_1.adminService.getOrderDetail(orderId);
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
        const genres = await index_1.adminService.getAllGenres();
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
        const genre = await index_1.adminService.getGenre(genreId);
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
        const genre = await index_1.adminService.getUpdateGenre(data, genreId);
        return res.status(200).json(genre);
    }
    catch (error) {
        console.log(error.message);
        return res.status(400).json({ message: "Internal server error" });
    }
};
exports.updateGenre = updateGenre;
const deleteGenre = async (req, res) => {
    try {
        const { genreId } = req.body;
        const genre = await index_1.adminService.getDeleteGenre(genreId);
        return res.status(200).json({ genre });
    }
    catch (error) {
        console.log(error.message);
        return res.status(400).json({ message: "Internal server error" });
    }
};
exports.deleteGenre = deleteGenre;
//# sourceMappingURL=adminController.js.map