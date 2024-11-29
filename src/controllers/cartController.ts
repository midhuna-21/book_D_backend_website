import { Request, Response } from "express";
import { Cart } from "../interfaces/data";
import { cartService } from "../services/index";

const addItemToCart = async (req: Request, res: Response) => {
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

const updateCartItem = async (req: Request, res: Response) => {
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
            .json({ message: "Internal server error at updateCartItem" });
    }
};
const checkIsOrderExist = async (req: Request, res: Response) => {
    try {
        const { cartId } = req.params;
        if (!cartId) {
            return res.status(500).json({ message: "cartId is missing" });
        }
        const isOrderExist = await cartService.getIsOrderExistByCart(cartId);
        return res.status(200).json({ isOrderExist });
    } catch (error: any) {
        console.log("Error updateRequest:", error);
        return res
            .status(500)
            .json({ message: "Internal server error at checkIsOrderExist" });
    }
};

export { addItemToCart, checkIsOrderExist, updateCartItem };
