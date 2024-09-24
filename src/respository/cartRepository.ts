import { Cart } from "../interfaces/data";
import { notification } from "../model/notificationModel";
import { cart, ICart } from "../model/cartModel";

export class CartRepository {
    async creatCart(data: Cart): Promise<ICart | null> {
        try {
            return await new cart({
                userId: data.userId,
                ownerId: data.ownerId,
                bookId: data.bookId,
                totalDays: data.totalDays,
                quantity: data.quantity,
                totalAmount:data.totalAmount,
                total_deposit_amount:data.total_deposit_amount,
                totalRentalPrice: data.totalRentalPrice,
                types:data.types
            }).save();
        } catch (error) {
            console.log("Error creatCart:", error);
            throw error;
        }
    }

    async findCheckRequest(userId: string, bookId: string): Promise<ICart | null> {
        try {
            const existingRequest = await cart.findOne({
                userId: userId,
                bookId: bookId,
            });

            return existingRequest;
        } catch (error) {
            console.log("Error getCheckRequest:", error);
            throw error;
        }
    }

    async findCheckAccept(userId: string, bookId: string): Promise<boolean> {
        try {
            const existingAccepted = await notification.find({
                userId: userId,
                bookId: bookId,
                type: "Accepted",
            });
            return existingAccepted.length > 0;
        } catch (error) {
            console.log("Error getCheckRequest:", error);
            throw error;
        }
    }
    async findCartById(cartId: string) {
        try {
            const cartItem = await cart.findById({ _id: cartId })
            return cartItem;
        } catch (error) {
            console.log("Error findCartById:", error);
            throw error;
        }
    }

    async findUpdateCart(cartId: string, types: string) {
        try {
            const request = await cart.findByIdAndUpdate(
                { _id: cartId },
                { types: types },
                { new: true },
                
            );
            return request;
        } catch (error) {
            console.log("Error UpdateCart:", error);
            throw error;
        }
    }
    async findCartDetails(cartId: string) {
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

    async findUpdateIsPaid(cartId: string) {
        try {
            const update = await cart
                .findByIdAndUpdate({ _id: cartId },{isPaid:true},{new:true})
                
            return update;
        } catch (error) {
            console.log("Error findUpdateIsPaid:", error);
            throw error;
        }
    }

    // async findUpdateCart(cartId: string) {
    //     try {
    //         const update = await cart.findByIdAndUpdate(
    //             { _id: cartId },
    //             { isPaid: true },
    //             { new: true }
    //         );
    //         return update;
    //     } catch (error) {
    //         console.log("Error findUpdateRequest:", error);
    //         throw error;
    //     }
    // }
}
