"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cart = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const cartSchema = new mongoose_1.default.Schema({
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
        enum: ["requested", "rejected", "accepted"],
        required: true,
    },
    totalAmount: {
        type: Number,
        required: true
    },
    totalRentalPrice: {
        type: Number,
        required: true,
    },
    total_deposit_amount: {
        type: Number,
        required: true
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
        default: false
    }
}, { timestamps: true });
const cart = mongoose_1.default.model("cart", cartSchema);
exports.cart = cart;
//# sourceMappingURL=cartModel.js.map