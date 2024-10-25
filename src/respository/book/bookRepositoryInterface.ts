import { IUser } from '../../model/userModel';
import { IGenre } from '../../model/genresModel';
import { IBooks } from '../../model/bookModel';
import { IAdmin } from '../../model/adminModel';
import { IBookWalletTransaction } from '../../model/bookDWallet';
import { IOrder } from '../../model/orderModel';
import {User,Genre,Admin, Books,Order} from '../../interfaces/data';

export interface IBookRepository {
   findUpdateBookQuantity(bookId: string,quantity: number):Promise<IBooks | null>
   findIsOrderExist(sessionId: string):Promise<IOrder | null>
   addToBookRent(bookRentData: Books): Promise<IBooks | null>
   updateBookRent(bookRentData: Books,bookId:string): Promise<IBooks | null>
   findAllBooks():Promise<IBooks[]>
   findGenres():Promise<IGenre[]>
   findAllGenres(userId:string):Promise<IGenre[]>
   addToBookSell(bookSelldata: Books): Promise<IBooks | null>
   findBook(bookId: string): Promise<IBooks | null>
   findCreateOrder(data: Order):Promise<IOrder | null>
   findUpdateOrder(userId: string, bookId: string):Promise<IOrder | null>
   genreMatchedBooks(genreName:string):Promise<IBooks[] | null> 
   findOrderToShowSuccess(userId: string, bookId: string):Promise<IOrder | null>
   findOrders(userId: string):Promise<IOrder[]>
   findRentList(userId: string):Promise<IOrder[]>
   findLendList(userId: string):Promise<IOrder[]> 
   findSearchResult(searchQuery: string):Promise<IBooks[]> 
   findUpdateOrderStatusRenter(selectedOrderId: string,bookStatus:string):Promise<IOrder | null> 
   findUpdateOrderStatusLender(selectedOrderId: string,bookStatus:string):Promise<IOrder | null> 
}
