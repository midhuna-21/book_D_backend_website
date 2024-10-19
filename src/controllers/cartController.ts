import { Request, Response } from "express";
import { Cart } from "../interfaces/data";
import { CartService } from "../services/cartService";

const cartService = new CartService();

const saveCart = async (req: Request, res: Response) => {
    try {
        const {
            userId,
            ownerId,
            bookId,
            totalDays,
            quantity,
            totalAmount,
            totalDepositAmount,
            totalRentalPrice,
            types,
        } = req.body;
        if (!userId || !ownerId || !bookId) {
            return res.status(500).json({ message: "id is missing" });
        }
        const data: Cart | null = {
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
       
        return res.status(200).json({ cart });
    } catch (error: any) {
        console.log("Error saveRequest:", error);
        return res
            .status(500)
            .json({ message: "Internal server error at saveRequest" });
    }
};

const checkAccept = async (req: Request, res: Response) => {
    try {
        const { userId, bookId } = req.params;
        if (!userId || !bookId) {
            return res
                .status(400)
                .json({ message: "User ID or Book ID not found in request" });
        }

        const isAccepted = await cartService.getCheckAccepted(userId, bookId);

        return res.status(200).json({ isAccepted });
    } catch (error: any) {
        console.log("Error checkAccept:", error);
        return res
            .status(500)
            .json({ message: "Internal server error at checkAccept" });
    }
};

const checkUserSentRequest = async (req: Request, res: Response) => {
    try {
        const { userId, bookId } = req.params;
        if (!userId || !bookId) {
            return res
                .status(400)
                .json({ message: "User ID or Book ID not found in request" });
        }

        const isRequested = await cartService.getCheckRequest(userId, bookId);

        return res.status(200).json({ isRequested });
    } catch (error: any) {
        console.log("Error checkUserSent:", error);
        return res
            .status(500)
            .json({ message: "Internal server error at checkUserSent" });
    }
};

const updateCart = async (req: Request, res: Response) => {
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
    } catch (error: any) {
        console.log("Error updateRequest:", error);
        return res
            .status(500)
            .json({ message: "Internal server error at saveRequest" });
    }
};

export { checkUserSentRequest, checkAccept, saveCart, updateCart };
