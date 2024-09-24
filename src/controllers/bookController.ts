import { Request, Response } from "express";
import {
    GetObjectCommand,
    GetObjectCommandInput,
    PutObjectCommand,
} from "@aws-sdk/client-s3";
import { IGenre } from "../model/genresModel";
import sharp from "sharp";
import crypto from "crypto";
import config from "../config/config";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { Books } from "../interfaces/data";
import { IBooks } from "../model/bookModel";
import rentBookValidation from "../utils/ReuseFunctions/rentBookValidation";
import sellBookValidation from "../utils/ReuseFunctions/sellBookValidation";
import { AuthenticatedRequest } from "../utils/middleware/authMiddleware";
import { s3Client } from "../utils/imageFunctions/store";
import Stripe from "stripe";
import { BookService } from "../services/bookService";
import { CartService } from "../services/cartService";
import { UserService } from "../services/userService";
import { WalletService } from "../services/walletService";

const bookService = new BookService();
const cartService = new CartService();
const userService = new UserService();
const walletService = new WalletService();

interface CustomMulterFile extends Express.Multer.File {
    location: string;
}

const genresOfBooks = async (req: Request, res: Response) => {
    try {
        const genres: IGenre[] = await bookService.getAllGenres();
        for (const genre of genres) {
            if (genre.image) {
                const getObjectParams = {
                    Bucket: config.BUCKET_NAME,
                    Key: genre.image,
                };

                const command = new GetObjectCommand(getObjectParams);
                const url = await getSignedUrl(s3Client, command, {
                    expiresIn: 3600,
                });
                genre.image = url;
            } else {
                genre.image = " ";
            }
        }

        return res.status(200).json(genres);
    } catch (error: any) {
        console.log(error.message);
        return res.status(500).json({ message: "Internal server error" });
    }
};
const genres = async (req: Request, res: Response): Promise<Response> => {
    try {
        const genres: IGenre[] = await bookService.getAllGenres();

        for (const genre of genres) {
            if (genre.image && typeof genre.image === "string") {
                const getObjectParams: GetObjectCommandInput = {
                    Bucket: config.BUCKET_NAME,
                    Key: genre.image,
                };
                const command = new GetObjectCommand(getObjectParams);
                const imageUrl = await getSignedUrl(s3Client, command, {
                    expiresIn: 3600,
                });
                genre.image = imageUrl;
            } else {
                genre.image = "";
            }
        }

        return res.status(200).json(genres);
    } catch (error: any) {
        console.log(error.message);
        return res.status(500).json({ message: "Internal server error" });
    }
};

