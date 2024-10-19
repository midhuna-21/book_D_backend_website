"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.genreMatchedBooks = exports.updateOrderStatusLender = exports.updateOrderStatusRenter = exports.OrderToShowSuccess = exports.search = exports.lendList = exports.rentList = exports.orders = exports.createOrder = exports.createCheckout = exports.lendingProcess = exports.soldBooks = exports.rentedBooks = exports.sellBook = exports.rentBookUpdate = exports.rentBook = exports.bookDetail = exports.genres = exports.exploreBooks = exports.genresOfBooks = void 0;
const client_s3_1 = require("@aws-sdk/client-s3");
const sharp_1 = __importDefault(require("sharp"));
const crypto_1 = __importDefault(require("crypto"));
const config_1 = __importDefault(require("../config/config"));
const s3_request_presigner_1 = require("@aws-sdk/s3-request-presigner");
const rentBookValidation_1 = __importDefault(require("../utils/ReuseFunctions/rentBookValidation"));
const sellBookValidation_1 = __importDefault(require("../utils/ReuseFunctions/sellBookValidation"));
const store_1 = require("../utils/imageFunctions/store");
const stripe_1 = __importDefault(require("stripe"));
const bookService_1 = require("../services/bookService");
const cartService_1 = require("../services/cartService");
const userService_1 = require("../services/userService");
const walletService_1 = require("../services/walletService");
const bookService = new bookService_1.BookService();
const cartService = new cartService_1.CartService();
const userService = new userService_1.UserService();
const walletService = new walletService_1.WalletService();
const genresOfBooks = async (req, res) => {
    try {
        const genres = await bookService.getGenres();
        return res.status(200).json(genres);
    }
    catch (error) {
        console.log(error.message);
        return res.status(500).json({ message: "Internal server error" });
    }
};
exports.genresOfBooks = genresOfBooks;
const genres = async (req, res) => {
    try {
        const userId = req.userId;
        const genres = await bookService.getAllGenres(userId);
        return res.status(200).json(genres);
    }
    catch (error) {
        console.log(error.message);
        return res.status(500).json({ message: "Internal server error" });
    }
};
exports.genres = genres;
const exploreBooks = async (req, res) => {
    try {
        const userId = req.userId;
        const allBooks = await bookService.getAllBooks();
        const booksToShow = [];
        for (const book of allBooks) {
            if (book.lenderId !== userId) {
                const isLenderExist = await userService.getUserById(book.lenderId);
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
exports.exploreBooks = exploreBooks;
const genreMatchedBooks = async (req, res) => {
    try {
        const userId = req.userId;
        const genreName = req.params.genreName?.toString();
        const allBooks = await bookService.getGenreMatchedBooks(genreName);
        const booksToShow = [];
        if (!allBooks) {
            return res.status(200).json([]);
        }
        for (const book of allBooks) {
            if (book.lenderId !== userId) {
                const isLenderExist = await userService.getUserById(book.lenderId);
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
exports.genreMatchedBooks = genreMatchedBooks;
const bookDetail = async (req, res) => {
    try {
        const bookId = req.params.Id;
        const book = await bookService.getBookById(bookId);
        if (!book) {
            return res.status(500).json({ message: "Book is not found " });
        }
        const lenderId = book.lenderId;
        const lender = await userService.getUserById(lenderId);
        return res.status(200).json({ book, lender });
    }
    catch (error) {
        console.log(error.message);
        return res.status(500).json({ message: "Internal server error" });
    }
};
exports.bookDetail = bookDetail;
const randomImageName = (bytes = 32) => crypto_1.default.randomBytes(bytes).toString("hex");
const rentBook = async (req, res) => {
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
        const bookAdded = await bookService.getAddToBookRent(bookRentData);
        return res
            .status(200)
            .json({ message: "Book rented successfully", bookAdded });
    }
    catch (error) {
        console.error("Error renting book:", error.message);
        return res.status(500).json({ error: "Internal server error" });
    }
};
exports.rentBook = rentBook;
const rentBookUpdate = async (req, res) => {
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
        const validationError = (0, rentBookValidation_1.default)(bookRentData);
        if (validationError) {
            return res.status(400).json({ message: validationError });
        }
        const bookAdded = await bookService.getUpdateBookRent(bookRentData, bookId);
        return res
            .status(200)
            .json({ message: "Book rented successfully", bookAdded });
    }
    catch (error) {
        console.error("Error renting book:", error.message);
        return res.status(500).json({ error: "Internal server error" });
    }
};
exports.rentBookUpdate = rentBookUpdate;
const sellBook = async (req, res) => {
    try {
        const { bookTitle, description, author, publisher, publishedYear, genre, price, quantity, street, city, district, state, pincode, latitude, longitude, } = req.body;
        if (!req.userId) {
            return res
                .status(403)
                .json({ message: "User ID not found in request" });
        }
        const userId = req.userId;
        const images = req.files;
        if (!images || images.length === 0) {
            return res
                .status(404)
                .json({ message: "Please provide book images" });
        }
        const bookImages = [];
        for (let i = 0; i < images.length; i++) {
            const buffer = await (0, sharp_1.default)(images[i].buffer)
                .resize({ height: 1920, width: 1080, fit: "contain" })
                .toBuffer();
            const image = randomImageName();
            const params = {
                Bucket: "bookstore-web-app",
                Key: image,
                Body: buffer,
                ContentType: images[i].mimetype,
            };
            const command = new client_s3_1.PutObjectCommand(params);
            try {
                await store_1.s3Client.send(command);
                bookImages.push(image);
            }
            catch (error) {
                console.error(error);
                return res
                    .status(404)
                    .json({ message: `Failed to upload image ${i}` });
            }
        }
        const bookSelldata = {
            bookTitle,
            description,
            author,
            publisher,
            publishedYear,
            genre,
            images: bookImages,
            price,
            quantity,
            address: {
                street,
                city,
                state,
                district,
                pincode,
            },
            lenderId: userId,
            latitude,
            longitude,
        };
        const validationError = (0, sellBookValidation_1.default)(bookSelldata);
        if (validationError) {
            return res.status(400).json({ message: validationError });
        }
        await bookService.getAddToBookSell(bookSelldata);
        return res
            .status(200)
            .json({ message: "Book sold successfully", bookSelldata });
    }
    catch (error) {
        console.error("Error renting book:", error.message);
        return res.status(404).json({ error: "Internal server error" });
    }
};
exports.sellBook = sellBook;
const rentedBooks = async (req, res) => {
    try {
        const userId = req.userId;
        const allBooks = await bookService.getAllBooks();
        const booksToShow = [];
        for (const book of allBooks) {
            if (book.lenderId == userId && book.isRented) {
                booksToShow.push(book);
            }
        }
        return res.status(200).json(booksToShow);
    }
    catch (error) {
        console.log("Error rentedBooks:", error);
    }
};
exports.rentedBooks = rentedBooks;
const soldBooks = async (req, res) => {
    try {
        const userId = req.userId;
        const allBooks = await bookService.getAllBooks();
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
const lendingProcess = async (req, res) => {
    try {
        const { cartId } = req.params;
        if (!cartId) {
            return res.status(500).json({ message: "cartId not found" });
        }
        const details = await cartService.getCartDetails(cartId);
        return res.status(200).json({ details });
    }
    catch (error) {
        console.log("Error userDetails:", error);
        return res
            .status(500)
            .json({ message: "Internal server error at userDetails" });
    }
};
exports.lendingProcess = lendingProcess;
const stripeKey = config_1.default.STRIPE_KEY;
const stripe = new stripe_1.default(stripeKey, { apiVersion: "2024-06-20" });
const createCheckout = async (req, res) => {
    const { bookTitle, totalPrice, cartId, quantity, userId, lenderId, bookId, depositAmount, totalRentalPrice, } = req.body;
    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: [
                {
                    price_data: {
                        currency: "usd",
                        product_data: {
                            name: bookTitle,
                        },
                        unit_amount: totalPrice * 100,
                    },
                    quantity: 1,
                },
            ],
            mode: "payment",
            success_url: `${config_1.default.API}/home/payment-success?book_id=${bookId}&user_id=${userId}&cart_id=${cartId}&session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${config_1.default.API}/payment-cancel`,
        });
        res.json({ id: session.id });
    }
    catch (error) {
        console.error("Error createCheckout :", error);
        res.status(500).json({ error: error.message });
    }
};
exports.createCheckout = createCheckout;
const createOrder = async (req, res) => {
    try {
        const { userId, bookId, cartId, sessionId } = req.body;
        if (!userId || !bookId) {
            return res
                .status(400)
                .json({ message: "user or book id is missing" });
        }
        const existOrder = await bookService.getIsOrderExist(sessionId);
        if (existOrder) {
            return res.status(200).json({ order: existOrder });
        }
        const cartData = await cartService.getCartById(cartId);
        if (!cartData) {
            console.log("cart is not found");
        }
        else {
            const orderData = {
                sessionId,
                cartId: cartId,
                userId: typeof cartData?.userId === "string" ? cartData.userId : "",
                lenderId: typeof cartData?.ownerId === "string"
                    ? cartData.ownerId
                    : "",
                bookId: typeof cartData?.bookId === "string" ? cartData.bookId : "",
            };
            const order = await bookService.getCreateOrder(orderData);
            const cart = await cartService.getUpdateIsPaid(cartId);
            const selectedQuantity = cart?.quantity;
            const book = await bookService.getBookById(bookId);
            if (book && book.quantity > 0) {
                const updatedQuantity = book.quantity - selectedQuantity;
                if (updatedQuantity < 0) {
                    return res
                        .status(400)
                        .json({ message: "Book is out of stock" });
                }
                await bookService.getUpdateBookQuantity(bookId, updatedQuantity);
            }
            else {
                return res
                    .status(404)
                    .json({ message: "Book not found or out of stock" });
            }
            const totalAmount = Number(cart?.totalAmount);
            await walletService.updateBookWallet(orderData.lenderId, totalAmount, userId);
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
exports.createOrder = createOrder;
const orders = async (req, res) => {
    try {
        const { userId } = req.params;
        if (!userId) {
            return res.status(400).json({ message: "user is missing" });
        }
        const orders = await bookService.getOrders(userId);
        res.status(200).json({ orders });
    }
    catch (error) {
        console.error("Error createOrder:", error);
        res.status(500).json({ error: "An error occurred getting Orders." });
    }
};
exports.orders = orders;
const rentList = async (req, res) => {
    try {
        const { userId } = req.params;
        if (!userId) {
            return res.status(400).json({ message: "user is missing" });
        }
        const orders = await bookService.getRentList(userId);
        res.status(200).json({ orders });
    }
    catch (error) {
        console.error("Error createOrder:", error);
        res.status(500).json({ error: "An error occurred getting Orders." });
    }
};
exports.rentList = rentList;
const lendList = async (req, res) => {
    try {
        const { userId } = req.params;
        if (!userId) {
            return res.status(400).json({ message: "user is missing" });
        }
        const orders = await bookService.getLendList(userId);
        res.status(200).json({ orders });
    }
    catch (error) {
        console.error("Error createOrder:", error);
        res.status(500).json({ error: "An error occurred getting Orders." });
    }
};
exports.lendList = lendList;
const search = async (req, res) => {
    const { searchQuery } = req.params;
    const booksToShow = [];
    const userId = req.userId;
    try {
        const books = await bookService.getSearchResult(searchQuery);
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
exports.search = search;
const updateOrderStatusRenter = async (req, res) => {
    try {
        const { selectedOrderId } = req.params;
        const { isBookHandover } = req.body;
        const bookStatus = isBookHandover;
        if (!selectedOrderId) {
            return res.status(400).json({ message: "Order ID is missing" });
        }
        const order = await bookService.getUpdateOrderStatusRenter(selectedOrderId, bookStatus);
        res.status(200).json({ order });
    }
    catch (error) {
        console.error("Error updating order status:", error);
        res.status(500).json({
            error: "An error occurred updating the order status.",
        });
    }
};
exports.updateOrderStatusRenter = updateOrderStatusRenter;
const updateOrderStatusLender = async (req, res) => {
    try {
        const { selectedOrderId } = req.params;
        const { isBookHandover } = req.body;
        const bookStatus = isBookHandover;
        if (!selectedOrderId) {
            return res.status(400).json({ message: "Order ID is missing" });
        }
        const order = await bookService.getUpdateOrderStatusLender(selectedOrderId, bookStatus);
        res.status(200).json({ order });
    }
    catch (error) {
        console.error("Error updating order status:", error);
        res.status(500).json({
            error: "An error occurred updating the order status.",
        });
    }
};
exports.updateOrderStatusLender = updateOrderStatusLender;
const OrderToShowSuccess = async (req, res) => {
    try {
        const { userId, bookId } = req.query;
        if (!userId || !bookId) {
            return res
                .status(400)
                .json({ message: "user or book id is missing" });
        }
        const order = await bookService.getOrderToShowSuccess(userId, bookId);
        res.status(200).json({ order });
    }
    catch (error) {
        console.error("Error updating order status:", error);
        res.status(500).json({
            error: "An error occurred updating the order status.",
        });
    }
};
exports.OrderToShowSuccess = OrderToShowSuccess;
//# sourceMappingURL=bookController.js.map