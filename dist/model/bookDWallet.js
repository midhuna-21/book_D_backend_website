"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bookDWallet = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const transactionSchema = new mongoose_1.default.Schema({
    total_amount: {
        type: Number,
    },
    rental_amount: {
        type: Number,
    },
    deposit_amount: {
        type: Number,
    },
    source: {
        type: String,
        enum: [
            'Payment received',
            'refund_to_user',
            'payment_to_lender',
            'deposit_fee_to_user',
            'deposit_fee_to_lender'
        ],
    },
    userId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'user',
    },
    lenderId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'user',
    },
    status: {
        type: String,
        enum: ['credit', 'debit'],
        default: 'credit',
    },
}, {
    timestamps: true,
});
const bookDWalletSchema = new mongoose_1.default.Schema({
    balance: {
        type: Number,
        default: 0,
    },
    transactions: [transactionSchema],
}, {
    timestamps: true,
});
const bookDWallet = mongoose_1.default.model('bookDWallet', bookDWalletSchema);
exports.bookDWallet = bookDWallet;
//# sourceMappingURL=bookDWallet.js.map