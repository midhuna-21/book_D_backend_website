"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.user = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const userSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
    },
    email: {
        type: String,
    },
    image: {
        type: String,
    },
    phone: {
        type: String,
    },
    password: {
        type: String,
    },
    isBlocked: {
        type: Boolean,
        default: false,
    },
    isReported: {
        type: Boolean,
        default: false,
    },
    isGoogle: {
        type: Boolean,
        default: false,
    },
    address: {
        street: { type: String },
        city: { type: String },
        district: { type: String },
        state: { type: String },
        pincode: { type: String },
    },
    resetToken: {
        type: String,
    },
    resetTokenExpiration: {
        type: Number,
    },
    isEmailVerified: {
        type: Boolean,
        default: false,
    },
    otp: {
        type: Number,
    },
}, { timestamps: true });
const user = mongoose_1.default.model("user", userSchema);
exports.user = user;
//# sourceMappingURL=userModel.js.map