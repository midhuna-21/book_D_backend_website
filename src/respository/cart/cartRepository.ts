import { Cart } from "../../interfaces/data";
import { cart, ICart } from "../../model/cartModel";
import { ICartRepository } from "./cartRepositoryInterface";
import { books } from "../../model/bookModel";

export class CartRepository implements ICartRepository {
    async findCreatCart(data: Cart): Promise<ICart | null> {
        const {userId,ownerId,bookId,totalDays,quantity,totalAmount,total_deposit_amount,totalRentalPrice,types} = data
        try {
            return await new cart({
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
        } catch (error) {
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
    async findCartById(cartId: string): Promise<ICart | null> {
        try {
            const cartItem = await cart.findById({ _id: cartId });
            return cartItem;
        } catch (error) {
            console.log("Error findCartById:", error);
            throw error;
        }
    }

    async findUpdateCart(cartId: string, types: string): Promise<ICart | null> {
        try {
            const updateCart = await cart.findByIdAndUpdate(
                { _id: cartId },
                { types: types },
                { new: true }
            );
            if (updateCart?.types === "accepted") {
                const { bookId, quantity } = updateCart;
                const updateQuantity = quantity!;
                const b = await books.findByIdAndUpdate(
                    { _id: bookId },
                    { $inc: { quantity: -updateQuantity } },
                    { new: true }
                );
            }
            return updateCart;
        } catch (error) {
            console.log("Error UpdateCart:", error);
            throw error;
        }
    }
    async findCartDetails(cartId: string): Promise<ICart | null> {
        try {
            const details = await cart
                .findById({ _id: cartId })
                .populate("bookId")
                .populate("ownerId");
            return details;
        } catch (error) {
            console.log("Error findRequestDetails:", error);
            throw error;
        }
    }

    async findUpdateIsPaid(cartId: string): Promise<ICart | null> {
        try {
            const update = await cart.findByIdAndUpdate(
                { _id: cartId },
                { isPaid: true },
                { new: true }
            );

            return update;
        } catch (error) {
            console.log("Error findUpdateIsPaid:", error);
            throw error;
        }
    }

    async findIsOrderExistByCart(cartId: string): Promise<ICart | null> {
        try {
            return await cart.findById({ _id: cartId }, { isPaid: true });
        } catch (error) {
            console.log("Error findIsOrderExistByCart:", error);
            throw error;
        }
    }
}
