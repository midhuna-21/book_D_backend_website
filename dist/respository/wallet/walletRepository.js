"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WalletRepository = void 0;
const walletModel_1 = require("../../model/walletModel");
const orderModel_1 = require("../../model/orderModel");
const bookDWallet_1 = require("../../model/bookDWallet");
class WalletRepository {
    async findWalletTransactions(userId) {
        try {
            const walletTransactions = await walletModel_1.wallet
                .findOne({ userId: userId })
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