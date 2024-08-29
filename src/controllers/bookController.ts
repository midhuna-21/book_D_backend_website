import { Request, Response } from "express";
import { UserService } from "../services/userService";
import {
    GetObjectCommand,
    GetObjectCommandInput,
} from "@aws-sdk/client-s3";
import config from "../config/config";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { IGenre } from "../model/genresModel";
import { IBooks } from "../model/bookModel";
import { AuthenticatedRequest } from "../utils/middleware/authMiddleware";
import { s3Client } from "../utils/imageFunctions/store";


const userService = new UserService();

const genresOfBooks = async (req: Request, res: Response) => {
    try {
        const genres: IGenre[] = await userService.getAllGenres();
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

        const allBooks: IBooks[] = await userService.getAllBooks();
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
        const genres: IGenre[] = await userService.getAllGenres();

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
        const book: IBooks | null = await userService.getBookById(bookId);

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
export {
    genresOfBooks,
    exploreBooks,
    genres,
    bookDetail,
};
