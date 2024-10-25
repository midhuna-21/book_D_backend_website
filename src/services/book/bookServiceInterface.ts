import { IUser } from '../../model/userModel';
import {Books, Genre, User,Order} from '../../interfaces/data'
import { IAdmin } from '../../model/adminModel';
import { IGenre } from '../../model/genresModel';
import { IBooks } from '../../model/bookModel';
import { IOrder } from '../../model/orderModel';

export interface IBookService {
   getAddToBookRent(bookRentData: Books): Promise<IBooks | null>
   getUpdateBookQuantity(bookId: string,quantity: number): Promise<IBooks | null>
   getIsOrderExist(sessionId: string):Promise<IOrder | null>
   getUpdateBookRent(bookRentData: Books,bookId: string): Promise<IBooks | null>
   getGenreMatchedBooks(genreName: string): Promise<IBooks[] | null> 
   getAddToBookSell(bookSelldata: Books): Promise<IBooks | null>
   getGenres():Promise<IGenre[]>
   getAllGenres(userId: string):Promise<IGenre[]> 
   getAllBooks():Promise<IBooks[]>
   getBookById(bookId: string): Promise<IBooks | null>
   getOrders(userId: string):Promise<IOrder[]>
   getRentList(userId: string):Promise<IOrder[]>
   getLendList(userId: string):Promise<IOrder[]> 
   getCreateOrder(data: Order):Promise<IOrder | null>
   getUpdateOrder(userId: string, bookId: string):Promise<IOrder | null>
   getOrderToShowSuccess(userId: string, bookId: string):Promise<IOrder | null>
   getSearchResult(searchQuery: string):Promise<IBooks[]>
   getUpdateOrderStatusRenter(selectedOrderId: string,bookStatus: string) :Promise<IOrder | null>
   getUpdateOrderStatusLender(selectedOrderId: string,bookStatus: string):Promise<IOrder | null>
}
