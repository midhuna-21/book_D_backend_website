import { IUser } from "../../model/userModel";
import { Books, Genre, User, Order } from "../../interfaces/data";
import { IAdmin } from "../../model/adminModel";
import { IGenre } from "../../model/genresModel";
import { IBooks } from "../../model/bookModel";
import { IOrder } from "../../model/orderModel";

interface PaginatedBooks {
    books: IBooks[];
    currentPage: number;
    totalPages: number;
    totalBooks: number;
}

export interface IBookService {
    getAddToBookRent(bookRentData: Books): Promise<IBooks | null>;
    getUpdateBookQuantity(
        bookId: string,
        quantity: number
    ): Promise<IBooks | null>;
    getIsOrderExist(sessionId: string): Promise<IOrder | null>;
    getUpdateBookRent(
        bookRentData: Books,
        bookId: string
    ): Promise<IBooks | null>;
    getGenreMatchedBooks(genreName: string): Promise<IBooks[] | null>;
    getAddToBookSell(bookSelldata: Books): Promise<IBooks | null>;
    getGenres(): Promise<IGenre[]>;
    getGenresWithAvailableBooks(userId: string): Promise<IGenre[]>;
    getAllBooks(): Promise<IBooks[]>;
    getBookById(bookId: string): Promise<IBooks | null>;
    getRentList(userId: string): Promise<IOrder[]>;
    getLendList(userId: string): Promise<IOrder[]>;
    getCreateOrder(data: Order): Promise<IOrder | null>;
    getUpdateOrder(userId: string, bookId: string): Promise<IOrder | null>;
    getOrderToShowSuccess(
        userId: string,
        bookId: string
    ): Promise<IOrder | null>;
    getSearchResult(searchQuery: string): Promise<IBooks[]>;
    getUpdateOrderStatusRenter(
        selectedOrderId: string,
        bookStatus: string
    ): Promise<IOrder | null>;
    getUpdateOrderStatusLender(
        selectedOrderId: string,
        bookStatus: string
    ): Promise<IOrder | null>;
    getAvailableBooksForRent(
        userId: string,
        page: number,
        limit: number,
        searchQuery: string,
        genreName: string
    ): Promise<PaginatedBooks>;
    getArchiveBook(bookId: string): Promise<IBooks | null>;
    getUnArchiveBook(bookId: string): Promise<IBooks | null>;
    getRemoveBook(bookId: string): Promise<IBooks | null>;
    getVerifyingPickupCode(
        orderId: string,
        pickupCode: string
    ): Promise<IOrder | null>;
    getOrderById(orderId: string): Promise<IOrder | null>;
    getConfirmPickupLender(orderId: string): Promise<IOrder | null>;
    getConfirmReturnRenter(orderId: string): Promise<IOrder | null>;
    getUpdateRentalOrder(userId:string,type:string):Promise<IOrder | null>
}
