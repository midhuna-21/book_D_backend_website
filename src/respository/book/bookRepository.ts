import { Books } from "../../interfaces/data";
import { books, IBooks } from "../../model/bookModel";
import { genres, IGenre } from "../../model/genresModel";
import { Order } from "../../interfaces/data";
import { orders, IOrder } from "../../model/orderModel";
import { WalletRepository } from "../wallet/walletRepository";
import { user } from "../../model/userModel";
import { ICart } from "../../model/cartModel";

interface PaginatedBooks {
    books: IBooks[];
    currentPage: number;
    totalPages: number;
    totalBooks: number;
}

const walletRepository = new WalletRepository();
export class BookRepository {

async updateRentalOrder(userId:string,type:string):Promise<IOrder | null>{
    try{
        const order = await orders.findOneAndUpdate({userId:userId},{bookStatus:type},{new:true})
        return order
    }catch(error){
        console.log('error occurred updateRentalOrder',error)
        throw error
    }
}

    async findUpdateBookQuantity(
        bookId: string,
        quantity: number
    ): Promise<IBooks | null> {
        try {
            const updateBook = await books.findByIdAndUpdate(
                { _id: bookId },
                { quantity: quantity },
                { new: true }
            );
            return updateBook;
        } catch (error) {
            console.log("Error findUpdateBookQuantity:", error);
            throw error;
        }
    }
    async findIsOrderExist(sessionId: string): Promise<IOrder | null> {
        try {
            const isOrderExist = await orders.findOne({ sessionId: sessionId });
            return isOrderExist;
        } catch (error) {
            console.log("Error findIsOrderExist:", error);
            throw error;
        }
    }
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
    async updateBookRent(
        bookRentData: Books,
        bookId: string
    ): Promise<IBooks | null> {
        try {
            const rentBookToUpdate: IBooks | null = await books.findById({
                _id: bookId,
            });
            if (!rentBookToUpdate) {
                console.log("Error finding the renting book to update:");
                return null;
            } else {
                return books
                    .findByIdAndUpdate(
                        { _id: bookId },
                        {
                            bookTitle:
                                bookRentData.bookTitle ||
                                rentBookToUpdate.bookTitle,
                            description:
                                bookRentData.description ||
                                rentBookToUpdate.description,
                            author:
                                bookRentData.author || rentBookToUpdate.author,
                            publisher:
                                bookRentData.publisher ||
                                rentBookToUpdate.publisher,
                            publishedYear:
                                bookRentData.publishedYear ||
                                rentBookToUpdate.publishedYear,
                            genre: bookRentData.genre || rentBookToUpdate.genre,
                            images:
                                bookRentData.images || rentBookToUpdate.images,
                            rentalFee:
                                bookRentData.rentalFee ||
                                rentBookToUpdate.rentalFee,
                            extraFee:
                                bookRentData.extraFee ||
                                rentBookToUpdate.extraFee,
                            address: {
                                street:
                                    bookRentData.address?.street ||
                                    rentBookToUpdate.address?.street,
                                city:
                                    bookRentData.address?.city ||
                                    rentBookToUpdate.address?.city,
                                district:
                                    bookRentData.address?.district ||
                                    rentBookToUpdate.address?.district,
                                state:
                                    bookRentData.address?.state ||
                                    rentBookToUpdate.address?.state,
                                pincode:
                                    bookRentData.address?.pincode ||
                                    rentBookToUpdate.address?.pincode,
                            },
                            isRented: true,
                            quantity:
                                bookRentData.quantity ||
                                rentBookToUpdate.quantity,
                            maxDistance:
                                bookRentData.maxDistance ||
                                rentBookToUpdate.maxDistance,
                            maxDays:
                                bookRentData.maxDays ||
                                rentBookToUpdate.maxDays,
                            minDays:
                                bookRentData.minDays ||
                                rentBookToUpdate.minDays,
                            lenderId:
                                bookRentData.lenderId ||
                                rentBookToUpdate.lenderId,
                            latitude:
                                bookRentData.latitude ||
                                rentBookToUpdate.latitude,
                            longitude:
                                bookRentData.longitude ||
                                rentBookToUpdate.longitude,
                        },
                        { new: true }
                    )
                    .exec();
            }
        } catch (error) {
            console.log("Error updateBookRent:", error);
            throw error;
        }
    }
    async findAllBooks(): Promise<IBooks[]> {
        try {
            return await books.find().sort({ updatedAt: -1 });
        } catch (error) {
            console.log("Error findAllGenres:", error);
            throw error;
        }
    }

