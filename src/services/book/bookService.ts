import { Books, Order } from "../../interfaces/data";
import { IBooks } from "../../model/bookModel";
import { IGenre } from "../../model/genresModel";
import { IOrder } from "../../model/orderModel";
import { IBookService } from "./bookServiceInterface";
import { IBookRepository } from "../../respository/book/bookRepositoryInterface";

export class BookService implements IBookService{
    private bookRepository: IBookRepository;
  
    constructor(bookRepository: IBookRepository) {
      this.bookRepository = bookRepository;
    }
    
    async getAddToBookRent(bookRentData: Books): Promise<IBooks | null> {
        try {
            return await this.bookRepository.addToBookRent(bookRentData);
        } catch (error) {
            console.log("Error getAddToBookRent:", error);
            throw error;
        }
    }

    async getUpdateBookQuantity(
        bookId: string,
        quantity: number
    ): Promise<IBooks | null> {
        try {
            return await this.bookRepository.findUpdateBookQuantity(
                bookId,
                quantity
            );
        } catch (error) {
            console.log("Error getUpdateBookQuantity:", error);
            throw error;
        }
    }
    async getIsOrderExist(sessionId: string):Promise<IOrder | null> {
        try {
            return await this.bookRepository.findIsOrderExist(sessionId);
        } catch (error) {
            console.log("Error getIsOrderExist:", error);
            throw error;
        }
    }

    async getUpdateBookRent(
        bookRentData: Books,
        bookId: string
    ): Promise<IBooks | null> {
        try {
            return await this.bookRepository.updateBookRent(bookRentData, bookId);
        } catch (error) {
            console.log("Error geUpdateBookRent:", error);
            throw error;
        }
    }
    async getGenreMatchedBooks(genreName: string): Promise<IBooks[] | null> {
        try {
            return await this.bookRepository.genreMatchedBooks(genreName);
        } catch (error) {
            console.log("Error geUpdateBookRent:", error);
            throw error;
        }
    }

    async getAddToBookSell(bookSelldata: Books): Promise<IBooks | null> {
        try {
            return await this.bookRepository.addToBookSell(bookSelldata);
        } catch (error) {
            console.log("Error getAddToBookSell:", error);
            throw error;
        }
    }

    async getGenres():Promise<IGenre[]> {
        try {
            return await this.bookRepository.findGenres();
        } catch (error) {
            console.log("Error getGenres:", error);
            throw error;
        }
    }

    async getAllGenres(userId: string):Promise<IGenre[]>  {
        try {
            return await this.bookRepository.findAllGenres(userId);
        } catch (error) {
            console.log("Error getAllGenres:", error);
            throw error;
        }
    }

    async getAllBooks():Promise<IBooks[]> {
        try {
            const books = await this.bookRepository.findAllBooks();
            return books;
        } catch (error) {
            console.log("Error getAllBooks:", error);
            throw error;
        }
    }

    async getBookById(bookId: string): Promise<IBooks | null> {
        try {
            return await this.bookRepository.findBook(bookId);
        } catch (error: any) {
            console.log("Error getBook:", error);
            throw error;
        }
    }

    async getOrders(userId: string):Promise<IOrder[]> {
        try {
            return await this.bookRepository.findOrders(userId);
        } catch (error) {
            console.log("Error getOrders:", error);
            throw error;
        }
    }

    async getRentList(userId: string):Promise<IOrder[]> {
        try {
            return await this.bookRepository.findRentList(userId);
        } catch (error) {
            console.log("Error getOrders:", error);
            throw error;
        }
    }
    async getLendList(userId: string):Promise<IOrder[]> {
        try {
            return await this.bookRepository.findLendList(userId);
        } catch (error) {
            console.log("Error getOrders:", error);
            throw error;
        }
    }

    async getCreateOrder(data: Order):Promise<IOrder | null> {
        try {
            return await this.bookRepository.findCreateOrder(data);
        } catch (error) {
            console.log("Error getCreateOrder:", error);
            throw error;
        }
    }
    async getUpdateOrder(userId: string, bookId: string):Promise<IOrder | null> {
        try {
            return await this.bookRepository.findUpdateOrder(userId, bookId);
        } catch (error) {
            console.log("Error getCreateOrder:", error);
            throw error;
        }
    }

    async getOrderToShowSuccess(userId: string, bookId: string):Promise<IOrder | null> {
        try {
            return await this.bookRepository.findOrderToShowSuccess(userId, bookId);
        } catch (error) {
            console.log("Error getOrderToShowSuccess:", error);
            throw error;
        }
    }

    async getSearchResult(searchQuery: string):Promise<IBooks[]> {
        try {
            return await this.bookRepository.findSearchResult(searchQuery);
        } catch (error) {
            console.log("Error getSearchResult:", error);
            throw error;
        }
    }

    async getUpdateOrderStatusRenter(
        selectedOrderId: string,
        bookStatus: string
    ) :Promise<IOrder | null>{
        try {
            return await this.bookRepository.findUpdateOrderStatusRenter(
                selectedOrderId,
                bookStatus
            );
        } catch (error) {
            console.log("Error getUpdateOrderStatus:", error);
            throw error;
        }
    }
    async getUpdateOrderStatusLender(
        selectedOrderId: string,
        bookStatus: string
    ):Promise<IOrder | null> {
        try {
            const result = await this.bookRepository.findUpdateOrderStatusLender(
                selectedOrderId,
                bookStatus
            ) as IOrder | null
            return result || null
        } catch (error) {
            console.log("Error getUpdateOrderStatus:", error);
            throw error;
        }
    }
}