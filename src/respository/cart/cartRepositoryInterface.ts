import { Cart } from "../../interfaces/data";
import { ICart } from "../../model/cartModel";

export interface ICartRepository {
    findCreatCart(data: Cart): Promise<ICart | null>;
    findCartById(cartId: string): Promise<ICart | null>;
    findUpdateCart(cartId: string, types: string): Promise<ICart | null>;
    findCartDetails(cartId: string): Promise<ICart | null>;
    findUpdateIsPaid(cartId: string): Promise<ICart | null>;
    findIsOrderExistByCart(cartId: string): Promise<ICart | null>;
}