    async findGenres(): Promise<IGenre[]> {
        try {
            const allGenres = await genres.find().sort({ updatedAt: -1 });
            return allGenres;
        } catch (error) {
            console.log("Error findAllGenres:", error);
            throw error;
        }
    }
    async findGenresWithAvailableBooks(userId: string): Promise<IGenre[]> {
        try {
            const allBooks = await books.find({
                lenderId: { $ne: userId },
                isArchived: false,
                quantity: { $gt: 0 },
            });
            const allGenres = await genres.find();
            const genresWithBooks = allGenres.filter((genre) =>
                allBooks.some((book) => book.genre === genre.genreName)
            );
            return genresWithBooks;
        } catch (error) {
            console.log("Error findGenresWithAvailableBooks:", error);
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
            const book: IBooks | null = await books
                .findById({ _id: bookId })
                .populate("lenderId");
            if (!book) {
                return null;
            }
            return book;
        } catch (error: any) {
            console.log("Error findBook:", error);
            throw error;
        }
    }

    async findCreateOrder(data: Order): Promise<IOrder | null> {
        try {
            const book = await books.findById({ _id: data.bookId });
            const bookAddress = `${book?.address?.street}${book?.address?.city}${book?.address?.district}${book?.address?.state}${book?.address?.pincode}`;
            const order = await new orders({
                sessionId: data.sessionId,
                cartId: data.cartId,
                bookId: data.bookId,
                bookTitle: book?.bookTitle,
                bookAddress: bookAddress,
                userId: data.userId,
                lenderId: data.lenderId,
                isPaid: true,
                pickupCode: data.pickupCode,
                returnCode: data.returnCode,
            }).save();

            const populatedOrder = await orders
                .findById(order._id)
                .populate("cartId")
                .populate("bookId")
                .populate("userId")
                .populate("lenderId")
                .exec();

            return populatedOrder;
        } catch (error) {
            console.log("Error findCreateOrder:", error);
            throw error;
        }
    }
    async findUpdateOrder(
        userId: string,
        bookId: string
    ): Promise<IOrder | null> {
        try {
            const existingOrder = await orders.findOne({
                userId: userId,
                bookId: bookId,
                isSuccessfull: false,
            });

            if (!existingOrder) {
                console.log("Order is already successful or does not exist.");
                return null;
            }

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
            console.log("Error findUpdateOrder:", error);
            throw error;
        }
    }
    async genreMatchedBooks(genreName: string): Promise<IBooks[] | null> {
        try {
            const allBooks = await books.find({ genre: genreName });

            return allBooks;
        } catch (error) {
            console.log("Error findOrderToShowSuccess:", error);
            throw error;
        }
    }
    async findOrderToShowSuccess(
        userId: string,
        bookId: string
    ): Promise<IOrder | null> {
        try {
            const order = await orders
                .findOne({ userId: userId, bookId: bookId, isPaid: true })
                .populate("bookId")
                .populate("userId")
                .populate("lenderId");

            return order;
        } catch (error) {
            console.log("Error findOrderToShowSuccess:", error);
            throw error;
        }
    }

