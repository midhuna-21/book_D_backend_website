import { ObjectId } from "mongoose";

export interface User {
    userId?: string;
    name?: string;
    email?: string;
    image?: string;
    phone?: string;
    password?: string;
    isBlocked?: boolean;
    address?: {
        street?: string;
        city?: string;
        district?: string;
        state?: string;
        pincode?: string;
    };
    isReported?: boolean;
    isGoogle?: boolean;
    resetToken?: string;
    resetTokenExpiration?: number;
    isEmailVerified?: boolean;
    otp?: number;
}

export interface Books {
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
    address?: {
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

export interface Admin {
    email: string;
    password: string;
    isAdmin: boolean;
}

export interface Genre {
    genreName?: string;
    image?: string;
}

export type Notification = {
    userId?: string;
    receiverId?: string;
    bookId?: string;
    cartId?: string;
    status: string;
};

export type ChatRoom = {
    senderId?: ObjectId;
    receiverId?: string;
    isRead?: boolean;
};

export type Cart = {
    userId?: string;
    ownerId?: string;
    bookId?: string;
    types?: string;
    totalDays?: number;
    totalAmount?: number;
    total_deposit_amount?: number;
    totalRentalPrice?: number;
    quantity?: number;
};

export type Order = {
    cartId: string;
    bookId: string;
    userId: string;
    sessionId?: string;
    lenderId: string;
    isReturned?: boolean;
    isMoneyTransactionStatus?: string;
    isTransaction?: string;
    isSuccessfull?: boolean;
    pickupCode: string;
    returnCode: string;
};
