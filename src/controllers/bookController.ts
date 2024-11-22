import { Request, Response } from "express";
import { GetObjectCommand, GetObjectCommandInput } from "@aws-sdk/client-s3";
import { IGenre } from "../model/genresModel";
import crypto from "crypto";
import config from "../config/config";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { Books } from "../interfaces/data";
import { books, IBooks } from "../model/bookModel";
import rentBookValidation from "../utils/ReuseFunctions/rentBookValidation";
import { AuthenticatedRequest } from "../utils/middleware/userAuthMiddleware";
import { s3Client } from "../utils/imageFunctions/store";
import Stripe from "stripe";
import { bookService } from "../services/index";
import { cartService } from "../services/index";
import { userService } from "../services/index";
import { walletService } from "../services/index";
import { message } from "../model/message";

interface CustomMulterFile extends Express.Multer.File {
    location: string;
}

const fetchGenres = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const genres: IGenre[] = await bookService.getGenres();
        return res.status(200).json(genres);
    } catch (error: any) {
        console.log(error.message);
        return res.status(500).json({ message: "Internal server error" });
    }
};
const fetchGenresWithAvailableBooks = async (
    req: AuthenticatedRequest,
    res: Response
) => {
    try {
        const userId = req.userId!;
        const genres: IGenre[] = await bookService.getGenresWithAvailableBooks(
            userId
        );
        return res.status(200).json(genres);
    } catch (error: any) {
        console.log(error.message);
        return res.status(500).json({ message: "Internal server error" });
    }
};

const fetchAvailableBooksForRent = async (
    req: AuthenticatedRequest,
    res: Response
) => {
    try {
        const {
            page = 1,
            limit = 10,
            searchQuery = "",
            genreName = "",
        } = req.query;
        const userId = req.userId!;

        const data = await bookService.getAvailableBooksForRent(
            userId,
            +page,
            +limit,
            searchQuery as string,
            genreName as string
        );

        res.status(200).json({
            books: data?.books,
            currentPage: data?.currentPage,
            totalPages: data?.totalPages,
            totalBooks: data?.totalBooks,
        });
    } catch (error: any) {
        console.error(error.message, "fetchBooks");
        return res.status(500).json({ message: "Internal server error" });
    }
};
// const fetchAvailableBooksForRent = async (
//     req: AuthenticatedRequest,
//     res: Response
// ) => {
//     try {
//         const { page = 1, limit = 10, searchQuery = "", genreName = "" } = req.query;
//         const userId = req.userId;
//         const sanitizedQuery = escapeRegExp(searchQuery as string);
//         const searchRegex = new RegExp(sanitizedQuery, "i");
//         const genreFilter = genreName ? { genre: genreName } : {};
//         const queryFilter: any = {
//             ...genreFilter,
//         };
//         if (searchQuery) {
//             queryFilter.$or = [
//                 { bookTitle: searchRegex },
//                 { author: searchRegex },
//                 { publisher: searchRegex },
//                 { genre: searchRegex },
//                 { "address.city": searchRegex },
//                 { "address.district": searchRegex },
//                 { "address.state": searchRegex },
//             ];
//         }

//         console.log("Query Filter:", JSON.stringify(queryFilter, null, 2));

//         const pageNumber = Math.max(+page, 1);
//         const limitNumber = Math.max(+limit, 1);

//         const totalBooks = await books.countDocuments(queryFilter);
//         console.log(totalBooks,'totalBooks')
//         const bookss = await books
//             .find(queryFilter)
//             .skip((pageNumber - 1) * limitNumber)
//             .limit(limitNumber);

//             console.log(bookss,'books')
//         res.status(200).json({
//             books:bookss,
//             currentPage: pageNumber,
//             totalPages: Math.ceil(totalBooks / limitNumber),
//             totalBooks,
//         });
//     } catch (error: any) {
//         console.error(error.message, "fetchBooks");
//         return res.status(500).json({ message: "Internal server error" });
//     }
// };
// const fetchAvailableBooksForRent = async (
//     req: AuthenticatedRequest,
//     res: Response
// ): Promise<Response> => {
//     try {
//         const userId = req.userId;
//         const books: IBooks[] = await bookService.getAvailableBooksForRent(
//             userId!
//         );
//         return res.status(200).json(books);
//     } catch (error: any) {
//         console.log(error.message, "fetchBooks");
//         return res.status(500).json({ message: "Internal server error" });
//     }
// };

