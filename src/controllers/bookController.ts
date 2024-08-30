import { Request, Response } from "express";
import {
    GetObjectCommand,
    GetObjectCommandInput,
    PutObjectCommand
} from "@aws-sdk/client-s3";
import { IGenre } from "../model/genresModel";
import sharp from "sharp";
import crypto from "crypto";
import config from "../config/config";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import {Books} from "../interfaces/data";
import { IBooks } from "../model/bookModel";
import rentBookValidation from "../utils/ReuseFunctions/rentBookValidation";
import sellBookValidation from "../utils/ReuseFunctions/sellBookValidation";
import { AuthenticatedRequest } from "../utils/middleware/authMiddleware";
import { s3Client } from "../utils/imageFunctions/store";
import Stripe from 'stripe';
import { BookService } from "../services/bookService";
import { RequestService } from "../services/requestService";
import { UserService } from "../services/userService";

const bookService = new BookService();
const requestService = new RequestService()
const userService = new UserService()

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
                }
                booksToShow.push(book);
            }
        }

        return res.status(200).json(booksToShow);
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
             longitude
 
         } = req.body;
 
         if (!req.userId) {
             return res
                 .status(403)
                 .json({ message: "User ID not found in request" });
         }
         const userId = req.userId;
 
         const files = req.files as Express.Multer.File[];
 
         if (!files || files.length === 0) {
             return res
                 .status(404)
                 .json({ message: "Please provide book images" });
         }
 
         const imageUrls: string[] = [];
 
         for (let i = 0; i < files.length; i++) {
             const buffer = await sharp(files[i].buffer)
                 .resize({ height: 1920, width: 1080, fit: "contain" })
                 .toBuffer();
 
             const imageKey = randomImageName();
 
             const params = {
                 Bucket: "bookstore-web-app",
                 Key: imageKey,
                 Body: buffer,
                 ContentType: files[i].mimetype,
             };
   
             const command = new PutObjectCommand(params);
 
             try {
                 await s3Client.send(command);
                 imageUrls.push(imageKey);
             } catch (error: any) {
                 console.error(error);
                 return res
                     .status(500)
                     .json({ message: `Failed to upload image ${i}` });
             }
            
         }
         const bookRentData: Books = {
             bookTitle,
             description,
             author,
             publisher,
             publishedYear,
             genre,
             images: imageUrls,
             rentalFee,
             extraFee,
             quantity,
             address:{
                 street,
                 city,
                 district,
                 state,
                 pincode
                },
             isRented: true,
             lenderId: userId,
             maxDistance,
             maxDays,
             minDays,
             latitude,
             longitude
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
             longitude
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
            address:{
             street,
             city,
             state,
             district,
             pincode
            },
             lenderId: userId,
             latitude,
             longitude
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
         console.log(booksToShow);
 
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
 
         return res.status(200).json({ });
     } catch (error: any) {
         console.log(error.message);
         return res.status(500).json({ message: "Internal server error" });
     }
 };
 const lendingProcess = async(req:Request,res:Response)=>{
     try{
         const {requestId} = req.params;
         console.log(requestId,'lenderId');
         if(!requestId){
             return res.status(500).json({message:"requestId not found"});
         }
         const details = await requestService.getRequestDetails(requestId)
         return res.status(200).json({details})
     }catch(error:any){
         console.log("Error userDetails:",error);
         return res.status(500).json({message: "Internal server error at userDetails"})
     }
 }
 const stripeKey = config.STRIPE_KEY!
 const stripe = new Stripe(stripeKey,{ apiVersion: '2024-06-20' })
 
 const createCheckout = async (req:Request,res:Response) => {
     const { bookTitle, totalPrice, quantity,requestId, userId, lenderId, bookId, depositAmount } = req.body;
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
         success_url: `${config.API}/home/payment-success?book_id=${bookId}&user_id=${userId}&request_id=${requestId}`,
         cancel_url: `${config.API}/payment-cancel`,
       });
       const sessionData = {
         sessionId:session.id,
         userId,
         lenderId,
         bookId,
         totalPrice,
         quantity,
         depositAmount,
       };
       await bookService.getCreateOrderProcess(sessionData); 
       res.json({ id: session.id });
     } catch (error:any) {
       res.status(500).json({ error: error.message });
     }
   };
   
 
 const createOrder =  async (req: Request, res: Response) => {
     try {
         console.log(req.body,'f')
         const {userId,bookId,requestId} = req.body;
         
         if(!userId || !bookId){
             return res.status(400).json({message:"user or book id is missing"})
         }
         
         const order = await bookService.getCreateOrder(userId,bookId)
         const requestUpdate = await requestService.getUpdateRequest(requestId)
         res.status(200).json({order});
     } catch (error) {
         console.error('Error createOrder:', error);
         res.status(500).json({ error: 'An error occurred while create Order.' });
     }
 };
 
 const orders =  async (req: Request, res: Response) => {
     try {
   
         const {userId} = req.params;
      
         if(!userId){
             return res.status(400).json({message:"user is missing"})
         }
         
         const orders = await bookService.getOrders(userId)
         res.status(200).json({orders});
     } catch (error) {
         console.error('Error createOrder:', error);
         res.status(500).json({ error: 'An error occurred getting Orders.' });
     }
 };

 const search = async (req:AuthenticatedRequest, res:Response) => {
    const { searchQuery } = req.params;
    const booksToShow: IBooks[] = [];
    const userId = req.userId;
    try {
        const books = await bookService.getSearchResult(searchQuery)
        for (const book of books) {
            if (book.lenderId !== userId) {
                // const isLenderExist = await bookService.getUserById(book.lenderId);
                // if(isLenderExist && !isLenderExist.isBlocked ){
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
        return res.status(200).json(booksToShow)
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server Error' });
    }
  }

export {
    genresOfBooks,
    exploreBooks,
    genres,
    bookDetail,
    rentBook,
    sellBook,
    rentedBooks,
    soldBooks,
    lenderDetails,
    lendingProcess,
    createCheckout,
    createOrder,
    orders,
    search
};
