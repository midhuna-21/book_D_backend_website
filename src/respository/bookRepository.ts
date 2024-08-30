import { Books } from "../interfaces/data";
import { books, IBooks } from "../model/bookModel";
import { genres } from "../model/genresModel";
import { Order } from "../interfaces/data";
import { orders } from "../model/orderModel";
import { GetObjectCommand, GetObjectCommandInput } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import config from "../config/config";
import { s3Client } from "../utils/imageFunctions/store";

export class BookRepository {
    async addToBookRent(bookRentData: Books): Promise<IBooks | null> {
        try {
            return new books({
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
        } catch (error) {
            console.log("Error addToBookRent:", error);
            throw error;
        }
    }

    async findAllBooks() {
        try {
            return await books.find();
        } catch (error) {
            console.log("Error findAllGenres:", error);
            throw error;
        }
    }

    async findAllGenres() {
        try {
            return await genres.find();
        } catch (error) {
            console.log("Error findAllGenres:", error);
            throw error;
        }
    }

    async addToBookSell(bookSelldata: Books): Promise<IBooks | null> {
        try {
            return await new books({
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
        } catch (error) {
            console.log("Error addToBookSell:", error);
            throw error;
        }
    }
    async findBook(bookId: string): Promise<IBooks | null> {
        try {
            const book: IBooks | null = await books.findById(bookId);
            if (!book) {
                console.log(`Book with ID ${bookId} not found.`);
                return null;
            }

            if (book.images && Array.isArray(book.images)) {
                const imageUrls = await Promise.all(
                    book.images.map(async (imageKey: string) => {
                        const getObjectParams: GetObjectCommandInput = {
                            Bucket: config.BUCKET_NAME,
                            Key: imageKey,
                        };
                        const command = new GetObjectCommand(getObjectParams);
                        return await getSignedUrl(s3Client, command, {
                            expiresIn: 3600,
                        });
                    })
                );
                book.images = imageUrls;
            } else {
                book.images = [];
            }

            return book;
        } catch (error: any) {
            console.log("Error findBook:", error);
            throw error;
        }
    }

    async findCreateOrderProcess(data: Order) {
        try {
            const order = await new orders({
                sessionId: data.sessionId,
                bookId: data.bookId,
                userId: data.userId,
                totalPrice: data.totalPrice,
                lenderId: data.lenderId,
                quantity: data.quantity,
                depsoitAmount: data.depositAmount,
            }).save();

            return order;
        } catch (error) {
            console.log("Error findCreateOrderProcess:", error);
            throw error;
        }
    }
    async findCreateOrder(userId: string, bookId: string) {
        try {
            const order = await orders
                .findOneAndUpdate(
                    { userId: userId, bookId: bookId },
                    {
                        isSuccessfull: true,
                        isMoneyTransactionStatus: "sent_to_website",
                        isTrasaction: ["pending"],
                    },
                    { new: true }
                )
                .populate("bookId")
                .populate("userId")
                .populate("lenderId");

            return order;
        } catch (error) {
            console.log("Error findCreateOrder:", error);
            throw error;
        }
    }

    async findOrders(userId: string) {
        try {
            const order = await orders
                .find({ userId: userId })
                .populate("bookId")
                .populate("userId")
                .populate("lenderId");
            console.log(order, "o");
            return order;
        } catch (error) {
            console.log("Error findOrders:", error);
            throw error;
        }
    }

    async findSearchResult(searchQuery: string) {
        try {
            const result = await books.find({
                $or: [
                    { genre: { $regex: searchQuery, $options: "i" } },
                    { bookTitle: { $regex: searchQuery, $options: "i" } },
                ],
            });
            return result;
        } catch (error) {
            console.log("Error findSearchResult:", error);
            throw error;
        }
    }
}