const fetchBooksByGenre = async (
    req: AuthenticatedRequest,
    res: Response
): Promise<Response> => {
    try {
        const userId = req.userId;
        const genreName = req.params.genreName?.toString();
        const allBooks: IBooks[] | null =
            await bookService.getGenreMatchedBooks(genreName);
        const booksToShow: IBooks[] = [];
        if (!allBooks) {
            return res.status(200).json([]);
        }
        for (const book of allBooks) {
            if (book.lenderId !== userId) {
                const isLenderExist = await userService.getUserById(
                    book.lenderId
                );

                if (isLenderExist && !isLenderExist.isBlocked) {
                    booksToShow.push(book);
                }
            }
        }
        return res.status(200).json(booksToShow);
    } catch (error: any) {
        console.log(error.message);
        return res.status(500).json({ message: "Internal server error" });
    }
};

const fetchBookDetails = async (req: Request, res: Response) => {
    try {
        const bookId = req.params.id as string;
        const book: IBooks | null = await bookService.getBookById(bookId);

        if (!book) {
            return res.status(500).json({ message: "Book is not found " });
        }
        const lenderId: string = book.lenderId;
        const lender = await userService.getUserById(lenderId);
        return res.status(200).json({ book, lender });
    } catch (error: any) {
        console.log(error.message);
        return res.status(500).json({ message: "Internal server error" });
    }
};
const randomImageName = (bytes = 32) =>
    crypto.randomBytes(bytes).toString("hex");

const createBookLend = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const {
            bookTitle,
            description,
            author,
            publisher,
            publishedYear,
            genre,
            rentalFee,
            extraFee,
            quantity,
            street,
            city,
            district,
            state,
            pincode,
            maxDistance,
            maxDays,
            minDays,
            latitude,
            longitude,
        } = req.body;

        if (!req.userId) {
            return res
                .status(403)
                .json({ message: "User ID not found in request" });
        }
        const userId = req.userId;

        const files = req.files as CustomMulterFile[];
        if (!files || files.length === 0) {
            return res
                .status(404)
                .json({ message: "Please provide book images" });
        }

        const images = files.map((file) => {
            return file.location;
        });

        const bookRentData: Books = {
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

        const validationError = rentBookValidation(bookRentData);
        if (validationError) {
            return res.status(400).json({ message: validationError });
        }

        const bookAdded = await bookService.getAddToBookRent(bookRentData);
        return res
            .status(200)
            .json({ message: "Book rented successfully", bookAdded });
    } catch (error: any) {
        console.error("Error renting book:", error.message);
        return res.status(500).json({ error: "Internal server error" });
    }
};

const updateLentBookDetails = async (
    req: AuthenticatedRequest,
    res: Response
) => {
    try {
        const {
            bookTitle,
            description,
            author,
            publisher,
            publishedYear,
            genre,
            rentalFee,
            extraFee,
            quantity,
            street,
            city,
            district,
            state,
            pincode,
            maxDistance,
            maxDays,
            minDays,
            latitude,
            longitude,
        } = req.body;
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

        let finalImages: string[] = [...images];

        const files = req.files as CustomMulterFile[];
        if (files && files.length > 0) {
            const newImages = files.map((file) => file.location);
            finalImages = [...finalImages, ...newImages];
        }

        const bookRentData: Books = {
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

        const bookAdded = await bookService.getUpdateBookRent(
            bookRentData,
            bookId
        );
        return res
            .status(200)
            .json({ message: "Book rented successfully", bookAdded });
    } catch (error: any) {
        console.error("Error renting book:", error.message);
        return res.status(500).json({ error: "Internal server error" });
    }
};

const fetchUserLentBooks = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const userId = req.userId;
        const allBooks: IBooks[] = await bookService.getAllBooks();
        const booksToShow: IBooks[] = [];

        for (const book of allBooks) {
            if (book.lenderId == userId) {
                booksToShow.push(book);
            }
        }

        return res.status(200).json(booksToShow);
    } catch (error: any) {
        console.log("Error rentedBooks:", error);
    }
};
const soldBooks = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const userId = req.userId;
        const allBooks: IBooks[] = await bookService.getAllBooks();
        const booksToShow: IBooks[] = [];

        for (const book of allBooks) {
            if (book.lenderId == userId && book.isSell) {
                if (book.images && Array.isArray(book.images)) {
                    const imageUrls = await Promise.all(
                        book.images.map(async (imageKey: string) => {
                            const getObjectParams: GetObjectCommandInput = {
                                Bucket: config.BUCKET_NAME,
                                Key: imageKey,
                            };
                            const command = new GetObjectCommand(
                                getObjectParams
                            );
                            return await getSignedUrl(s3Client, command, {
                                expiresIn: 3600,
                            });
                        })
                    );
                    book.images = imageUrls;
                } else {
                    book.images = [];
                }
                booksToShow.push(book);
            }
        }
        return res.status(200).json(booksToShow);
    } catch (error: any) {
        console.log("Error rentedBooks:", error);
    }
};

