"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminRepository = void 0;
const genresModel_1 = require("../../model/genresModel");
const userModel_1 = require("../../model/userModel");
const adminModel_1 = require("../../model/adminModel");
const bookModel_1 = require("../../model/bookModel");
const orderModel_1 = require("../../model/orderModel");
const bookDWallet_1 = require("../../model/bookDWallet");
class AdminRepository {
    async findAdminByEmail(email) {
        try {
            return await adminModel_1.admin.findOne({ email, isAdmin: true });
        }
        catch (error) {
            console.log("Error findAdminByEmail:", error);
            throw error;
        }
    }
    async findGenreByName(genreName) {
        try {
            return await genresModel_1.genres.findOne({ genreName: genreName });
        }
        catch (error) {
            console.log("Error findGenreByName:", error);
            throw error;
        }
    }
    async findCreateGenre(data) {
        try {
            return await new genresModel_1.genres({
                genreName: data.genreName,
                image: data.image,
            }).save();
        }
        catch (error) {
            console.log("Error createGenre:", error);
            throw error;
        }
    }
    async findAllUsers() {
        try {
            return await userModel_1.user.find({ isEmailVerified: true });
        }
        catch (error) {
            console.log("Error findAllUsers:", error);
            throw error;
        }
    }
    async findWalletTransactionsAdmin() {
        try {
            const wallet = await bookDWallet_1.bookDWallet.findOne();
            return wallet ? [wallet] : [];
        }
        catch (error) {
            console.log("Error findWalletTransactionsAdmin:", error);
            throw error;
        }
    }
    async findAllTotalRentedBooks() {
        try {
            return await bookModel_1.books.find({ isRented: true });
        }
        catch (error) {
            console.log("Error findAllTotalRentedBooks:", error);
            throw error;
        }
    }
    async findAllTotalBooks() {
        try {
            return await bookModel_1.books.find();
        }
        catch (error) {
            console.log("Error findAllTotalBooks:", error);
            throw error;
        }
    }
    async findAllTotalOrders() {
        try {
            return await orderModel_1.orders.find().sort({ updatedAt: -1 });
        }
        catch (error) {
            console.log("Error findAllGenres:", error);
            throw error;
        }
    }
    async findBlockUser(_id) {
        try {
            return await userModel_1.user.findByIdAndUpdate(_id, { isBlocked: true }, { new: true });
        }
        catch (error) {
            console.log("Error blockUser:", error);
            throw error;
        }
    }
    async findUnBlockUser(_id) {
        try {
            return await userModel_1.user.findByIdAndUpdate(_id, { isBlocked: false }, { new: true });
        }
        catch (error) {
            console.log("Error unBlockUser:", error);
            throw error;
        }
    }
    async findAdminById(_id) {
        try {
            return await adminModel_1.admin.findById(_id);
        }
        catch (error) {
            console.log("Error findAdminById:", error);
            throw error;
        }
    }
    async findAllOrders() {
        try {
            return await orderModel_1.orders
                .find()
                .populate("bookId")
                .populate("lenderId")
                .populate("userId")
                .populate("cartId")
                .sort({ updatedAt: -1 });
        }
        catch (error) {
            console.log("Error findAllOrders:", error);
            throw error;
        }
    }
    async findOrderDetail(orderId) {
        try {
            return await orderModel_1.orders
                .findById({ _id: orderId })
                .populate("bookId")
                .populate("lenderId")
                .populate("userId")
                .populate("cartId");
        }
        catch (error) {
            console.log("Error findOrderDetail:", error);
            throw error;
        }
    }
    async findAllGenres() {
        try {
            const genre = await genresModel_1.genres
                .find()
                .sort({ createdAt: -1, updatedAt: -1 });
            return genre;
        }
        catch (error) {
            console.log("Error findAllOrders:", error);
            throw error;
        }
    }
    async findGenre(genreId) {
        try {
            return await genresModel_1.genres.findById({ _id: genreId });
        }
        catch (error) {
            console.log("Error findGenre:", error);
            throw error;
        }
    }
    async findUpdateGenre(data, genreId) {
        try {
            const genre = await genresModel_1.genres.findById({ _id: genreId });
            if (!genre) {
                console.log("Error finding the genre:");
                return null;
            }
            const updatedGenre = await genresModel_1.genres.findByIdAndUpdate({ _id: genreId }, {
                genreName: data.genreName || genre.genreName,
                image: data.image || genre.image,
            }, { new: true });
            return updatedGenre;
        }
        catch (error) {
            console.log("Error findUpdateGenre:", error);
            throw error;
        }
    }
    async findDeleteGenre(genreId) {
        try {
            const deletedGenre = await genresModel_1.genres.findByIdAndDelete({
                _id: genreId,
            });
            if (!deletedGenre) {
                console.log("Genre not found for deletion");
                return null;
            }
            return deletedGenre;
        }
        catch (error) {
            console.log("Error findDeleteGenre:", error);
            throw error;
        }
    }
}
exports.AdminRepository = AdminRepository;
//# sourceMappingURL=adminRespository.js.map