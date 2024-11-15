import mongoose, { Document, Schema, Types } from "mongoose";

interface ITransaction extends Document {
    type: "credit" | "debit";
    total_amount: number;
    source: string;
    orderId?: Types.ObjectId;
    createdAt: Date;
    updatedAt?: Date;
}

interface IWallet extends Document {
    userId: Types.ObjectId;
    balance: number;
    transactions: Types.DocumentArray<ITransaction>;
}

const transactionSchema = new Schema<ITransaction>(
    {
        type: {
            type: String,
            enum: ["credit", "debit"],
        },
        total_amount: { type: Number },
        source: {
            type: String,
            enum: ["payment_to_lender", "refund_to_user"],
        },
        orderId: { type: Schema.Types.ObjectId, ref: "orders" },
        createdAt: { type: Date, default: Date.now },
    },
    { _id: false }
);

const walletSchema = new Schema<IWallet>(
    {
        userId: { type: Schema.Types.ObjectId, ref: "user", required: true },
        balance: { type: Number, default: 0 },
        transactions: [transactionSchema],
    },
    { timestamps: true }
);

const wallet = mongoose.model<IWallet>("wallet", walletSchema);

export { wallet, IWallet };