const rentalProcess = async (req: Request, res: Response) => {
    try {
        const { cartId } = req.params;
        if (!cartId) {
            return res.status(500).json({ message: "cartId not found" });
        }
        const details = await cartService.getCartDetails(cartId);
        return res.status(200).json({ details });
    } catch (error: any) {
        console.log("Error userDetails:", error);
        return res
            .status(500)
            .json({ message: "Internal server error at userDetails" });
    }
};
const stripeKey = config.STRIPE_KEY!;
const stripe = new Stripe(stripeKey, { apiVersion: "2024-06-20" });

const createRentalCheckout = async (req: Request, res: Response) => {
    const {
        bookTitle,
        totalPrice,
        cartId,
        quantity,
        userId,
        lenderId,
        bookId,
        depositAmount,
        totalRentalPrice,
    } = req.body;

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
            success_url: `${config.API}/payment/success?book_id=${bookId}&user_id=${userId}&cart_id=${cartId}&session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${config.API}/payment-cancel`,
        });

        res.json({ id: session.id });
    } catch (error: any) {
        console.error("Error createCheckout :", error);

        res.status(500).json({ error: error.message });
    }
};
const generateRandomCode = () => crypto.randomBytes(4).toString("hex");
const createRentalOrder = async (req: Request, res: Response) => {
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
        } else {
            const pickupCode = generateRandomCode();
            const returnCode = generateRandomCode();
            const orderData = {
                sessionId,
                cartId: cartId,
                userId:
                    typeof cartData?.userId === "string" ? cartData.userId : "",
                lenderId:
                    typeof cartData?.ownerId === "string"
                        ? cartData.ownerId
                        : "",
                bookId:
                    typeof cartData?.bookId === "string" ? cartData.bookId : "",
                returnCode,
                pickupCode,
            };

            const order = await bookService.getCreateOrder(orderData);
            const cart = await cartService.getUpdateIsPaid(cartId);
            const totalAmount = Number(cart?.totalAmount);

            const wallet = await walletService.getUpdateBookWallet(
                orderData.lenderId,
                totalAmount,
                userId
            );
            return res.status(200).json({ order });
        }
    } catch (error) {
        console.error("Error createOrder:", error);
        res.status(500).json({
            error: "An error occurred while create Order.",
        });
    }
};
const fetchRentalOrders = async (req: Request, res: Response) => {
    try {
        const { userId } = req.params;

        if (!userId) {
            return res.status(400).json({ message: "user is missing" });
        }

        const orders = await bookService.getRentList(userId);

        res.status(200).json({ orders });
    } catch (error) {
        console.error("Error createOrder:", error);
        res.status(500).json({ error: "An error occurred getting Orders." });
    }
};

const fetchLentBooks = async (req: Request, res: Response) => {
    try {
        const { userId } = req.params;
        if (!userId) {
            return res.status(400).json({ message: "user is missing" });
        }
        const orders = await bookService.getLendList(userId);
        res.status(200).json({ orders });
    } catch (error) {
        console.error("Error createOrder:", error);
        res.status(500).json({ error: "An error occurred getting Orders." });
    }
};
const fetchBooksBySearch = async (req: AuthenticatedRequest, res: Response) => {
    const { searchQuery } = req.params;
    const booksToShow: IBooks[] = [];
    const userId = req.userId;
    try {
        const books = await bookService.getSearchResult(searchQuery);
        for (const book of books) {
            if (book.lenderId !== userId) {
                booksToShow.push(book);
            }
        }
        return res.status(200).json(booksToShow);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server Error" });
    }
};

const updateOrderStatusByRenter = async (req: Request, res: Response) => {
    try {
        const { selectedOrderId } = req.params;
        const { isBookHandover } = req.body;

        const bookStatus = isBookHandover;
        if (!selectedOrderId) {
            return res.status(400).json({ message: "Order ID is missing" });
        }
        const order = await bookService.getUpdateOrderStatusRenter(
            selectedOrderId,
            bookStatus
        );

        res.status(200).json({ order });
    } catch (error) {
        console.error("Error updating order status:", error);
        res.status(500).json({
            error: "An error occurred updating the order status.",
        });
    }
};

