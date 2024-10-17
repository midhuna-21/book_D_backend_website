import { BookRepository } from "../respository/bookRepository";
import { Books, Order } from "../interfaces/data";
import { IBooks } from "../model/bookModel";

const bookRepository = new BookRepository();

export class BookService {
    async getAddToBookRent(bookRentData: Books): Promise<IBooks | null> {
        try {
            return await bookRepository.addToBookRent(bookRentData);
        } catch (error) {
            console.log("Error getAddToBookRent:", error);
            throw error;
        }
    }

    async getUpdateBookQuantity(
        bookId: string,quantity:number
    ): Promise<IBooks | null> {
        try {
            return await bookRepository.findUpdateBookQuantity(bookId,quantity);
        } catch (error) {
            console.log("Error getUpdateBookQuantity:", error);
            throw error;
        }
    }
    async getIsOrderExist(sessionId:string
    ){
        try {
            return await bookRepository.findIsOrderExist(sessionId);
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
            return await bookRepository.updateBookRent(bookRentData, bookId);
        } catch (error) {
            console.log("Error geUpdateBookRent:", error);
            throw error;
        }
    }
    async getGenreMatchedBooks(
        genreName: string
    ): Promise<IBooks[] | null> {
        try {
            return await bookRepository.genreMatchedBooks(genreName);
        } catch (error) {
            console.log("Error geUpdateBookRent:", error);
            throw error;
        }
    }
    
    async getAddToBookSell(bookSelldata: Books): Promise<IBooks | null> {
        try {
            return await bookRepository.addToBookSell(bookSelldata);
        } catch (error) {
            console.log("Error getAddToBookSell:", error);
            throw error;
        }
    }
    
    async getGenres() {
        try {
            return await bookRepository.findGenres();
        } catch (error) {
            console.log("Error getGenres:", error);
            throw error;
        }
    }

    async getAllGenres(userId:string) {
        try {
            return await bookRepository.findAllGenres(userId);
        } catch (error) {
            console.log("Error getAllGenres:", error);
            throw error;
        }
    }
    
    async getAllBooks() {
        try {
            const books = await bookRepository.findAllBooks();
            return books;
        } catch (error) {
            console.log("Error getAllBooks:", error);
            throw error;
        }
    }
    
    async getBookById(bookId: string): Promise<IBooks | null> {
        try {
            return await bookRepository.findBook(bookId);
        } catch (error: any) {
            console.log("Error getBook:", error);
            throw error;
        }
    }
    
    async getOrders(userId: string) {
        try {
            return await bookRepository.findOrders(userId);
        } catch (error) {
            console.log("Error getOrders:", error);
            throw error;
        }
    }

    async getRentList(userId: string) {
        try {
            return await bookRepository.findRentList(userId);
        } catch (error) {
            console.log("Error getOrders:", error);
            throw error;
        }
    }
    async getLendList(userId: string) {
        try {
            return await bookRepository.findLendList(userId);
        } catch (error) {
            console.log("Error getOrders:", error);
            throw error;
        }
    }
    
    async getCreateOrder(data: Order) {
        try {
            return await bookRepository.findCreateOrder(data);
        } catch (error) {
            console.log("Error getCreateOrder:", error);
            throw error;
        }
    }
    async getUpdateOrder(userId: string, bookId: string) {
        try {
            return await bookRepository.findUpdateOrder(userId, bookId);
        } catch (error) {
            console.log("Error getCreateOrder:", error);
            throw error;
        }
    }


    async getOrderToShowSuccess(userId: string, bookId: string) {
        try {
            return await bookRepository.findOrderToShowSuccess(userId, bookId);
        } catch (error) {
            console.log("Error getOrderToShowSuccess:", error);
            throw error;
        }
    }

    async getSearchResult(searchQuery: string) {
        try {
            return await bookRepository.findSearchResult(searchQuery);
        } catch (error) {
            console.log("Error getSearchResult:", error);
            throw error;
        }
    }

    async getUpdateOrderStatusRenter(selectedOrderId: string,bookStatus:string) {
    try{
        return await bookRepository.findUpdateOrderStatusRenter(selectedOrderId,bookStatus);
    }
    catch(error) {
        console.log("Error getUpdateOrderStatus:", error);
        throw error;
    }
    }
    async getUpdateOrderStatusLender(selectedOrderId: string,bookStatus:string) {
        try{
            return await bookRepository.findUpdateOrderStatusLender(selectedOrderId,bookStatus);
        }
        catch(error) {
            console.log("Error getUpdateOrderStatus:", error);
            throw error;
        }
    }

}

