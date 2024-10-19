"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.books = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const bookSchema = new mongoose_1.default.Schema({
    bookTitle: {
        type: String,
    },
    description: {
        type: String,
    },
    images: [{ type: String }],
    author: {
        type: String,
    },
    genre: {
        type: String,
    },
    publisher: {
        type: String,
    },
    publishedYear: {
        type: String,
    },
    rentalFee: {
        type: Number,
    },
    price: {
        type: Number,
    },
    extraFee: {
        type: Number,
    },
    maxDistance: {
        type: Number,
    },
    minDays: {
        type: Number,
    },
    maxDays: {
        type: Number,
    },
    quantity: {
        type: Number,
    },
    address: {
        street: { type: String, required: true },
        city: { type: String, required: true },
        district: { type: String, required: true },
        state: { type: String, required: true },
        pincode: { type: String, required: true },
    },
    latitude: {
        type: Number,
    },
    longitude: {
        type: Number,
    },
    isRented: {
        type: Boolean,
    },
    isSell: {
        type: Boolean,
    },
    lenderId: {
        type: String,
        ref: "user",
    },
    // location:{
    //    type:String,
    // }
}, { timestamps: true });
const books = mongoose_1.default.model("books", bookSchema);
exports.books = books;
//# sourceMappingURL=bookModel.js.map