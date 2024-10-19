import { Cart } from "../interfaces/data";
import { ICart } from "../model/cartModel";
import { CartRepository } from "../respository/cartRepository";

const cartRepository = new CartRepository();

export class CartService {
    async getCheckRequest(
        userId: string,
        bookId: string
    ): Promise<ICart | null> {
        try {
            return await cartRepository.findCheckRequest(userId, bookId);
        } catch (error) {
            console.log("Error getCheckRequest:", error);
            throw error;
        }
    }
    async getCreateCart(data: Cart): Promise<ICart | null> {
        try {
            return await cartRepository.creatCart(data);
        } catch (error) {
            console.log("Error getCreateCart:", error);
            throw error;
        }
    }

    async getCheckAccepted(userId: string, bookId: string): Promise<Boolean> {
        try {
            return await cartRepository.findCheckAccept(userId, bookId);
        } catch (error) {
            console.log("Error getUpdateProfileImage:", error);
            throw error;
        }
    }

    async getCartById(cartId: string) {
        try {
            return await cartRepository.findCartById(cartId);
        } catch (error) {
            console.log("Error getCartById:", error);
            throw error;
        }
    }

    async getUpdateCart(cartId: string, types: string) {
        try {
            return await cartRepository.findUpdateCart(cartId, types);
        } catch (error) {
            console.log("Error getUpdateCart:", error);
            throw error;
        }
    }

    async getCartDetails(cartId: string) {
        try {
            return await cartRepository.findCartDetails(cartId);
        } catch (error) {
            console.log("Error getCartDetails:", error);
            throw error;
        }
    }

    async getUpdateIsPaid(cartId: string) {
        try {
            return await cartRepository.findUpdateIsPaid(cartId);
        } catch (error) {
            console.log("Error getUpdateIsPaid:", error);
            throw error;
        }
    }
}
