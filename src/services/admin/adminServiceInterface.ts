import { IUser } from '../../model/userModel';
import {Genre, User} from '../../interfaces/data'
import { IAdmin } from '../../model/adminModel';
import { IGenre } from '../../model/genresModel';
import { IBooks } from '../../model/bookModel';
import { IOrder } from '../../model/orderModel';

export interface IAdminService {
   getAdminByEmail(email: string): Promise<IAdmin | null>;
   getGenreName(genreName: string): Promise<IGenre | null>;
   getCreateGenre(data: Genre): Promise<IGenre | null>;
   getAllUsers(): Promise<IUser[]>;
   getWalletTransactionsAdmin(): Promise<any[]>;
   getAllTotalRentedBooks(): Promise<IBooks[]>;
   getAllTotalBooks():Promise<IBooks[]>
   getBlockUser(_id: string): Promise<IUser | null>
   getUnblockUser(_id: string): Promise<IUser | null>
   getAdminById(_id: string): Promise<IAdmin | null>
   getAllOrders():Promise<IOrder[]>
   getOrderDetail(orderId: string) :Promise<IOrder | null>
   getAllGenres():Promise<IGenre[]>
   getUpdateGenre(data: Genre, genreId: string):Promise<IGenre | null>
   getGenre(genreId: string):Promise<IGenre | null>
   getDeleteGenre(genreId:string):Promise<IGenre | null>
}