    async findRentList(userId: string): Promise<IOrder[]> {
        try {
            const order = await orders
                .find({ userId: userId })
                .populate("bookId")
                .populate("userId")
                .populate("cartId")
                .populate("lenderId")
                .sort({ updatedAt: -1 });

            return order;
        } catch (error) {
            console.log("Error findOrders:", error);
            throw error;
        }
    }
    async findLendList(userId: string): Promise<IOrder[]> {
        try {
            const order = await orders
                .find({ lenderId: userId })
                .populate("bookId")
                .populate("userId")
                .populate("cartId")
                .populate("lenderId")
                .sort({ updatedAt: -1 });
            return order;
        } catch (error) {
            console.log("Error findOrders:", error);
            throw error;
        }
    }
    async findSearchResult(searchQuery: string): Promise<IBooks[]> {
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
    async findUpdateOrderStatusRenter(
        selectedOrderId: string,
        bookStatus: string
    ): Promise<IOrder | null> {
        try {
            const orderDetails: IOrder | null = await orders
                .findById({ _id: selectedOrderId })
                .populate("userId")
                .populate("lenderId")
                .populate({ path: "cartId", select: "totalRentalPrice  " });
            if (bookStatus == "not_returned") {
                return await orders.findByIdAndUpdate(
                    { _id: selectedOrderId },
                    {
                        $set: {
                            bookStatusFromRenter: `${bookStatus}`,
                            statusUpdateRenterDate: new Date(),
                        },
                    },
                    { new: true }
                );
            } else if (bookStatus == "completed") {
                return await orders.findByIdAndUpdate(
                    { _id: selectedOrderId },
                    {
                        $set: {
                            bookStatusFromRenter: `${bookStatus}`,
                            bookStatusFromLender: `${bookStatus}`,
                            statusUpdateRenterDate: new Date(),
                        },
                    },
                    { new: true }
                );
            }
            const order = await orders.findByIdAndUpdate(
                { _id: selectedOrderId },
                { bookStatusFromRenter: bookStatus },
                { new: true }
            );
            return order;
        } catch (error) {
            console.log("Error findUpdateOrderStatusRenter:", error);
            throw error;
        }
    }
    async findUpdateOrderStatusLender(
        selectedOrderId: string,
        bookStatus: string
    ): Promise<IOrder | null> {
        try {
            const orderDetails: IOrder | null = await orders
                .findById({ _id: selectedOrderId })
                .populate("userId")
                .populate("lenderId")
                .populate({ path: "cartId", select: "totalRentalPrice  " });
            if (bookStatus == "not_returned") {
                return await orders.findByIdAndUpdate(
                    { _id: selectedOrderId },
                    {
                        $set: {
                            bookStatusFromLender: `${bookStatus}`,
                            statusUpdateRenterDate: new Date(),
                        },
                    },
                    { new: true }
                );
            } else if (bookStatus == "completed") {
                const updatedOrderCompleted = await orders.findByIdAndUpdate(
                    { _id: selectedOrderId },
                    {
                        $set: {
                            bookStatusFromLender: `${bookStatus}`,
                            statusUpdateRenterDate: new Date(),
                        },
                    },
                    { new: true }
                );

                if (updatedOrderCompleted) {
                    await walletRepository.findWalletPaymentTransfer(
                        selectedOrderId
                    );
                    return updatedOrderCompleted;
                }

                return null;
            }

            const order = await orders.findByIdAndUpdate(
                { _id: selectedOrderId },
                { bookStatusFromLender: bookStatus },
                { new: true }
            );
            return order;
        } catch (error) {
            console.log("Error findUpdateOrderStatusLender:", error);
            throw error;
        }
    }

    async escapeRegExp(string: string) {
        return string.replace(/[.,'*+?^${}()|[\]\\]/g, "\\$&");
    }
    async findAvailableBooksForRent(
        userId: string,
        page: number,
        limit: number,
        searchQuery: string,
        genreName: string
    ): Promise<PaginatedBooks> {
        try {
            const sanitizedQuery = await this.escapeRegExp(searchQuery);
            const searchRegex = new RegExp(sanitizedQuery, "i");

            const genreFilter = genreName ? { genre: genreName } : {};
            const queryFilter: any = {
                ...genreFilter,
                lenderId: { $ne: userId },
            };

            if (searchQuery) {
                queryFilter.$or = [
                    { bookTitle: searchRegex },
                    { author: searchRegex },
                    { publisher: searchRegex },
                    { genre: searchRegex },
                    { "address.city": searchRegex },
                    { "address.district": searchRegex },
                    { "address.state": searchRegex },
                ];
            }

            const pageNumber = Math.max(page, 1);
            const limitNumber = Math.max(limit, 1);

            const totalBooks = await books.countDocuments(queryFilter);
            const bookList = await books
                .find(queryFilter)
                .lean()
                .skip((pageNumber - 1) * limitNumber)
                .limit(limitNumber)
                .sort({ updatedAt: -1 });

            return {
                books: bookList,
                currentPage: pageNumber,
                totalPages: Math.ceil(totalBooks / limitNumber),
                totalBooks,
            };
        } catch (error) {
            console.log("Error getAvailableBooksForRent:", error);
            throw error;
        }
    }

    async findArchiveBook(bookId: string): Promise<IBooks | null> {
        try {
            return await books
                .findByIdAndUpdate(
                    { _id: bookId },
                    { isArchived: true },
                    { new: true }
                )
                .populate("lenderId");
        } catch (error) {
            console.log("Error blockUser:", error);
            throw error;
        }
    }
    async findUnArchiveBook(bookId: string): Promise<IBooks | null> {
        try {
            return await books
                .findByIdAndUpdate(
                    { _id: bookId },
                    { isArchived: false },
                    { new: true }
                )
                .populate("lenderId");
        } catch (error) {
            console.log("Error unBlockUser:", error);
            throw error;
        }
    }

    async findRemoveBook(bookId: string): Promise<IBooks | null> {
        try {
            return await books.findByIdAndDelete({ _id: bookId });
        } catch (error) {
            console.log("Error findRemoveBook", error);
            throw error;
        }
    }

    async findOrderById(orderId: string): Promise<IOrder | null> {
        try {
            const order = await orders
                .findById({ _id: orderId })
                .populate("userId");
            return order;
        } catch (error) {
            console.log("Error findOrderById:", error);
            throw error;
        }
    }

    async findVerifyingPickup(
        orderId: string,
        pickupCode: string
    ): Promise<IOrder | null> {
        try {
            return await orders.findById(
                { _id: orderId },
                { pickupCode: pickupCode }
            );
        } catch (error) {
            console.log("Error findVerifyingPickup:", error);
            throw error;
        }
    }

    async findConfirmPickupLender(orderId: string): Promise<IOrder | null> {
        try {
            const order = await orders
                .findById({ _id: orderId })
                .populate("cartId");
            const totalDays = (order?.cartId as ICart)?.totalDays!;
            const rentedOn = new Date();
            const dueDate = new Date(
                rentedOn.getTime() + totalDays * 24 * 60 * 60 * 1000
            );

            return await orders.findByIdAndUpdate(
                { _id: orderId },
                {
                    $set: {
                        rentedOn,
                        dueDate,
                        bookStatus: "not_returned",
                    },
                },
                { new: true }
            );
        } catch (error) {
            console.log("Error findConfirmPickupLender:", error);
            throw error;
        }
    }

    async findConfirmReturnRenter(orderId: string): Promise<IOrder | null> {
        try {
            const updatedOrderCompleted = await orders.findByIdAndUpdate(
                orderId,
                {
                    $set: {
                        checkoutDate: new Date(),
                        bookStatus: "completed",
                    },
                },
                { new: true }
            );

            if (updatedOrderCompleted) {
                await walletRepository.findWalletPaymentTransfer(orderId);
                return updatedOrderCompleted;
            }

            return null;
        } catch (error) {
            console.log("Error findConfirmReturnRenter:", error);
            throw error;
        }
    }
}
