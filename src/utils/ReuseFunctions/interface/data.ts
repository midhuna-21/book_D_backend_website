export type userData = {
    name: string;
    email: string;
    phone?: string;
    image?: string;
    password?: string;
    isBlocked?: Boolean;
    isVerified?: Boolean;
    isGoogle?: Boolean;
};

export type postData = {
    title?: string;
    description?: string;
    images?: string[];
};

export type Notification = {
    userId?: string;
    receiverId?: string;
    bookId?: string;
    type: string;
    content?: string;
    isRead?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
};

export type Transaction = {
    total_amount: number;
    source: string;
    userId: string;
    lenderId: string;
    status: string;
    rental_amount: number;
    deposit_amount: number;
    createdAt: Date;
};

export interface BookDWallet {
    userId: string;
    lenderId: string;
    balance: number;
    transactions: Transaction[];
}
