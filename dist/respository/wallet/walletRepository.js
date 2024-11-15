"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WalletRepository = void 0;
const walletModel_1 = require("../../model/walletModel");
const orderModel_1 = require("../../model/orderModel");
const bookDWallet_1 = require("../../model/bookDWallet");
class WalletRepository {
    async findWalletTransactions(userId) {
        try {
            // Find the wallet for the given userId and populate orderId with bookId
            const walletTransactions = await walletModel_1.wallet
                .findOne({ userId: userId })
                .select({ balance: 1, transactions: 1 }) // Select only needed fields
                .populate({
                path: "transactions.orderId",
                populate: {
                    path: "bookId",
                    model: "books",
                },
                strictPopulate: false,
            });
            if (!walletTransactions) {
                console.log("No wallet found for this user.");
                return null;
            }
            // Sort transactions based on `updatedAt` in descending order (newest first)
            walletTransactions.transactions.sort((a, b) => {
                const dateA = a.updatedAt ? new Date(a.updatedAt).getTime() : new Date(0).getTime();
                const dateB = b.updatedAt ? new Date(b.updatedAt).getTime() : new Date(0).getTime();
                return dateB - dateA; // Sort in descending order (most recent first)
            });
            console.log(walletTransactions, "Sorted Wallet Transactions");
            return walletTransactions;
        }
        catch (error) {
            console.log("Error in findWalletTransactions:", error);
            throw error;
        }
    }
    // async findWalletTransactions(userId: string): Promise<IWallet | null> {
    //     try {
    //         const walletTransactions = await wallet
    //             .findOne({ userId: userId })
    //             .populate({
    //                 path: "transactions.orderId",
    //                 populate: {
    //                     path: "bookId",
    //                     model: "books",
    //                 },
    //                 strictPopulate: false,
    //             });
    //             console.log(walletTransactions,'walletTransactions')
    //         return walletTransactions;
    //     } catch (error) {
    //         console.log("Error createWallet:", error);
    //         throw error;
    //     }
    // }
    async findWalletPaymentTransfer(orderId) {
        try {
            const order = await orderModel_1.orders
                .findById({ _id: orderId })
                .populate("cartId");
            if (order) {
                const cart = order?.cartId;
                const totalRentalPrice = cart.totalRentalPrice;
                const depositAmount = cart.total_deposit_amount;
                const totalAmount = cart.totalAmount;
                let lenderWallet = await walletModel_1.wallet.findOne({
                    userId: order?.lenderId,
                });
                if (!lenderWallet) {
                    console.log(`Creating a new wallet for lender ${order?.lenderId}`);
                    lenderWallet = new walletModel_1.wallet({
                        userId: order?.lenderId,
                        balance: 0,
                        transactions: [],
                    });
                }
                if (lenderWallet) {
                    lenderWallet.balance += totalRentalPrice;
                    lenderWallet.transactions.push({
                        total_amount: totalRentalPrice,
                        source: "payment_to_lender",
                        orderId: order._id,
                        type: "credit",
                        createdAt: new Date(),
                    });
                    await lenderWallet.save();
                    let renterWallet = await walletModel_1.wallet.findOne({
                        userId: order?.userId,
                    });
                    if (!renterWallet) {
                        console.log(`Creating a new wallet for renter ${order?.userId}`);
                        renterWallet = new walletModel_1.wallet({
                            userId: order?.userId,
                            balance: 0,
                            transactions: [],
                        });
                    }
                    renterWallet.balance += depositAmount;
                    console.log('why it is i not changing');
                    renterWallet.transactions.push({
                        total_amount: depositAmount,
                        source: "refund_to_user",
                        orderId: order._id,
                        type: "credit",
                        createdAt: new Date(),
                    });
                    await renterWallet.save();
                    await orderModel_1.orders.findByIdAndUpdate(order._id, {
                        $set: { isAmountCredited: true },
                    });
                    const adminWallet = await bookDWallet_1.bookDWallet.findOne({});
                    if (adminWallet) {
                        adminWallet.balance -= totalAmount;
                        adminWallet.transactions.push({
                            source: "Payment return",
                            status: "debit",
                            total_amount: totalAmount,
                        });
                        return await adminWallet.save();
                    }
                    else {
                        console.log(`Admin wallet not found.`);
                        return null;
                    }
                }
                else {
                    console.log(`Order not found.`);
                    return null;
                }
            }
        }
        catch (error) {
            throw error;
        }
    }
    async findWalletByAdminId(adminId) {
        try {
            const walletTransactions = await bookDWallet_1.bookDWallet
                .findOne({ adminId: adminId })
                .populate({
                path: "transactions.orderId",
                populate: {
                    path: "bookId",
                    model: "books",
                },
                strictPopulate: false,
            });
            return walletTransactions;
        }
        catch (error) {
            console.log("Error createWallet:", error);
            throw error;
        }
    }
    async findCreateWalletAdmin(adminId) {
        try {
            let wallet = await bookDWallet_1.bookDWallet.findOne({ adminId: adminId });
            if (!wallet) {
                wallet = new bookDWallet_1.bookDWallet({
                    adminId,
                    balance: 0,
                    transactions: [],
                });
                console.log('');
                await wallet.save();
            }
            return wallet;
        }
        catch (error) {
            console.error("Error creating or finding wallet:", error);
            throw error;
        }
    }
    async findUpdateBookWallet(lenderId, totalAmount, userId) {
        try {
            const adminWallet = await bookDWallet_1.bookDWallet.findOne({});
            if (adminWallet) {
                adminWallet.balance += totalAmount;
                adminWallet.transactions.push({
                    source: "Payment received",
                    status: "credit",
                    total_amount: totalAmount,
                });
                return await adminWallet.save();
            }
        }
        catch (error) {
            console.error("Error findUpdateBookWallet:", error);
            throw error;
        }
    }
}
exports.WalletRepository = WalletRepository;
//# sourceMappingURL=walletRepository.js.map