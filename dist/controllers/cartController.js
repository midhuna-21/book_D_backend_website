"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateCart = exports.saveCart = exports.checkAccept = exports.checkUserSentRequest = void 0;
const cartService_1 = require("../services/cartService");
const cartService = new cartService_1.CartService();
const saveCart = async (req, res) => {
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
        const cart = await cartService.getCreateCart(data);
        console.log(cart, 'cartt created');
        return res.status(200).json({ cart });
    }
    catch (error) {
        console.log("Error saveRequest:", error);
        return res
            .status(500)
            .json({ message: "Internal server error at saveRequest" });
    }
};
exports.saveCart = saveCart;
const checkAccept = async (req, res) => {
    try {
        const { userId, bookId } = req.params;
        if (!userId || !bookId) {
            return res
                .status(400)
                .json({ message: "User ID or Book ID not found in request" });
        }
        const isAccepted = await cartService.getCheckAccepted(userId, bookId);
        return res.status(200).json({ isAccepted });
    }
    catch (error) {
        console.log("Error checkAccept:", error);
        return res
            .status(500)
            .json({ message: "Internal server error at checkAccept" });
    }
};
exports.checkAccept = checkAccept;
const checkUserSentRequest = async (req, res) => {
    try {
        const { userId, bookId } = req.params;
        if (!userId || !bookId) {
            return res
                .status(400)
                .json({ message: "User ID or Book ID not found in request" });
        }
        const isRequested = await cartService.getCheckRequest(userId, bookId);
        return res.status(200).json({ isRequested });
    }
    catch (error) {
        console.log("Error checkUserSent:", error);
        return res
            .status(500)
            .json({ message: "Internal server error at checkUserSent" });
    }
};
exports.checkUserSentRequest = checkUserSentRequest;
const updateCart = async (req, res) => {
    try {
        const { cartId } = req.params;
        const { types } = req.body;
        if (!cartId) {
            return res.status(500).json({ message: "cartId is missing" });
        }
        const findCart = await cartService.getCartById(cartId);
        if (!findCart) {
            return res.status(500).json({ message: "request is not found" });
        }
        const cart = await cartService.getUpdateCart(cartId, types);
        return res.status(200).json({ cart });
    }
    catch (error) {
        console.log("Error updateRequest:", error);
        return res
            .status(500)
            .json({ message: "Internal server error at saveRequest" });
    }
};
exports.updateCart = updateCart;
//# sourceMappingURL=cartController.js.map