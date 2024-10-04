"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookService = void 0;
const bookRepository_1 = require("../respository/bookRepository");
const bookRepository = new bookRepository_1.BookRepository();
class BookService {
    async getAddToBookRent(bookRentData) {
        try {
            return await bookRepository.addToBookRent(bookRentData);
        }
        catch (error) {
            console.log("Error getAddToBookRent:", error);
            throw error;
        }
    }
    async getUpdateBookRent(bookRentData, bookId) {
        try {
            return await bookRepository.updateBookRent(bookRentData, bookId);
        }
        catch (error) {
            console.log("Error geUpdateBookRent:", error);
            throw error;
        }
    }
    async getGenreMatchedBooks(genreName) {
        try {
            return await bookRepository.genreMatchedBooks(genreName);
        }
        catch (error) {
            console.log("Error geUpdateBookRent:", error);
            throw error;
        }
    }
    async getAddToBookSell(bookSelldata) {
        try {
            return await bookRepository.addToBookSell(bookSelldata);
        }
        catch (error) {
            console.log("Error getAddToBookSell:", error);
            throw error;
        }
    }
    async getGenres() {
        try {
            return await bookRepository.findGenres();
        }
        catch (error) {
            console.log("Error getGenres:", error);
            throw error;
        }
    }
    async getAllGenres(userId) {
        try {
            return await bookRepository.findAllGenres(userId);
        }
        catch (error) {
            console.log("Error getAllGenres:", error);
            throw error;
        }
    }
    async getAllBooks() {
        try {
            const books = await bookRepository.findAllBooks();
            return books;
        }
        catch (error) {
            console.log("Error getAllBooks:", error);
            throw error;
        }
    }
    async getBookById(bookId) {
        try {
            return await bookRepository.findBook(bookId);
        }
        catch (error) {
            console.log("Error getBook:", error);
            throw error;
        }
    }
    async getOrders(userId) {
        try {
            return await bookRepository.findOrders(userId);
        }
        catch (error) {
            console.log("Error getOrders:", error);
            throw error;
        }
    }
    async getCreateOrder(data) {
        try {
            return await bookRepository.findCreateOrder(data);
        }
        catch (error) {
            console.log("Error getCreateOrder:", error);
            throw error;
        }
    }
    async getUpdateOrder(userId, bookId) {
        try {
            return await bookRepository.findUpdateOrder(userId, bookId);
        }
        catch (error) {
            console.log("Error getCreateOrder:", error);
            throw error;
        }
    }
    async getOrderToShowSuccess(userId, bookId) {
        try {
            return await bookRepository.findOrderToShowSuccess(userId, bookId);
        }
        catch (error) {
            console.log("Error getOrderToShowSuccess:", error);
            throw error;
        }
    }
    async getSearchResult(searchQuery) {
        try {
            return await bookRepository.findSearchResult(searchQuery);
        }
        catch (error) {
            console.log("Error getSearchResult:", error);
            throw error;
        }
    }
    async getUpdateOrderStatus(selectedOrderId, bookStatus) {
        try {
            return await bookRepository.findUpdateOrderStatus(selectedOrderId, bookStatus);
        }
        catch (error) {
            console.log("Error getUpdateOrderStatus:", error);
            throw error;
        }
    }
}
exports.BookService = BookService;
//# sourceMappingURL=bookService.js.map