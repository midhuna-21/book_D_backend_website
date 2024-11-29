import { Cart } from "../../interfaces/data";
import { ICart } from "../../model/cartModel";
import { ICartService } from "./cartServiceInterface";
import { ICartRepository } from "../../respository/cart/cartRepositoryInterface";

export class CartService implements ICartService {
    private cartRepository: ICartRepository;

    constructor(cartRepository: ICartRepository) {
        this.cartRepository = cartRepository;
    }
    async getCreateCart(data: Cart): Promise<ICart | null> {
        try {
            return await this.cartRepository.findCreatCart(data);
        } catch (error) {
            console.log("Error getCreateCart:", error);
            throw error;
        }
    }

    async getCartById(cartId: string): Promise<ICart | null> {
        try {
            return await this.cartRepository.findCartById(cartId);
        } catch (error) {
            console.log("Error getCartById:", error);
            throw error;
        }
    }

    async getUpdateCart(cartId: string, types: string): Promise<ICart | null> {
        try {
            return await this.cartRepository.findUpdateCart(cartId, types);
        } catch (error) {
            console.log("Error getUpdateCart:", error);
            throw error;
        }
    }

    async getCartDetails(cartId: string): Promise<ICart | null> {
        try {
            return await this.cartRepository.findCartDetails(cartId);
        } catch (error) {
            console.log("Error getCartDetails:", error);
            throw error;
        }
    }

    async getUpdateIsPaid(cartId: string): Promise<ICart | null> {
        try {
            return await this.cartRepository.findUpdateIsPaid(cartId);
        } catch (error) {
            console.log("Error getUpdateIsPaid:", error);
            throw error;
        }
    }

    async getIsOrderExistByCart(cartId: string): Promise<ICart | null> {
        try {
            return await this.cartRepository.findIsOrderExistByCart(cartId);
        } catch (error) {
            console.log("Error getIsOrderExistByCart:", error);
            throw error;
        }
    }
}