const exploreBooks = async (
    req: AuthenticatedRequest,
    res: Response
): Promise<Response> => {
    try {
        const userId = req.userId;

        const allBooks: IBooks[] = await bookService.getAllBooks();
        const booksToShow: IBooks[] = [];

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

const bookDetail = async (req: Request, res: Response) => {
    try {
        const bookId = req.params.Id as string;
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

const rentBook = async (req: AuthenticatedRequest, res: Response) => {
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

const rentBookUpdate = async (req: AuthenticatedRequest, res: Response) => {
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

        console.log(finalImages, "finalImages after");

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

        const validationError = rentBookValidation(bookRentData);
        if (validationError) {
            return res.status(400).json({ message: validationError });
        }

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

const sellBook = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const {
            bookTitle,
            description,
            author,
            publisher,
            publishedYear,
            genre,
            price,
            quantity,
            street,
            city,
            district,
            state,
            pincode,
            latitude,
            longitude,
        } = req.body;

        if (!req.userId) {
            return res
                .status(403)
                .json({ message: "User ID not found in request" });
        }
        const userId = req.userId;

        const images = req.files as Express.Multer.File[];

        if (!images || images.length === 0) {
            return res
                .status(404)
                .json({ message: "Please provide book images" });
        }

        const bookImages: string[] = [];
        for (let i = 0; i < images.length; i++) {
            const buffer = await sharp(images[i].buffer)
                .resize({ height: 1920, width: 1080, fit: "contain" })
                .toBuffer();

            const image = randomImageName();

            const params = {
                Bucket: "bookstore-web-app",
                Key: image,
                Body: buffer,
                ContentType: images[i].mimetype,
            };

            const command = new PutObjectCommand(params);

            try {
                await s3Client.send(command);
                bookImages.push(image);
            } catch (error: any) {
                console.error(error);
                return res
                    .status(404)
                    .json({ message: `Failed to upload image ${i}` });
            }
        }
        const bookSelldata: Books = {
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
        const validationError = sellBookValidation(bookSelldata);
        if (validationError) {
            return res.status(400).json({ message: validationError });
        }
        await bookService.getAddToBookSell(bookSelldata);
        return res
            .status(200)
            .json({ message: "Book sold successfully", bookSelldata });
    } catch (error: any) {
        console.error("Error renting book:", error.message);
        return res.status(404).json({ error: "Internal server error" });
    }
};

const rentedBooks = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const userId = req.userId;
        const allBooks: IBooks[] = await bookService.getAllBooks();
        const booksToShow: IBooks[] = [];

        for (const book of allBooks) {
            if (book.lenderId == userId && book.isRented) {
                // const isLenderExist = await bookService.getUserById(book.lenderId);
                // if(isLenderExist && !isLenderExist.isBlocked ){

                booksToShow.push(book);
            }
            // }
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

const lenderDetails = async (req: Request, res: Response) => {
    try {
        // const bookId = req.params.Id as string;
        // const book: IBooks | null = await bookService.getBookById(bookId);

        // if (!book) {
        //     return res.status(500).json({ message: "Book is not found " });
        // }
        // const lenderId: string = book.lenderId;
        // const lender = await bookService.getUserById(lenderId);

        return res.status(200).json({});
    } catch (error: any) {
        console.log(error.message);
        return res.status(500).json({ message: "Internal server error" });
    }
};
const lendingProcess = async (req: Request, res: Response) => {
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

const createCheckout = async (req: Request, res: Response) => {
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
                        currency: "usd",
                        product_data: {
                            name: bookTitle,
                        },
                        unit_amount: totalPrice * 100,
                    },
                    quantity: quantity,
                },
            ],
            mode: "payment",
            success_url: `${config.API}/home/payment-success?book_id=${bookId}&user_id=${userId}&cart_id=${cartId}`,
            cancel_url: `${config.API}/payment-cancel`,
            
        });
        
        res.json({ id: session.id  });

        //    const sessionData = {
        //     cartId,
        //      sessionId:session.id,
        //      userId,
        //      lenderId,
        //      bookId,
        //      totalPrice,
        //      quantity,
        //      depositAmount,
        //      totalRentalPrice,
        //    };

        //    const order = await bookService.getCreateOrder(sessionData);
        //    console.log(order,'orderee')
        //    const cart = await cartService.getUpdateIsPaid(cartId)
        //    console.log(cart,'carttt')
        //    const wallet = await walletService.getCreateWalletForWebsite(cartId)
        //    console.log(wallet,'walllettt')
        //    const cart = await cartService.getUpdateIsPaid(cartId)

        //    const dataWallet ={
        //     userId,
        //     lenderId,
        //     total_amount:totalPrice,
        //     rental_amount:totalRentalPrice,
        //     deposit_amount:depositAmount,
        //    }
        //    const wallet = await walletService.getCreateWalletForWebsite(dataWallet)
    } catch (error: any) {
        console.error("Error createCheckout :", error);

        res.status(500).json({ error: error.message });
    }
};
// const createCheckout = async (req:Request,res:Response) => {
//     const { bookTitle, totalPrice,cartId, quantity, userId, lenderId, bookId, depositAmount,totalRentalPrice } = req.body;

//     try {
//       const session = await stripe.checkout.sessions.create({
//         payment_method_types: ["card"],
//         line_items: [
//           {
//             price_data: {
//               currency: "usd",
//               product_data: {
//                 name: bookTitle,
//               },
//               unit_amount: totalPrice * 100,
//             },
//             quantity: quantity,
//           },
//         ],
//         mode: "payment",
//         success_url: `${config.API}/home/payment-success?book_id=${bookId}&user_id=${userId}&cart_id=${cartId}`,
//         cancel_url: `${config.API}/payment-cancel`,
//       });

//       res.json({ id: session.id });
//     } catch (error:any) {
//       res.status(500).json({ error: error.message });
//     }
//   };

const createOrder = async (req: Request, res: Response) => {
    try {
        const { userId, bookId, cartId } = req.body;
console.log(userId,'userid',bookId,'bookdi',cartId,'cartid')
        if (!userId || !bookId) {
            return res
                .status(400)
                .json({ message: "user or book id is missing" });
        }

        const cartData = await cartService.getCartById(cartId);
        if (!cartData) {
            console.log("cart is not found");
        } else {
            const orderData = {
                cartId: cartId,
                userId:
                    typeof cartData?.userId === "string" ? cartData.userId : "",
                lenderId:
                    typeof cartData?.ownerId === "string"
                        ? cartData.ownerId
                        : "",
                bookId:
                    typeof cartData?.bookId === "string" ? cartData.bookId : "",
            };

            const order = await bookService.getCreateOrder(orderData);
            const cart = await cartService.getUpdateIsPaid(cartId);
            const wallet = await walletService.getCreateWalletForWebsite(cartId)
            res.status(200).json({ order });
        }

        //    console.log(order,'orderee')

        //  const order = await bookService.getUpdateOrder(userId,bookId)
        //  const cart = await cartService.getUpdateIsPaid(cartId)

        //    const dataWallet ={
        //     cartId,
        //     total_amount:totalPrice,
        //     rental_amount:totalRentalPrice,
        //     deposit_amount:depositAmount,
        //    }
        //    const wallet = await walletService.getCreateWalletForWebsite(cartId)
        //  res.status(200).json({order});
    } catch (error) {
        console.error("Error createOrder:", error);
        res.status(500).json({
            error: "An error occurred while create Order.",
        });
    }
};

const orders = async (req: Request, res: Response) => {
    try {
        const { userId } = req.params;

        if (!userId) {
            return res.status(400).json({ message: "user is missing" });
        }

        const orders = await bookService.getOrders(userId);
        res.status(200).json({ orders });
    } catch (error) {
        console.error("Error createOrder:", error);
        res.status(500).json({ error: "An error occurred getting Orders." });
    }
};

const search = async (req: AuthenticatedRequest, res: Response) => {
    const { searchQuery } = req.params;
    const booksToShow: IBooks[] = [];
    const userId = req.userId;
    try {
        const books = await bookService.getSearchResult(searchQuery);
        for (const book of books) {
            if (book.lenderId !== userId) {
                // const isLenderExist = await bookService.getUserById(book.lenderId);
                // if(isLenderExist && !isLenderExist.isBlocked ){
                // if (book.images && Array.isArray(book.images)) {
                //     const imageUrls = await Promise.all(
                //         book.images.map(async (imageKey: string) => {
                //             const getObjectParams: GetObjectCommandInput = {
                //                 Bucket: config.BUCKET_NAME,
                //                 Key: imageKey,
                //             };
                //             const command = new GetObjectCommand(
                //                 getObjectParams
                //             );
                //             return await getSignedUrl(s3Client, command, {
                //                 expiresIn: 3600,
                //             });
                //         })
                //     );
                //     book.images = imageUrls;
                // } else {
                //     book.images = [];
                // }
                booksToShow.push(book);
            }
        }
        return res.status(200).json(booksToShow);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server Error" });
    }
};

const updateOrderStatus = async (req: Request, res: Response) => {
    try {
        const { selectedOrderId } = req.params;
        const { isBookHandover } = req.body;

        const bookStatus = isBookHandover;
        if (!selectedOrderId) {
            return res.status(400).json({ message: "Order ID is missing" });
        }
        const order = await bookService.getUpdateOrderStatus(
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

const OrderToShowSuccess = async (req: Request, res: Response) => {
    try {
        const { userId, bookId } = req.query;
        console.log(userId, "userId", bookId, "bokid");
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
//   const updateOrderStatus =  async (req: Request, res: Response) => {
//     try {

//         const {selectedOrderId} = req.params;
//         const {isBookHandover}=req.body
//         console.log(selectedOrderId,'selectedOrderId')
//         if(!selectedOrderId){
//             return res.status(400).json({message:"order id is missing"})
//         }
//     if(isBookHandover=="yes"){
//         const bookStatus = "reached_at_user"
//     }
//     const order = await bookService.getUpdateOrderStatus(selectedOrderId,bookStatus)
//         res.status(200).json({order});
//     } catch (error) {
//         console.error('Error createOrder:', error);
//         res.status(500).json({ error: 'An error occurred getting Orders.' });
//     }
// };
export {
    genresOfBooks,
    exploreBooks,
    genres,
    bookDetail,
    rentBook,
    rentBookUpdate,
    sellBook,
    rentedBooks,
    soldBooks,
    lenderDetails,
    lendingProcess,
    createCheckout,
    createOrder,
    orders,
    search,
    OrderToShowSuccess,
    updateOrderStatus,
};
