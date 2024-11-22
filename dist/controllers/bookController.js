"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkIsOrderExistByOrderId = exports.updateConfirmReturnByRenter = exports.updateConfirmPickupByLender = exports.removeBook = exports.unArchiveBook = exports.archiveBook = exports.fetchBooksByGenre = exports.updateOrderStatusByLender = exports.updateOrderStatusByRenter = exports.fetchSuccessfullRentalOrders = exports.fetchBooksBySearch = exports.fetchLentBooks = exports.fetchRentalOrders = exports.createRentalOrder = exports.createRentalCheckout = exports.rentalProcess = exports.soldBooks = exports.fetchUserLentBooks = exports.updateLentBookDetails = exports.createBookLend = exports.fetchBookDetails = exports.fetchGenresWithAvailableBooks = exports.fetchAvailableBooksForRent = exports.fetchGenres = void 0;
const client_s3_1 = require("@aws-sdk/client-s3");
const crypto_1 = __importDefault(require("crypto"));
const config_1 = __importDefault(require("../config/config"));
const s3_request_presigner_1 = require("@aws-sdk/s3-request-presigner");
const rentBookValidation_1 = __importDefault(require("../utils/ReuseFunctions/rentBookValidation"));
const store_1 = require("../utils/imageFunctions/store");
const stripe_1 = __importDefault(require("stripe"));
const index_1 = require("../services/index");
const index_2 = require("../services/index");
const index_3 = require("../services/index");
const index_4 = require("../services/index");
const fetchGenres = async (req, res) => {
    try {
        const genres = await index_1.bookService.getGenres();
        return res.status(200).json(genres);
    }
    catch (error) {
        console.log(error.message);
        return res.status(500).json({ message: "Internal server error" });
    }
};
exports.fetchGenres = fetchGenres;
const fetchGenresWithAvailableBooks = async (req, res) => {
    try {
        const userId = req.userId;
        const genres = await index_1.bookService.getGenresWithAvailableBooks(userId);
        return res.status(200).json(genres);
    }
    catch (error) {
        console.log(error.message);
        return res.status(500).json({ message: "Internal server error" });
    }
};
exports.fetchGenresWithAvailableBooks = fetchGenresWithAvailableBooks;
const fetchAvailableBooksForRent = async (req, res) => {
    try {
        const { page = 1, limit = 10, searchQuery = "", genreName = "", } = req.query;
        const userId = req.userId;
        const data = await index_1.bookService.getAvailableBooksForRent(userId, +page, +limit, searchQuery, genreName);
        res.status(200).json({
            books: data?.books,
            currentPage: data?.currentPage,
            totalPages: data?.totalPages,
            totalBooks: data?.totalBooks,
        });
    }
    catch (error) {
        console.error(error.message, "fetchBooks");
        return res.status(500).json({ message: "Internal server error" });
    }
};
exports.fetchAvailableBooksForRent = fetchAvailableBooksForRent;
const fetchBooksByGenre = async (req, res) => {
    try {
        const userId = req.userId;
        const genreName = req.params.genreName?.toString();
        const allBooks = await index_1.bookService.getGenreMatchedBooks(genreName);
        const booksToShow = [];
        if (!allBooks) {
            return res.status(200).json([]);
        }
        for (const book of allBooks) {
            if (book.lenderId !== userId) {
                const isLenderExist = await index_3.userService.getUserById(book.lenderId);
                if (isLenderExist && !isLenderExist.isBlocked) {
                    booksToShow.push(book);
                }
            }
        }
        return res.status(200).json(booksToShow);
    }
    catch (error) {
        console.log(error.message);
        return res.status(500).json({ message: "Internal server error" });
    }
};
exports.fetchBooksByGenre = fetchBooksByGenre;
const fetchBookDetails = async (req, res) => {
    try {
        const bookId = req.params.id;
        const book = await index_1.bookService.getBookById(bookId);
        if (!book) {
            return res.status(500).json({ message: "Book is not found " });
        }
        const lenderId = book.lenderId;
        const lender = await index_3.userService.getUserById(lenderId);
        return res.status(200).json({ book, lender });
    }
    catch (error) {
        console.log(error.message);
        return res.status(500).json({ message: "Internal server error" });
    }
};
exports.fetchBookDetails = fetchBookDetails;
const randomImageName = (bytes = 32) => crypto_1.default.randomBytes(bytes).toString("hex");
const createBookLend = async (req, res) => {
    try {
        const { bookTitle, description, author, publisher, publishedYear, genre, rentalFee, extraFee, quantity, street, city, district, state, pincode, maxDistance, maxDays, minDays, latitude, longitude, } = req.body;
        if (!req.userId) {
            return res
                .status(403)
                .json({ message: "User ID not found in request" });
        }
        const userId = req.userId;
        const files = req.files;
        if (!files || files.length === 0) {
            return res
                .status(404)
                .json({ message: "Please provide book images" });
        }
        const images = files.map((file) => {
            return file.location;
        });
        const bookRentData = {
            bookTitle,
            description,
            author,
            publisher,
            publishedYear,
            genre,
            images,
            rentalFee,
            extraFee,
            quantity,
            address: {
                street,
                city,
                district,
                state,
                pincode,
            },
            isRented: true,
            lenderId: userId,
            maxDistance,
            maxDays,
            minDays,
            latitude,
            longitude,
        };
        const validationError = (0, rentBookValidation_1.default)(bookRentData);
        if (validationError) {
            return res.status(400).json({ message: validationError });
        }
        const bookAdded = await index_1.bookService.getAddToBookRent(bookRentData);
        return res
            .status(200)
            .json({ message: "Book rented successfully", bookAdded });
    }
    catch (error) {
        console.error("Error renting book:", error.message);
        return res.status(500).json({ error: "Internal server error" });
    }
};
exports.createBookLend = createBookLend;
const updateLentBookDetails = async (req, res) => {
    try {
        const { bookTitle, description, author, publisher, publishedYear, genre, rentalFee, extraFee, quantity, street, city, district, state, pincode, maxDistance, maxDays, minDays, latitude, longitude, } = req.body;
        const { bookId } = req.params;
        if (!req.userId) {
            return res
                .status(403)
                .json({ message: "User ID not found in request" });
        }
        const userId = req.userId;
        let { images } = req.body;
        if (typeof images === "string") {
            images = [images];
        }
        images = images || [];
        let finalImages = [...images];
        const files = req.files;
        if (files && files.length > 0) {
            const newImages = files.map((file) => file.location);
            finalImages = [...finalImages, ...newImages];
        }
        const bookRentData = {
            bookTitle,
            description,
            author,
            publisher,
            publishedYear,
            genre,
            images: finalImages,
            rentalFee,
            extraFee,
            quantity,
            address: {
                street,
                city,
                district,
                state,
                pincode,
            },
            isRented: true,
            lenderId: userId,
            maxDistance,
            maxDays,
            minDays,
            latitude,
            longitude,
        };
        // const validationError = rentBookValidation(bookRentData);
        // if (validationError) {
        //     return res.status(400).json({ message: validationError });
        // }
        const bookAdded = await index_1.bookService.getUpdateBookRent(bookRentData, bookId);
        return res
            .status(200)
            .json({ message: "Book rented successfully", bookAdded });
    }
    catch (error) {
        console.error("Error renting book:", error.message);
        return res.status(500).json({ error: "Internal server error" });
    }
};
exports.updateLentBookDetails = updateLentBookDetails;
const fetchUserLentBooks = async (req, res) => {
    try {
        const userId = req.userId;
        const allBooks = await index_1.bookService.getAllBooks();
        const booksToShow = [];
        for (const book of allBooks) {
            if (book.lenderId == userId) {
                booksToShow.push(book);
            }
        }
        return res.status(200).json(booksToShow);
    }
    catch (error) {
        console.log("Error rentedBooks:", error);
    }
};
exports.fetchUserLentBooks = fetchUserLentBooks;
const soldBooks = async (req, res) => {
    try {
        const userId = req.userId;
        const allBooks = await index_1.bookService.getAllBooks();
        const booksToShow = [];
        for (const book of allBooks) {
            if (book.lenderId == userId && book.isSell) {
                if (book.images && Array.isArray(book.images)) {
                    const imageUrls = await Promise.all(book.images.map(async (imageKey) => {
                        const getObjectParams = {
                            Bucket: config_1.default.BUCKET_NAME,
                            Key: imageKey,
                        };
                        const command = new client_s3_1.GetObjectCommand(getObjectParams);
                        return await (0, s3_request_presigner_1.getSignedUrl)(store_1.s3Client, command, {
                            expiresIn: 3600,
                        });
                    }));
                    book.images = imageUrls;
                }
                else {
                    book.images = [];
                }
                booksToShow.push(book);
            }
        }
        return res.status(200).json(booksToShow);
    }
    catch (error) {
        console.log("Error rentedBooks:", error);
    }
};
exports.soldBooks = soldBooks;
const rentalProcess = async (req, res) => {
    try {
        const { cartId } = req.params;
        if (!cartId) {
            return res.status(500).json({ message: "cartId not found" });
        }
        const details = await index_2.cartService.getCartDetails(cartId);
        return res.status(200).json({ details });
    }
    catch (error) {
        console.log("Error userDetails:", error);
        return res
            .status(500)
            .json({ message: "Internal server error at userDetails" });
    }
};
exports.rentalProcess = rentalProcess;
const stripeKey = config_1.default.STRIPE_KEY;
const stripe = new stripe_1.default(stripeKey, { apiVersion: "2024-06-20" });
const createRentalCheckout = async (req, res) => {
    const { bookTitle, totalPrice, cartId, quantity, userId, lenderId, bookId, depositAmount, totalRentalPrice, } = req.body;
    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: [
                {
                    price_data: {
                        currency: "inr",
                        product_data: {
                            name: bookTitle,
                        },
                        unit_amount: totalPrice * 100,
                    },
                    quantity: 1,
                },
            ],
            mode: "payment",
            success_url: `${config_1.default.API}/payment/success?book_id=${bookId}&user_id=${userId}&cart_id=${cartId}&session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${config_1.default.API}/payment-cancel`,
        });
        res.json({ id: session.id });
    }
    catch (error) {
        console.error("Error createCheckout :", error);
        res.status(500).json({ error: error.message });
    }
};
exports.createRentalCheckout = createRentalCheckout;
const generateRandomCode = () => crypto_1.default.randomBytes(4).toString("hex");
const createRentalOrder = async (req, res) => {
    try {
        const { userId, bookId, cartId, sessionId } = req.body;
        if (!userId || !bookId) {
            return res
                .status(400)
                .json({ message: "user or book id is missing" });
        }
        const existOrder = await index_1.bookService.getIsOrderExist(sessionId);
        if (existOrder) {
            return res.status(200).json({ order: existOrder });
        }
        const cartData = await index_2.cartService.getCartById(cartId);
        if (!cartData) {
            console.log("cart is not found");
        }
        else {
            const pickupCode = generateRandomCode();
            const returnCode = generateRandomCode();
            const orderData = {
                sessionId,
                cartId: cartId,
                userId: typeof cartData?.userId === "string" ? cartData.userId : "",
                lenderId: typeof cartData?.ownerId === "string"
                    ? cartData.ownerId
                    : "",
                bookId: typeof cartData?.bookId === "string" ? cartData.bookId : "",
                returnCode,
                pickupCode,
            };
            const order = await index_1.bookService.getCreateOrder(orderData);
            const cart = await index_2.cartService.getUpdateIsPaid(cartId);
            const totalAmount = Number(cart?.totalAmount);
            const wallet = await index_4.walletService.getUpdateBookWallet(orderData.lenderId, totalAmount, userId);
            return res.status(200).json({ order });
        }
    }
    catch (error) {
        console.error("Error createOrder:", error);
        res.status(500).json({
            error: "An error occurred while create Order.",
        });
    }
};
exports.createRentalOrder = createRentalOrder;
const fetchRentalOrders = async (req, res) => {
    try {
        const { userId } = req.params;
        if (!userId) {
            return res.status(400).json({ message: "user is missing" });
        }
        const orders = await index_1.bookService.getRentList(userId);
        res.status(200).json({ orders });
    }
    catch (error) {
        console.error("Error createOrder:", error);
        res.status(500).json({ error: "An error occurred getting Orders." });
    }
};
exports.fetchRentalOrders = fetchRentalOrders;
const fetchLentBooks = async (req, res) => {
    try {
        const { userId } = req.params;
        if (!userId) {
            return res.status(400).json({ message: "user is missing" });
        }
        const orders = await index_1.bookService.getLendList(userId);
        res.status(200).json({ orders });
    }
    catch (error) {
        console.error("Error createOrder:", error);
        res.status(500).json({ error: "An error occurred getting Orders." });
    }
};
exports.fetchLentBooks = fetchLentBooks;
const fetchBooksBySearch = async (req, res) => {
    const { searchQuery } = req.params;
    const booksToShow = [];
    const userId = req.userId;
    try {
        const books = await index_1.bookService.getSearchResult(searchQuery);
        for (const book of books) {
            if (book.lenderId !== userId) {
                booksToShow.push(book);
            }
        }
        return res.status(200).json(booksToShow);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server Error" });
    }
};
exports.fetchBooksBySearch = fetchBooksBySearch;
const updateOrderStatusByRenter = async (req, res) => {
    try {
        const { selectedOrderId } = req.params;
        const { isBookHandover } = req.body;
        const bookStatus = isBookHandover;
        if (!selectedOrderId) {
            return res.status(400).json({ message: "Order ID is missing" });
        }
        const order = await index_1.bookService.getUpdateOrderStatusRenter(selectedOrderId, bookStatus);
        res.status(200).json({ order });
    }
    catch (error) {
        console.error("Error updating order status:", error);
        res.status(500).json({
            error: "An error occurred updating the order status.",
        });
    }
};
exports.updateOrderStatusByRenter = updateOrderStatusByRenter;
const updateOrderStatusByLender = async (req, res) => {
    try {
        const { selectedOrderId } = req.params;
        const { isBookHandover } = req.body;
        const bookStatus = isBookHandover;
        if (!selectedOrderId) {
            return res.status(400).json({ message: "Order ID is missing" });
        }
        const order = await index_1.bookService.getUpdateOrderStatusLender(selectedOrderId, bookStatus);
        res.status(200).json({ order });
    }
    catch (error) {
        console.error("Error updating order status:", error);
        res.status(500).json({
            error: "An error occurred updating the order status.",
        });
    }
};
exports.updateOrderStatusByLender = updateOrderStatusByLender;
const fetchSuccessfullRentalOrders = async (req, res) => {
    try {
        const { userId, bookId } = req.query;
        if (!userId || !bookId) {
            return res
                .status(400)
                .json({ message: "user or book id is missing" });
        }
        const order = await index_1.bookService.getOrderToShowSuccess(userId, bookId);
        res.status(200).json({ order });
    }
    catch (error) {
        console.error("Error updating order status:", error);
        res.status(500).json({
            error: "An error occurred updating the order status.",
        });
    }
};
exports.fetchSuccessfullRentalOrders = fetchSuccessfullRentalOrders;
const archiveBook = async (req, res) => {
    try {
        const { bookId } = req.body;
        const book = await index_1.bookService.getArchiveBook(bookId);
        return res.status(200).json({ book });
    }
    catch (error) {
        console.log(error.message);
        return res
            .status(400)
            .json({ message: "Internal server error at archiveBook" });
    }
};
exports.archiveBook = archiveBook;
const unArchiveBook = async (req, res) => {
    try {
        const { bookId } = req.body;
        const book = await index_1.bookService.getUnArchiveBook(bookId);
        return res.status(200).json({ book });
    }
    catch (error) {
        console.log(error.message);
        return res
            .status(400)
            .json({ message: "Internal server error at unArchiveBook" });
    }
};
exports.unArchiveBook = unArchiveBook;
const removeBook = async (req, res) => {
    try {
        const bookId = req.params.bookId;
        const remove = await index_1.bookService.getRemoveBook(bookId);
        return res.status(200).json({ remove });
    }
    catch (error) {
        console.log(error.message);
        return res
            .status(400)
            .json({ message: "Internal server error while removing book" });
    }
};
exports.removeBook = removeBook;
const updateConfirmPickupByLender = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { pickupCode } = req.body;
        if (!orderId) {
            return res.status(400).json({ message: "Order ID is missing" });
        }
        const isOrder = await index_1.bookService.getOrderById(orderId);
        if (isOrder?.pickupCode === pickupCode) {
            const order = await index_1.bookService.getConfirmPickupLender(orderId);
            res.status(200).json({ order });
        }
        else {
            return res
                .status(200)
                .json({ success: false, message: "Incorrect pickup code." });
        }
    }
    catch (error) {
        console.error("Error updating order status:", error);
        res.status(500).json({
            error: "An error occurred updating the order status.",
        });
    }
};
exports.updateConfirmPickupByLender = updateConfirmPickupByLender;
const updateConfirmReturnByRenter = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { returnCode } = req.body;
        if (!orderId) {
            return res.status(400).json({ message: "Order ID is missing" });
        }
        const isOrder = await index_1.bookService.getOrderById(orderId);
        if (isOrder?.returnCode === returnCode) {
            const order = await index_1.bookService.getConfirmReturnRenter(orderId);
            res.status(200).json({ order });
        }
        else {
            return res
                .status(200)
                .json({ success: false, message: "Incorrect pickup code." });
        }
    }
    catch (error) {
        console.error("Error updating order status:", error);
        res.status(500).json({
            error: "An error occurred updating the order status.",
        });
    }
};
exports.updateConfirmReturnByRenter = updateConfirmReturnByRenter;
const checkIsOrderExistByOrderId = async (req, res) => {
    try {
        const { orderId } = req.params;
        if (!orderId) {
            return res.status(400).json({ message: "Order ID is missing" });
        }
        const order = await index_1.bookService.getOrderById(orderId);
        return res.status(200).json({ order });
    }
    catch (error) {
        console.error("Error checkIsOrderExistByOrderId:", error);
        res.status(500).json({
            error: "An error occurred try again later.",
        });
    }
};
exports.checkIsOrderExistByOrderId = checkIsOrderExistByOrderId;
//# sourceMappingURL=bookController.js.map