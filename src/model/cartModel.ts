import mongoose, { Document } from "mongoose";

interface ICart extends Document {
    userId?: string;
    ownerId?: string;
    bookId?: string;
    types?: string;
    totalAmount?: number;
    totalRentalPrice?: number;
    quantity?: number;
    totalDays?: number;
    timeStamp?: Date;
    total_deposit_amount?: number;
    isPaid?: boolean;
    acceptedDate?: Date;
}
const cartSchema = new mongoose.Schema(
    {
        userId: {
            type: String,
            ref: "user",
            required: true,
        },
        ownerId: {
            type: String,
            ref: "user",
            required: true,
        },
        bookId: {
            type: String,
            ref: "books",
            required: true,
        },
        types: {
            type: String,
            enum: [
                "requested",
                "rejected",
                "accepted",
                "timed-out",
                "cancelled",
            ],
            required: true,
        },
        totalAmount: {
            type: Number,
            required: true,
        },
        totalRentalPrice: {
            type: Number,
            required: true,
        },
        total_deposit_amount: {
            type: Number,
            required: true,
        },
        quantity: {
            type: Number,
            required: true,
        },
        totalDays: {
            type: Number,
            required: true,
        },
        timeStamp: {
            type: Date,
            default: Date.now,
        },
        isPaid: {
            type: Boolean,
            default: false,
        },
        acceptedDate: {
            type: Date,
            default: null,
        },
    },
    { timestamps: true }
);

cartSchema.pre("save", function (next) {
    if (
        this.isModified("types") &&
        this.types === "accepted" &&
        !this.acceptedDate
    ) {
        this.acceptedDate = new Date();
    }
    next();
});

const cart = mongoose.model<ICart>("cart", cartSchema);

export { cart, ICart };
