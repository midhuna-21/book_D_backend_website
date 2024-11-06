import { genres, IGenre } from "../../model/genresModel";
import { user, IUser } from "../../model/userModel";
import { Genre } from "../../interfaces/data";
import { admin, IAdmin } from "../../model/adminModel";
import { books, IBooks } from "../../model/bookModel";
import { IOrder, orders } from "../../model/orderModel";
import { bookDWallet } from "../../model/bookDWallet";
import { IAdminRepository } from "./adminRepositoryInterface";

export class AdminRepository implements IAdminRepository {
    async findAdminByEmail(email: string): Promise<IAdmin | null> {
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
    async findCreateGenre(data: Partial<Genre>): Promise<IGenre | null> {
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

    async findAllUsers(): Promise<IUser[]> {
        try {
            return await user.find();
        } catch (error) {
            console.log("Error findAllUsers:", error);
            throw error;
        }
    }

    async findWalletTransactionsAdmin(): Promise<any[]> {
        try {
            const wallet = await bookDWallet.findOne();
            return wallet ? [wallet] : [];
        } catch (error) {
            console.log("Error findWalletTransactionsAdmin:", error);
            throw error;
        }
    }

    async findAllTotalRentedBooks(): Promise<IBooks[]> {
        try {
            return await books.find({ isRented: true });
        } catch (error) {
            console.log("Error findAllTotalRentedBooks:", error);
            throw error;
        }
    }
    async findAllTotalBooks(): Promise<IBooks[]> {
        try {
            return await books.find();
        } catch (error) {
            console.log("Error findAllTotalBooks:", error);
            throw error;
        }
    }
    async findBlockUser(_id: string): Promise<IUser | null> {
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
    async findUnBlockUser(_id: string): Promise<IUser | null> {
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

    async findAllOrders(): Promise<IOrder[]> {
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

    async findAllGenres(): Promise<IGenre[]> {
        try {
            const genre = await genres
                .find()
                .sort({ createdAt: -1, updatedAt: -1 });
            return genre;
        } catch (error) {
            console.log("Error findAllOrders:", error);
            throw error;
        }
    }

    async findGenre(genreId: string): Promise<IGenre | null> {
        try {
            return await genres.findById({ _id: genreId });
        } catch (error) {
            console.log("Error findGenre:", error);
            throw error;
        }
    }

    async findUpdateGenre(
        data: Genre,
        genreId: string
    ): Promise<IGenre | null> {
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

    async findDeleteGenre(genreId: string): Promise<IGenre | null> {
        try {
            const deletedGenre = await genres.findByIdAndDelete({
                _id: genreId,
            });
            if (!deletedGenre) {
                console.log("Genre not found for deletion");
                return null;
            }
            return deletedGenre;
        } catch (error) {
            console.log("Error findDeleteGenre:", error);
            throw error;
        }
    }
}
