import mongoose, { Document, Schema, Types } from "mongoose";
import { ICart } from "./cartModel";

interface IOrder extends Document {
    cartId: ICart | string;
    bookId: string;
    userId: string;
    lenderId: string;
    sessionId?: string;
    isPaid?: boolean;
    bookStatusFromRenter: string;
    bookStatusFromLender: string;
    statusUpdateLenderDate?: Date;
    statusUpdateRenterDate?: Date;
    isAmountCredited?: boolean;
    bookTitle:string;
    bookAddress:string;
    reason: string;
    bookStatus:string;
    pickupCode: string;
    returnCode: string;
    rentedOn: Date;
    dueDate:Date;
    checkoutDate:Date;

}

const orderSchema = new Schema<IOrder>(
    {
        cartId: { type: String, ref: "cart" },
        bookId: { type: String, ref: "books" },
        userId: { type: String, ref: "user" },
        lenderId: { type: String, ref: "user" },
        bookTitle:{type:String},
        bookAddress:{type:String},
        sessionId: { type: String },
        isPaid: { type: Boolean, default: false },
        reason: { types: String },
       
        isAmountCredited: {
            type: Boolean,
            default: false,
        },
        
        bookStatus: {
            type: String,
            enum: [
                "not_picked_up",
                "not_returned",
                "completed",
                "cancelled",
                "overdue",
            ],
            default: "not_picked_up",
        },
        statusUpdateLenderDate: { type: Date },
        statusUpdateRenterDate: { type: Schema.Types.Date },
        pickupCode: { type: String, required: true },
        returnCode: { type: String, required: true },
        rentedOn: { type: Date },
        dueDate: { type: Date },
        checkoutDate: { type: Date },

    },

    { timestamps: true }
);

const orders = mongoose.model<IOrder>("orders", orderSchema);
export { orders, IOrder };
