"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.orders = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const orderSchema = new mongoose_1.Schema({
    cartId: { type: String, ref: 'cart' },
    bookId: { type: String, ref: 'books' },
    userId: { type: String, ref: 'user' },
    lenderId: { type: String, ref: 'user' },
    isPaid: { type: Boolean, default: false },
    isSuccessfull: {
        type: Boolean,
        default: false
    },
    isMoneyTransactionStatus: {
        type: String,
        enum: ['sent_to_website', 'sent_to_lender', 'completed'],
    },
    isTransaction: {
        type: [String],
        enum: ['pending', 'completed'],
    },
    bookStatus: {
        type: String,
        enum: ['not_reached', 'not_returned', 'completed', 'cancelled', 'overdue'],
        default: 'not_reached',
    },
    reachedAtUserDate: { type: Date },
}, { timestamps: true });
const orders = mongoose_1.default.model('orders', orderSchema);
exports.orders = orders;
//# sourceMappingURL=orderModel.js.map