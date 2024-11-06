import mongoose, { Document } from "mongoose";

interface IBookWalletTransaction extends Document {
    source?: string;
    status?: string;
    total_amount?: number;
}
const transactionSchema = new mongoose.Schema(
    {
        total_amount: {
            type: Number,
        },
        source: {
            type: String,

            enum: [
                "Payment received",
                "payment return",
                "payment_to_lender",
                "deposit_fee_to_user",
                "deposit_fee_to_lender",
            ],
        },
        status: {
            type: String,
            enum: ["credit", "debit"],
            default: "credit",
        },
    },
    {
        timestamps: true,
    }
);

const bookDWalletSchema = new mongoose.Schema(
    {
        adminId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "admin",
        },
        balance: {
            type: Number,
            default: 0,
        },
        transactions: [transactionSchema],
    },
    {
        timestamps: true,
    }
);

const bookDWallet = mongoose.model("bookDWallet", bookDWalletSchema);

export { bookDWallet, IBookWalletTransaction };
