import mongoose, { Document, Types } from "mongoose";

interface IBooks extends Document {
    bookTitle: string;
    description: string;
    images: string[];
    author: string;
    genre: string;
    publisher: string;
    publishedYear: string;
    rentalFee?: number;
    extraFee?: number;
    quantity: number;
    price?: number;
    address: {
        street: string;
        city: string;
        district: string;
        state: string;
        pincode: string;
    };
    isRented?: boolean;
    isSell?: boolean;
    lenderId: string;
    maxDistance?: number;
    maxDays?: number;
    minDays?: number;
    latitude: number;
    longitude: number;
}

const bookSchema = new mongoose.Schema(
    {
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
    },
    { timestamps: true }
);

const books = mongoose.model<IBooks>("books", bookSchema);
export { books, IBooks };
