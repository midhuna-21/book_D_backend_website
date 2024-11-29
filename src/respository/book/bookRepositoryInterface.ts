 import { IGenre } from "../../model/genresModel";
import { IBooks } from "../../model/bookModel";
import { IOrder } from "../../model/orderModel";
import { Books, Order } from "../../interfaces/data";

interface PaginatedBooks {
    books: IBooks[];
    currentPage: number;
    totalPages: number;
    totalBooks: number;
}

export interface IBookRepository {
    findUpdateBookQuantity(
        bookId: string,
        quantity: number
    ): Promise<IBooks | null>;
    findIsOrderExist(sessionId: string): Promise<IOrder | null>;
    addToBookRent(bookRentData: Books): Promise<IBooks | null>;
    updateBookRent(bookRentData: Books, bookId: string): Promise<IBooks | null>;
    findAllBooks(): Promise<IBooks[]>;
    findGenres(): Promise<IGenre[]>;
    findGenresWithAvailableBooks(userId: string): Promise<IGenre[]>;
    addToBookSell(bookSelldata: Books): Promise<IBooks | null>;
    findBook(bookId: string): Promise<IBooks | null>;
    findCreateOrder(data: Order): Promise<IOrder | null>;
    findUpdateOrder(userId: string, bookId: string): Promise<IOrder | null>;
    genreMatchedBooks(genreName: string): Promise<IBooks[] | null>;
    findOrderToShowSuccess(
        userId: string,
        bookId: string
    ): Promise<IOrder | null>;
    findRentList(userId: string): Promise<IOrder[]>;
    findLendList(userId: string): Promise<IOrder[]>;
    findSearchResult(searchQuery: string): Promise<IBooks[]>;
    findUpdateOrderStatusRenter(
        selectedOrderId: string,
        bookStatus: string
    ): Promise<IOrder | null>;
    findUpdateOrderStatusLender(
        selectedOrderId: string,
        bookStatus: string
    ): Promise<IOrder | null>;
    findAvailableBooksForRent(
        userId: string,
        page: number,
        limit: number,
        searchQuery: string,
        genreName: string
    ): Promise<PaginatedBooks>;
    findArchiveBook(bookId: string): Promise<IBooks | null>;
    findUnArchiveBook(bookId: string): Promise<IBooks | null>;
    findRemoveBook(bookId: string): Promise<IBooks | null>;
    findVerifyingPickup(
        orderId: string,
        pickupCode: string
    ): Promise<IOrder | null>;
    findOrderById(orderId: string): Promise<IOrder | null>;
    findConfirmPickupLender(orderId: string): Promise<IOrder | null>;
    findConfirmReturnRenter(orderId: string): Promise<IOrder | null>;
    updateCancelRental(orderId:string,userId:string,type:string):Promise<IOrder | null>
}
