"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CartRepository = void 0;
const cartModel_1 = require("../../model/cartModel");
const bookModel_1 = require("../../model/bookModel");
class CartRepository {
    async findCreatCart(data) {
        const { userId, ownerId, bookId, totalDays, quantity, totalAmount, total_deposit_amount, totalRentalPrice, types } = data;
        try {
            return await new cartModel_1.cart({
                userId: userId,
                ownerId: ownerId,
                bookId: bookId,
                totalDays: totalDays,
                quantity: quantity,
                totalAmount: totalAmount,
                total_deposit_amount: total_deposit_amount,
                totalRentalPrice: totalRentalPrice,
                types: types,
            }).save();
        }
        catch (error) {
            console.log("Error creatCart:", error);
            throw error;
        }
    }
    // async findCheckAccept(userId: string, bookId: string): Promise<ICart | null> {
    //     try {
    //         const existingAccepted = await cart.find({
    //             userId: userId,
    //             bookId: bookId,
    //             types: "accepted",
    //         });
    //         return existingAccepted
    //     } catch (error) {
    //         console.log("Error getCheckRequest:", error);
    //         throw error;
    //     }
    // }
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
            const updateCart = await cartModel_1.cart.findByIdAndUpdate({ _id: cartId }, { types: types }, { new: true });
            if (updateCart?.types === "accepted") {
                const { bookId, quantity } = updateCart;
                const updateQuantity = quantity;
                const b = await bookModel_1.books.findByIdAndUpdate({ _id: bookId }, { $inc: { quantity: -updateQuantity } }, { new: true });
            }
            return updateCart;
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
            const update = await cartModel_1.cart.findByIdAndUpdate({ _id: cartId }, { isPaid: true }, { new: true });
            return update;
        }
        catch (error) {
            console.log("Error findUpdateIsPaid:", error);
            throw error;
        }
    }
    async findIsOrderExistByCart(cartId) {
        try {
            return await cartModel_1.cart.findById({ _id: cartId }, { isPaid: true });
        }
        catch (error) {
            console.log("Error findIsOrderExistByCart:", error);
            throw error;
        }
    }
}
exports.CartRepository = CartRepository;
//# sourceMappingURL=cartRepository.js.map