"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CartRepository = void 0;
const notificationModel_1 = require("../model/notificationModel");
const cartModel_1 = require("../model/cartModel");
class CartRepository {
    async creatCart(data) {
        try {
            return await new cartModel_1.cart({
                userId: data.userId,
                ownerId: data.ownerId,
                bookId: data.bookId,
                totalDays: data.totalDays,
                quantity: data.quantity,
                totalAmount: data.totalAmount,
                total_deposit_amount: data.total_deposit_amount,
                totalRentalPrice: data.totalRentalPrice,
                types: data.types
            }).save();
        }
        catch (error) {
            console.log("Error creatCart:", error);
            throw error;
        }
    }
    async findCheckRequest(userId, bookId) {
        try {
            const existingRequest = await cartModel_1.cart.findOne({
                userId: userId,
                bookId: bookId,
            });
            return existingRequest;
        }
        catch (error) {
            console.log("Error getCheckRequest:", error);
            throw error;
        }
    }
    async findCheckAccept(userId, bookId) {
        try {
            const existingAccepted = await notificationModel_1.notification.find({
                userId: userId,
                bookId: bookId,
                type: "Accepted",
            });
            return existingAccepted.length > 0;
        }
        catch (error) {
            console.log("Error getCheckRequest:", error);
            throw error;
        }
    }
    async findCartById(cartId) {
        try {
            const cartItem = await cartModel_1.cart.findById({ _id: cartId });
            return cartItem;
        }
        catch (error) {
            console.log("Error findCartById:", error);
            throw error;
        }
    }
    async findUpdateCart(cartId, types) {
        try {
            const request = await cartModel_1.cart.findByIdAndUpdate({ _id: cartId }, { types: types }, { new: true });
            return request;
        }
        catch (error) {
            console.log("Error UpdateCart:", error);
            throw error;
        }
    }
    async findCartDetails(cartId) {
        try {
            const details = await cartModel_1.cart
                .findById({ _id: cartId })
                .populate("bookId")
                .populate("ownerId");
            return details;
        }
        catch (error) {
            console.log("Error findRequestDetails:", error);
            throw error;
        }
    }
    async findUpdateIsPaid(cartId) {
        try {
            const update = await cartModel_1.cart
                .findByIdAndUpdate({ _id: cartId }, { isPaid: true }, { new: true });
            return update;
        }
        catch (error) {
            console.log("Error findUpdateIsPaid:", error);
            throw error;
        }
    }
}
exports.CartRepository = CartRepository;
//# sourceMappingURL=cartRepository.js.map