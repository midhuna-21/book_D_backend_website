import { Cart } from "../../interfaces/data";
import { ICart } from "../../model/cartModel";

export interface ICartService {
    getCreateCart(data: Cart): Promise<ICart | null>;
    // getCheckAccepted(userId: string, bookId: string): Promise<ICart | null>;
    getCartById(cartId: string): Promise<ICart | null>;
    getUpdateCart(cartId: string, types: string): Promise<ICart | null>;
    getCartDetails(cartId: string): Promise<ICart | null>;
    getUpdateIsPaid(cartId: string): Promise<ICart | null>;
    getIsOrderExistByCart(cartId: string): Promise<ICart | null>
}
