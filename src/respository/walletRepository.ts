import { wallet } from "../model/walletModel";
import { orders } from "../model/orderModel";
import { ICart } from "../model/cartModel";
import { bookDWallet, IBookWalletTransaction } from "../model/bookDWallet";

export class WalletRepository {
    async findWalletTransactions(userId: string) {
        try {
            const walletTransactions = await wallet
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
        } catch (error) {
            console.log("Error createWallet:", error);
            throw error;
        }
    }

    async walletPaymentTransfer(orderId: string) {
        try {
            const order = await orders
                .findById({ _id: orderId })
                .populate("cartId");

            if (order) {
                const cart = order?.cartId as ICart;

                const totalRentalPrice = cart.totalRentalPrice;
                const depositAmount = cart.total_deposit_amount;
                const totalAmount = cart.totalAmount;
                let lenderWallet = await wallet.findOne({
                    userId: order?.lenderId,
                });

                if (!lenderWallet) {
                    console.log(
                        `Creating a new wallet for lender ${order?.lenderId}`
                    );
                    lenderWallet = new wallet({
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
                        orderId: order._id!,
                        type: "credit",
                        createdAt: new Date(),
                    });

                    await lenderWallet.save();
                    let renterWallet = await wallet.findOne({
                        userId: order?.userId,
                    });
                    if (!renterWallet) {
                        console.log(
                            `Creating a new wallet for renter ${order?.userId}`
                        );
                        renterWallet = new wallet({
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
                    await orders.findByIdAndUpdate(order._id, {
                        $set: { isAmountCredited: true },
                    });

                    const adminWallet = await bookDWallet.findOne({});

                    if (adminWallet) {
                        adminWallet.balance -= totalAmount;
                        adminWallet.transactions.push({
                            source: "Payment return",
                            status: "debit",
                            total_amount: totalAmount,
                        });
                        return await adminWallet.save();
                    }
                } else {
                    console.log(
                        `Lender's wallet not found for lender ${order?.lenderId} and order ${order._id}`
                    );
                }
            }
        } catch (error) {
            throw error;
        }
    }

    async findWalletByAdminId(adminId: string) {
        try {
            const walletTransactions = await bookDWallet
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
        } catch (error) {
            console.log("Error createWallet:", error);
            throw error;
        }
    }

    async findCreateWalletAdmin(adminId: string) {
        try {
            let wallet = await bookDWallet.findOne({ adminId: adminId });

            if (!wallet) {
                wallet = new bookDWallet({
                    adminId,
                    balance: 0,
                    transactions: [],
                });

                await wallet.save();
            }

            return wallet;
        } catch (error) {
            console.error("Error creating or finding wallet:", error);
            throw error;
        }
    }

    async findUpdateBookWallet(
        lenderId: string,
        totalAmount: number,
        userId: string
    ) {
        try {
            const adminWallet = await bookDWallet.findOne({});

            if (adminWallet) {
                adminWallet.balance += totalAmount;
                adminWallet.transactions.push({
                    source: "Payment received",
                    status: "credit",
                    total_amount: totalAmount,
                });
                return await adminWallet.save();
            }
        } catch (error) {
            console.error("Error findUpdateBookWallet:", error);
            throw error;
        }
    }
}
