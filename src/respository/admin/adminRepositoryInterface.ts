import { IUser } from "../../model/userModel";
import { IGenre } from "../../model/genresModel";
import { IBooks } from "../../model/bookModel";
import { IAdmin } from "../../model/adminModel";
import { IBookWalletTransaction } from "../../model/bookDWallet";
import { IOrder } from "../../model/orderModel";
import { User, Genre, Admin } from "../../interfaces/data";

export interface IAdminRepository {
    findAdminByEmail(email: string): Promise<IAdmin | null>;
    findGenreByName(genreName: string): Promise<IGenre | null>;
    findUpdateGenre(data: Genre, genreId: string): Promise<IGenre | null>;
    findCreateGenre(data: Genre): Promise<IGenre | null>;
    findAllUsers(): Promise<IUser[]>;
    findWalletTransactionsAdmin(): Promise<any[]>;
    findAllTotalRentedBooks(): Promise<IBooks[]>;
    findAllTotalBooks(): Promise<IBooks[]>;
    findBlockUser(_id: string): Promise<IUser | null>;
    findUnBlockUser(_id: string): Promise<IUser | null>;
    findAdminById(_id: string): Promise<IAdmin | null>;
    findAllOrders(): Promise<IOrder[]>;
    findOrderDetail(orderId: string): Promise<IOrder | null>;
    findAllGenres(): Promise<IGenre[]>;
    findGenre(genreId: string): Promise<IGenre | null>;
    findDeleteGenre(genreId: string): Promise<IGenre | null>;
    findAllTotalOrders(): Promise<IOrder[]>;
}
