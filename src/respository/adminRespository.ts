import { genres, IGenre } from "../model/genresModel";
import { user, IUser } from "../model/userModel";
import { Genre } from "../interfaces/data";
import { admin, IAdmin } from "../model/adminModel";
import { books } from "../model/bookModel";
import { orders } from "../model/orderModel";
import { bookDWallet } from "../model/bookDWallet";

export class AdminRepository {
    async findAdminByEmail(email: string): Promise<IUser | null> {
        try {
            return await admin.findOne({ email, isAdmin: true });
        } catch (error) {
            console.log("Error findAdminByEmail:", error);
            throw error;
        }
    }
    async findGenreByName(genreName: string): Promise<IGenre | null> {
        try {
            return await genres.findOne({ genreName: genreName });
        } catch (error) {
            console.log("Error findGenreByName:", error);
            throw error;
        }
    }
    async createGenre(data: Partial<Genre>): Promise<IGenre | null> {
        try {
            return await new genres({
                genreName: data.genreName,
                image: data.image,
            }).save();
        } catch (error) {
            console.log("Error createGenre:", error);
            throw error;
        }
    }

    async findAllUsers() {
        try {
            return await user.find();
        } catch (error) {
            console.log("Error findAllUsers:", error);
            throw error;
        }
    }

    async findWalletTransactionsAdmin() {
        try {
            const wallet =  bookDWallet.findOne()
            return wallet
        } catch (error) {
            console.log("Error findWalletTransactionsAdmin:", error);
            throw error;
        }
    }

    async findAllTotalRentedBooks() {
        try {
            return await books.find({ isRented: true });
        } catch (error) {
            console.log("Error findAllTotalRentedBooks:", error);
            throw error;
        }
    }
    async findAllTotalSoldBooks() {
        try {
            return await books.find({ isSell: true });
        } catch (error) {
            console.log("Error findAllTotalSoldBooks:", error);
            throw error;
        }
    }
    async findAllTotalBooks() {
        try {
            return await books.find();
        } catch (error) {
            console.log("Error findAllTotalBooks:", error);
            throw error;
        }
    }
    async blockUser(_id: string): Promise<IUser | null> {
        try {
            return await user.findByIdAndUpdate(
                _id,
                { isBlocked: true },
                { new: true }
            );
        } catch (error) {
            console.log("Error blockUser:", error);
            throw error;
        }
    }
    async unBlockUser(_id: string): Promise<IUser | null> {
        try {
            return await user.findByIdAndUpdate(
                _id,
                { isBlocked: false },
                { new: true }
            );
        } catch (error) {
            console.log("Error unBlockUser:", error);
            throw error;
        }
    }
    async findAdminById(_id: string): Promise<IAdmin | null> {
        try {
            return await admin.findById(_id);
        } catch (error) {
            console.log("Error findAdminById:", error);
            throw error;
        }
    }

    async findAllOrders() {
        try {
            return await orders
                .find()
                .populate("bookId")
                .populate("lenderId")
                .populate("userId")
                .populate("cartId")
                .sort({ updatedAt: -1 });
        } catch (error) {
            console.log("Error findAllOrders:", error);
            throw error;
        }
    }

    async findOrderDetail(orderId: string) {
        try {
            return await orders
                .findById({ _id: orderId })
                .populate("bookId")
                .populate("lenderId")
                .populate("userId")
                .populate("cartId");
        } catch (error) {
            console.log("Error findOrderDetail:", error);
            throw error;
        }
    }

    async findAllGenres() {
        try {
            return await genres.find();
        } catch (error) {
            console.log("Error findAllOrders:", error);
            throw error;
        }
    }

    async findGenre(genreId: string) {
        try {
            return await genres.findById({ _id: genreId });
        } catch (error) {
            console.log("Error findGenre:", error);
            throw error;
        }
    }

    async findUpdateGenre(data: Genre, genreId: string) {
        try {
            const genre = await genres.findById({ _id: genreId });
            if (!genre) {
                console.log("Error finding the genre:");
                return null;
            }
            const updatedGenre = await genres.findByIdAndUpdate(
                { _id: genreId },
                {
                    genreName: data.genreName || genre.genreName,
                    image: data.image || genre.image,
                },
                { new: true }
            );
            return updatedGenre;
        } catch (error) {
            console.log("Error findUpdateGenre:", error);
            throw error;
        }
    }
}
