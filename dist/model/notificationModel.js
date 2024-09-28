"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.notification = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const notificationSchema = new mongoose_1.default.Schema({
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
}, { timestamps: true });
const notification = mongoose_1.default.model("notification", notificationSchema);
exports.notification = notification;
//# sourceMappingURL=notificationModel.js.map