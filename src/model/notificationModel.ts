import { ObjectId } from "mongodb";
import mongoose, { Document, Types } from "mongoose";

interface INotification extends Document {
    userId?: ObjectId;
    ownerId?: ObjectId;
    bookId?: ObjectId;
    cartId?:ObjectId;
    status?: string;
    isRead?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}
const notificationSchema = new mongoose.Schema(
    {
        userId: {
            type: String,
            ref: "user",
        },
        ownerId: {
            type: String,
            ref: "user",
        },
        bookId: {
            type: String,
            ref: "books",
        },
        cartId: {
            type: String,
            ref: "cart",
        },
        status: {
            type: String,
            enum: ["requested", "accepted", "rejected"],
            default: "requested",
        },
        isRead: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);

const notification = mongoose.model<INotification>(
    "notification",
    notificationSchema
);
export { notification, INotification };