const updateOrderStatusByLender = async (req: Request, res: Response) => {
    try {
        const { selectedOrderId } = req.params;
        const { isBookHandover } = req.body;
        const bookStatus = isBookHandover;
        if (!selectedOrderId) {
            return res.status(400).json({ message: "Order ID is missing" });
        }
        const order = await bookService.getUpdateOrderStatusLender(
            selectedOrderId,
            bookStatus
        );

        res.status(200).json({ order });
    } catch (error) {
        console.error("Error updating order status:", error);
        res.status(500).json({
            error: "An error occurred updating the order status.",
        });
    }
};

const fetchSuccessfullRentalOrders = async (req: Request, res: Response) => {
    try {
        const { userId, bookId } = req.query;
        if (!userId || !bookId) {
            return res
                .status(400)
                .json({ message: "user or book id is missing" });
        }

        const order = await bookService.getOrderToShowSuccess(
            userId as string,
            bookId as string
        );
        res.status(200).json({ order });
    } catch (error) {
        console.error("Error updating order status:", error);
        res.status(500).json({
            error: "An error occurred updating the order status.",
        });
    }
};

const archiveBook = async (req: Request, res: Response) => {
    try {
        const { bookId } = req.body;
        const book: IBooks | null = await bookService.getArchiveBook(bookId);
        return res.status(200).json({ book });
    } catch (error: any) {
        console.log(error.message);
        return res
            .status(400)
            .json({ message: "Internal server error at archiveBook" });
    }
};

const unArchiveBook = async (req: Request, res: Response) => {
    try {
        const { bookId } = req.body;

        const book: IBooks | null = await bookService.getUnArchiveBook(bookId);
        return res.status(200).json({ book });
    } catch (error: any) {
        console.log(error.message);
        return res
            .status(400)
            .json({ message: "Internal server error at unArchiveBook" });
    }
};

const removeBook = async (req: Request, res: Response) => {
    try {
        const bookId = req.params.bookId;
        const remove = await bookService.getRemoveBook(bookId);
        return res.status(200).json({ remove });
    } catch (error: any) {
        console.log(error.message);
        return res
            .status(400)
            .json({ message: "Internal server error while removing book" });
    }
};

const updateConfirmPickupByLender = async (req: Request, res: Response) => {
    try {
        const { orderId } = req.params;
        const { pickupCode } = req.body;
        if (!orderId) {
            return res.status(400).json({ message: "Order ID is missing" });
        }
        const isOrder = await bookService.getOrderById(orderId);
        if (isOrder?.pickupCode === pickupCode) {
            const order = await bookService.getConfirmPickupLender(orderId);
            res.status(200).json({ order });
        } else {
            return res
                .status(200)
                .json({ success: false, message: "Incorrect pickup code." });
        }
    } catch (error) {
        console.error("Error updating order status:", error);
        res.status(500).json({
            error: "An error occurred updating the order status.",
        });
    }
};

const updateConfirmReturnByRenter = async (req: Request, res: Response) => {
    try {
        const { orderId } = req.params;
        const { returnCode } = req.body;
        if (!orderId) {
            return res.status(400).json({ message: "Order ID is missing" });
        }
        const isOrder = await bookService.getOrderById(orderId);
        if (isOrder?.returnCode === returnCode) {
            const order = await bookService.getConfirmReturnRenter(orderId);
            res.status(200).json({ order });
        } else {
            return res
                .status(200)
                .json({ success: false, message: "Incorrect pickup code." });
        }
    } catch (error) {
        console.error("Error updating order status:", error);
        res.status(500).json({
            error: "An error occurred updating the order status.",
        });
    }
};

const checkIsOrderExistByOrderId = async (req: Request, res: Response) => {
    try {
        const { orderId } = req.params;
        if (!orderId) {
            return res.status(400).json({ message: "Order ID is missing" });
        }
        const order = await bookService.getOrderById(orderId);

        return res.status(200).json({ order });
    } catch (error) {
        console.error("Error checkIsOrderExistByOrderId:", error);
        res.status(500).json({
            error: "An error occurred try again later.",
        });
    }
};

export {
    fetchGenres,
    fetchAvailableBooksForRent,
    fetchGenresWithAvailableBooks,
    fetchBookDetails,
    createBookLend,
    updateLentBookDetails,
    fetchUserLentBooks,
    soldBooks,
    rentalProcess,
    createRentalCheckout,
    createRentalOrder,
    fetchRentalOrders,
    fetchLentBooks,
    fetchBooksBySearch,
    fetchSuccessfullRentalOrders,
    updateOrderStatusByRenter,
    updateOrderStatusByLender,
    fetchBooksByGenre,
    archiveBook,
    unArchiveBook,
    removeBook,
    updateConfirmPickupByLender,
    updateConfirmReturnByRenter,
    checkIsOrderExistByOrderId,
};
