"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookService = void 0;
class BookService {
    constructor(bookRepository) {
        this.bookRepository = bookRepository;
    }
    async getUpdateCancelRental(orderId, userId, type) {
        try {
            return await this.bookRepository.updateCancelRental(orderId, userId, type);
        }
        catch (error) {
            console.log("Error getUpdateRentalOrder", error);
            throw error;
        }
    }
    async getAddToBookRent(bookRentData) {
        try {
            return await this.bookRepository.addToBookRent(bookRentData);
        }
        catch (error) {
            console.log("Error getAddToBookRent:", error);
            throw error;
        }
    }
    async getUpdateBookQuantity(bookId, quantity) {
        try {
            return await this.bookRepository.findUpdateBookQuantity(bookId, quantity);
        }
        catch (error) {
            console.log("Error getUpdateBookQuantity:", error);
            throw error;
        }
    }
    async getIsOrderExist(sessionId) {
        try {
            return await this.bookRepository.findIsOrderExist(sessionId);
        }
        catch (error) {
            console.log("Error getIsOrderExist:", error);
            throw error;
        }
    }
    async getUpdateBookRent(bookRentData, bookId) {
        try {
            return await this.bookRepository.updateBookRent(bookRentData, bookId);
        }
        catch (error) {
            console.log("Error geUpdateBookRent:", error);
            throw error;
        }
    }
    async getGenreMatchedBooks(genreName) {
        try {
            return await this.bookRepository.genreMatchedBooks(genreName);
        }
        catch (error) {
            console.log("Error geUpdateBookRent:", error);
            throw error;
        }
    }
    async getAddToBookSell(bookSelldata) {
        try {
            return await this.bookRepository.addToBookSell(bookSelldata);
        }
        catch (error) {
            console.log("Error getAddToBookSell:", error);
            throw error;
        }
    }
    async getGenres() {
        try {
            return await this.bookRepository.findGenres();
        }
        catch (error) {
            console.log("Error getGenres:", error);
            throw error;
        }
    }
    async getGenresWithAvailableBooks(userId) {
        try {
            return await this.bookRepository.findGenresWithAvailableBooks(userId);
        }
        catch (error) {
            console.log("Error getAllGenres:", error);
            throw error;
        }
    }
    async getAllBooks() {
        try {
            const books = await this.bookRepository.findAllBooks();
            return books;
        }
        catch (error) {
            console.log("Error getAllBooks:", error);
            throw error;
        }
    }
    async getBookById(bookId) {
        try {
            return await this.bookRepository.findBook(bookId);
        }
        catch (error) {
            console.log("Error getBook:", error);
            throw error;
        }
    }
    async getRemoveBook(bookId) {
        try {
            return await this.bookRepository.findRemoveBook(bookId);
        }
        catch (error) {
            console.log("Error getRemoveBook", error);
            throw error;
        }
    }
    async getRentList(userId) {
        try {
            return await this.bookRepository.findRentList(userId);
        }
        catch (error) {
            console.log("Error getRentList:", error);
            throw error;
        }
    }
    async getLendList(userId) {
        try {
            return await this.bookRepository.findLendList(userId);
        }
        catch (error) {
            console.log("Error getLendList:", error);
            throw error;
        }
    }
    async getCreateOrder(data) {
        try {
            return await this.bookRepository.findCreateOrder(data);
        }
        catch (error) {
            console.log("Error getCreateOrder:", error);
            throw error;
        }
    }
    async getUpdateOrder(userId, bookId) {
        try {
            return await this.bookRepository.findUpdateOrder(userId, bookId);
        }
        catch (error) {
            console.log("Error getCreateOrder:", error);
            throw error;
        }
    }
    async getOrderToShowSuccess(userId, bookId) {
        try {
            return await this.bookRepository.findOrderToShowSuccess(userId, bookId);
        }
        catch (error) {
            console.log("Error getOrderToShowSuccess:", error);
            throw error;
        }
    }
    async getSearchResult(searchQuery) {
        try {
            return await this.bookRepository.findSearchResult(searchQuery);
        }
        catch (error) {
            console.log("Error getSearchResult:", error);
            throw error;
        }
    }
    async getUpdateOrderStatusRenter(selectedOrderId, bookStatus) {
        try {
            return await this.bookRepository.findUpdateOrderStatusRenter(selectedOrderId, bookStatus);
        }
        catch (error) {
            console.log("Error getUpdateOrderStatus:", error);
            throw error;
        }
    }
    async getUpdateOrderStatusLender(selectedOrderId, bookStatus) {
        try {
            const result = (await this.bookRepository.findUpdateOrderStatusLender(selectedOrderId, bookStatus));
            return result || null;
        }
        catch (error) {
            console.log("Error getUpdateOrderStatus:", error);
            throw error;
        }
    }
    async getAvailableBooksForRent(userId, page, limit, searchQuery, genreName) {
        try {
            return await this.bookRepository.findAvailableBooksForRent(userId, page, limit, searchQuery, genreName);
        }
        catch (error) {
            console.log("Error getUpdateOrderStatus:", error);
            throw error;
        }
    }
    async getArchiveBook(bookId) {
        try {
            return await this.bookRepository.findArchiveBook(bookId);
        }
        catch (error) {
            console.log("Error getArchiveBook:", error);
            throw error;
        }
    }
    async getUnArchiveBook(bookId) {
        try {
            return await this.bookRepository.findUnArchiveBook(bookId);
        }
        catch (error) {
            console.log("Error getUnArchiveBook:", error);
            throw error;
        }
    }
    async getVerifyingPickupCode(orderId, pickupCode) {
        try {
            return await this.bookRepository.findVerifyingPickup(orderId, pickupCode);
        }
        catch (error) {
            console.log("Error getUnArchiveBook:", error);
            throw error;
        }
    }
    async getOrderById(orderId) {
        try {
            return await this.bookRepository.findOrderById(orderId);
        }
        catch (error) {
            console.log("Error getOrderById:", error);
            throw error;
        }
    }
    async getConfirmPickupLender(orderId) {
        try {
            return await this.bookRepository.findConfirmPickupLender(orderId);
        }
        catch (error) {
            console.log("Error getConfirmPickupStatusRenter:", error);
            throw error;
        }
    }
    async getConfirmReturnRenter(orderId) {
        try {
            return await this.bookRepository.findConfirmReturnRenter(orderId);
        }
        catch (error) {
            console.log("Error getConfirmPickupStatusRenter:", error);
            throw error;
        }
    }
}
exports.BookService = BookService;
//# sourceMappingURL=bookService.js.map