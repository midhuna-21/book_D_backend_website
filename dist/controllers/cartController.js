"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateCartItem = exports.checkIsOrderExist = exports.addItemToCart = void 0;
const index_1 = require("../services/index");
const addItemToCart = async (req, res) => {
    try {
        const { userId, ownerId, bookId, totalDays, quantity, totalAmount, totalDepositAmount, totalRentalPrice, types, } = req.body;
        if (!userId || !ownerId || !bookId) {
            return res.status(500).json({ message: "id is missing" });
        }
        const data = {
            userId,
            ownerId,
            bookId,
            types,
            totalDays,
            quantity,
            totalAmount,
            total_deposit_amount: totalDepositAmount,
            totalRentalPrice,
        };
        const cart = await index_1.cartService.getCreateCart(data);
        return res.status(200).json({ cart });
    }
    catch (error) {
        console.log("Error saveRequest:", error);
        return res
            .status(500)
            .json({ message: "Internal server error at saveRequest" });
    }
};
exports.addItemToCart = addItemToCart;
const updateCartItem = async (req, res) => {
    try {
        const { cartId } = req.params;
        const { types } = req.body;
        if (!cartId) {
            return res.status(500).json({ message: "cartId is missing" });
        }
        const findCart = await index_1.cartService.getCartById(cartId);
        if (!findCart) {
            return res.status(500).json({ message: "request is not found" });
        }
        const cart = await index_1.cartService.getUpdateCart(cartId, types);
        return res.status(200).json({ cart });
    }
    catch (error) {
        console.log("Error updateRequest:", error);
        return res
            .status(500)
            .json({ message: "Internal server error at updateCartItem" });
    }
};
exports.updateCartItem = updateCartItem;
const checkIsOrderExist = async (req, res) => {
    try {
        const { cartId } = req.params;
        if (!cartId) {
            return res.status(500).json({ message: "cartId is missing" });
        }
        const isOrderExist = await index_1.cartService.getIsOrderExistByCart(cartId);
        return res.status(200).json({ isOrderExist });
    }
    catch (error) {
        console.log("Error updateRequest:", error);
        return res
            .status(500)
            .json({ message: "Internal server error at checkIsOrderExist" });
    }
};
exports.checkIsOrderExist = checkIsOrderExist;
//# sourceMappingURL=cartController.js.map