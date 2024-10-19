"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookRepository = void 0;
const bookModel_1 = require("../model/bookModel");
const genresModel_1 = require("../model/genresModel");
const orderModel_1 = require("../model/orderModel");
const walletRepository_1 = require("./walletRepository");
const walletRepository = new walletRepository_1.WalletRepository();
class BookRepository {
    async findUpdateBookQuantity(bookId, quantity) {
        try {
            const updateBook = await bookModel_1.books.findByIdAndUpdate({ _id: bookId }, { quantity: quantity }, { new: true });
            return updateBook;
        }
        catch (error) {
            console.log("Error findCreateOrder:", error);
            throw error;
        }
    }
    async findIsOrderExist(sessionId) {
        try {
            const isOrderExist = await orderModel_1.orders.findOne({ sessionId: sessionId });
            return isOrderExist;
        }
        catch (error) {
            console.log("Error findCreateOrder:", error);
            throw error;
        }
    }
    async addToBookRent(bookRentData) {
        try {
            return new bookModel_1.books({
                bookTitle: bookRentData.bookTitle,
                description: bookRentData.description,
                author: bookRentData.author,
                publisher: bookRentData.publisher,
                publishedYear: bookRentData.publishedYear,
                genre: bookRentData.genre,
                images: bookRentData.images,
                rentalFee: bookRentData.rentalFee,
                extraFee: bookRentData.extraFee,
                address: {
                    street: bookRentData.address?.street || "",
                    city: bookRentData.address?.city || "",
                    district: bookRentData.address?.district || "",
                    state: bookRentData.address?.state || "",
                    pincode: bookRentData.address?.pincode || "",
                },
                isRented: true,
                quantity: bookRentData.quantity,
                maxDistance: bookRentData.maxDistance,
                maxDays: bookRentData.maxDays,
                minDays: bookRentData.minDays,
                lenderId: bookRentData.lenderId,
                latitude: bookRentData.latitude,
                longitude: bookRentData.longitude,
            }).save();
        }
        catch (error) {
            console.log("Error addToBookRent:", error);
            throw error;
        }
    }
    async updateBookRent(bookRentData, bookId) {
        try {
            const rentBookToUpdate = await bookModel_1.books.findById({ _id: bookId });
            if (!rentBookToUpdate) {
                console.log("Error finding the renting book to update:");
                return null;
            }
            else {
                return bookModel_1.books.findByIdAndUpdate({ _id: bookId }, {
                    bookTitle: bookRentData.bookTitle || rentBookToUpdate.bookTitle,
                    description: bookRentData.description || rentBookToUpdate.description,
                    author: bookRentData.author || rentBookToUpdate.author,
                    publisher: bookRentData.publisher || rentBookToUpdate.publisher,
                    publishedYear: bookRentData.publishedYear || rentBookToUpdate.publishedYear,
                    genre: bookRentData.genre || rentBookToUpdate.genre,
                    images: bookRentData.images || rentBookToUpdate.images,
                    rentalFee: bookRentData.rentalFee || rentBookToUpdate.rentalFee,
                    extraFee: bookRentData.extraFee || rentBookToUpdate.extraFee,
                    address: {
                        street: bookRentData.address?.street || rentBookToUpdate.address?.street,
                        city: bookRentData.address?.city || rentBookToUpdate.address?.city,
                        district: bookRentData.address?.district || rentBookToUpdate.address?.district,
                        state: bookRentData.address?.state || rentBookToUpdate.address?.state,
                        pincode: bookRentData.address?.pincode || rentBookToUpdate.address?.pincode,
                    },
                    isRented: true,
                    quantity: bookRentData.quantity || rentBookToUpdate.quantity,
                    maxDistance: bookRentData.maxDistance || rentBookToUpdate.maxDistance,
                    maxDays: bookRentData.maxDays || rentBookToUpdate.maxDays,
                    minDays: bookRentData.minDays || rentBookToUpdate.minDays,
                    lenderId: bookRentData.lenderId || rentBookToUpdate.lenderId,
                    latitude: bookRentData.latitude || rentBookToUpdate.latitude,
                    longitude: bookRentData.longitude || rentBookToUpdate.longitude,
                }, { new: true }).exec();
            }
        }
        catch (error) {
            console.log("Error updateBookRent:", error);
            throw error;
        }
    }
    async findAllBooks() {
        try {
            const bookies = await bookModel_1.books.find().sort({ updatedAt: -1 });
            return bookies;
        }
        catch (error) {
            console.log("Error findAllGenres:", error);
            throw error;
        }
    }
    async findGenres() {
        try {
            const allGenres = await genresModel_1.genres.find().sort({ updatedAt: -1 });
            return allGenres;
        }
        catch (error) {
            console.log("Error findAllGenres:", error);
            throw error;
        }
    }
    async findAllGenres(userId) {
        try {
            const allBooks = await bookModel_1.books.find({ lenderId: { $ne: userId } });
            const allGenres = await genresModel_1.genres.find();
            const genresWithBooks = allGenres.filter(genre => allBooks.some(book => book.genre === genre.genreName));
            return genresWithBooks;
        }
        catch (error) {
            console.log("Error findAllGenres:", error);
            throw error;
        }
    }
    async addToBookSell(bookSelldata) {
        try {
            return await new bookModel_1.books({
                bookTitle: bookSelldata.bookTitle,
                description: bookSelldata.description,
                author: bookSelldata.author,
                publisher: bookSelldata.publisher,
                publishedYear: bookSelldata.publishedYear,
                genre: bookSelldata.genre,
                images: bookSelldata.images,
                price: bookSelldata.price,
                address: {
                    street: bookSelldata.address?.street || "",
                    city: bookSelldata.address?.city || "",
                    district: bookSelldata.address?.district || "",
                    state: bookSelldata.address?.state || "",
                    pincode: bookSelldata.address?.pincode || "",
                },
                isSell: true,
                lenderId: bookSelldata.lenderId,
                latitude: bookSelldata.latitude,
                longitude: bookSelldata.longitude,
            }).save();
        }
        catch (error) {
            console.log("Error addToBookSell:", error);
            throw error;
        }
    }
    async findBook(bookId) {
        try {
            const book = await bookModel_1.books.findById({ _id: bookId });
            if (!book) {
                return null;
            }
            return book;
        }
        catch (error) {
            console.log("Error findBook:", error);
            throw error;
        }
    }
    async findCreateOrder(data) {
        try {
            const order = await new orderModel_1.orders({
                sessionId: data.sessionId,
                cartId: data.cartId,
                bookId: data.bookId,
                userId: data.userId,
                lenderId: data.lenderId,
                isPaid: true,
            }).save();
            const populatedOrder = await orderModel_1.orders.findById(order._id)
                .populate('cartId')
                .populate('bookId')
                .populate('userId')
                .populate('lenderId')
                .exec();
            return populatedOrder;
        }
        catch (error) {
            console.log("Error findCreateOrderProcess:", error);
            throw error;
        }
    }
    async findUpdateOrder(userId, bookId) {
        try {
            const existingOrder = await orderModel_1.orders.findOne({
                userId: userId,
                bookId: bookId,
                isSuccessfull: false
            });
            if (!existingOrder) {
                console.log('Order is already successful or does not exist.');
                return null;
            }
            const order = await orderModel_1.orders
                .findOneAndUpdate({ userId: userId, bookId: bookId }, {
                isSuccessfull: true,
                isMoneyTransactionStatus: "sent_to_website",
                isTrasaction: ["pending"],
            }, { new: true })
                .populate("bookId")
                .populate("userId")
                .populate("lenderId");
            return order;
        }
        catch (error) {
            console.log("Error findCreateOrder:", error);
            throw error;
        }
    }
    async genreMatchedBooks(genreName) {
        try {
            const allBooks = await bookModel_1.books
                .find({ genre: genreName });
            return allBooks;
        }
        catch (error) {
            console.log("Error findOrderToShowSuccess:", error);
            throw error;
        }
    }
    async findOrderToShowSuccess(userId, bookId) {
        try {
            const order = await orderModel_1.orders
                .findOne({ userId: userId, bookId: bookId, isPaid: true })
                .populate("bookId")
                .populate("userId")
                .populate("lenderId");
            return order;
        }
        catch (error) {
            console.log("Error findOrderToShowSuccess:", error);
            throw error;
        }
    }
    async findOrders(userId) {
        try {
            const order = await orderModel_1.orders
                .find({ userId: userId })
                .populate("bookId")
                .populate("userId")
                .populate("cartId")
                .populate("lenderId")
                .sort({ createdAt: -1 });
            return order;
        }
        catch (error) {
            console.log("Error findOrders:", error);
            throw error;
        }
    }
    async findRentList(userId) {
        try {
            const order = await orderModel_1.orders
                .find({ userId: userId })
                .populate("bookId")
                .populate("userId")
                .populate("cartId")
                .populate("lenderId")
                .sort({ updatedAt: -1 });
            return order;
        }
        catch (error) {
            console.log("Error findOrders:", error);
            throw error;
        }
    }
    async findLendList(userId) {
        try {
            const order = await orderModel_1.orders
                .find({ lenderId: userId })
                .populate("bookId")
                .populate("userId")
                .populate("cartId")
                .populate("lenderId")
                .sort({ updatedAt: -1 });
            return order;
        }
        catch (error) {
            console.log("Error findOrders:", error);
            throw error;
        }
    }
    async findSearchResult(searchQuery) {
        try {
            const result = await bookModel_1.books.find({
                $or: [
                    { genre: { $regex: searchQuery, $options: "i" } },
                    { bookTitle: { $regex: searchQuery, $options: "i" } },
                ],
            });
            return result;
        }
        catch (error) {
            console.log("Error findSearchResult:", error);
            throw error;
        }
    }
    async findUpdateOrderStatusRenter(selectedOrderId, bookStatus) {
        try {
            const orderDetails = await orderModel_1.orders.findById({ _id: selectedOrderId }).populate('userId').populate('lenderId').populate({ path: 'cartId', select: 'totalRentalPrice  ' });
            if (bookStatus == "not_returned") {
                return await orderModel_1.orders.findByIdAndUpdate({ _id: selectedOrderId }, {
                    $set: {
                        bookStatusFromRenter: `${bookStatus}`,
                        statusUpdateRenterDate: new Date(),
                    }
                }, { new: true });
            }
            else if (bookStatus == "completed") {
                return await orderModel_1.orders.findByIdAndUpdate({ _id: selectedOrderId }, {
                    $set: {
                        bookStatusFromRenter: `${bookStatus}`,
                        bookStatusFromLender: `${bookStatus}`,
                        statusUpdateRenterDate: new Date(),
                    }
                }, { new: true });
            }
            const order = await orderModel_1.orders.findByIdAndUpdate({ _id: selectedOrderId }, { bookStatusFromRenter: bookStatus }, { new: true });
            return order;
        }
        catch (error) {
            console.log("Error findUpdateOrderStatus:", error);
            throw error;
        }
    }
    async findUpdateOrderStatusLender(selectedOrderId, bookStatus) {
        try {
            const orderDetails = await orderModel_1.orders.findById({ _id: selectedOrderId }).populate('userId').populate('lenderId').populate({ path: 'cartId', select: 'totalRentalPrice  ' });
            if (bookStatus == "not_returned") {
                return await orderModel_1.orders.findByIdAndUpdate({ _id: selectedOrderId }, {
                    $set: {
                        bookStatusFromLender: `${bookStatus}`,
                        statusUpdateRenterDate: new Date(),
                    }
                }, { new: true });
            }
            else if (bookStatus == "completed") {
                const updatedOrderCompleted = await orderModel_1.orders.findByIdAndUpdate({ _id: selectedOrderId }, {
                    $set: {
                        bookStatusFromLender: `${bookStatus}`,
                        statusUpdateRenterDate: new Date(),
                    }
                }, { new: true });
                if (updatedOrderCompleted) {
                    return await walletRepository.walletPaymentTransfer(selectedOrderId);
                }
            }
            const order = await orderModel_1.orders.findByIdAndUpdate({ _id: selectedOrderId }, { bookStatusFromLender: bookStatus }, { new: true });
            return order;
        }
        catch (error) {
            console.log("Error findUpdateOrderStatus:", error);
            throw error;
        }
    }
}
exports.BookRepository = BookRepository;
//# sourceMappingURL=bookRepository.js.map