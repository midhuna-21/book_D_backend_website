"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_cron_1 = __importDefault(require("node-cron"));
const orderModel_1 = require("../../model/orderModel");
const notificationModel_1 = require("../../model/notificationModel");
const walletModel_1 = require("../../model/walletModel");
const cartModel_1 = require("../../model/cartModel");
const bookDWallet_1 = require("../../model/bookDWallet");
const bookModel_1 = require("../../model/bookModel");
node_cron_1.default.schedule("* * * * *", async () => {
    try {
        const acceptedCarts = await cartModel_1.cart.find({
            types: "accepted",
            isPaid: false,
            acceptedDate: { $ne: null },
        });
        for (const cartItem of acceptedCarts) {
            const currentTime = new Date();
            const acceptedDate = new Date(cartItem.acceptedDate);
            const timeDifference = currentTime.getTime() - acceptedDate.getTime();
            const timeDifferenceInHours = timeDifference / (1000 * 3600);
            if (timeDifferenceInHours >= 24) {
                const book = await bookModel_1.books.findOne({ _id: cartItem.bookId });
                if (book) {
                    book.quantity += cartItem.quantity;
                    await book.save();
                    cartItem.quantity = 0;
                    cartItem.types = "timed-out";
                    await cartItem.save();
                }
            }
        }
        const tenDaysAgo = new Date();
        tenDaysAgo.setDate(tenDaysAgo.getDate() - 10);
        const overdueOrders = await orderModel_1.orders.find({
            bookStatusFromRenter: "not_returned",
            isAmountCredited: false,
            statusUpdateRenterDate: { $lte: tenDaysAgo },
        });
        if (overdueOrders.length > 0) {
            for (const order of overdueOrders) {
                await orderModel_1.orders.findByIdAndUpdate(order._id, {
                    $set: { bookStatusFromRenter: "overdue" },
                });
                const cart = order?.cartId;
                let lenderWallet = await walletModel_1.wallet.findOne({
                    userId: order?.lenderId,
                });
                if (!lenderWallet) {
                    lenderWallet = new walletModel_1.wallet({
                        userId: order?.lenderId,
                        balance: 0,
                        transactions: [],
                    });
                }
                lenderWallet.balance += cart.totalAmount;
                lenderWallet.transactions.push({
                    total_amount: cart.totalAmount,
                    source: "payment_to_lender",
                    orderId: order._id,
                    type: "credit",
                    createdAt: new Date(),
                });
                await lenderWallet.save();
                await orderModel_1.orders.findByIdAndUpdate(order._id, {
                    $set: { isAmountCredited: true },
                });
                const adminWallet = await bookDWallet_1.bookDWallet.findOne({});
                if (adminWallet) {
                    adminWallet.balance -= cart.totalAmount;
                    adminWallet.transactions.push({
                        source: "Payment return",
                        status: "debit",
                        total_amount: cart.totalAmount,
                    });
                    return await adminWallet.save();
                }
            }
        }
        const fiveDaysAgo = new Date();
        fiveDaysAgo.setDate(fiveDaysAgo.getDate() - 5);
        const ordersToCancel = await orderModel_1.orders.find({
            bookStatusFromRenter: "not_reached",
            isAmountCredited: false,
            createdAt: { $lte: fiveDaysAgo },
        });
        if (ordersToCancel.length > 0) {
            for (const order of ordersToCancel) {
                await orderModel_1.orders.findByIdAndUpdate(order._id, {
                    $set: { bookStatusFromRenter: "cancelled" },
                });
                const cart = order?.cartId;
                let userWallet = await walletModel_1.wallet.findOne({
                    userId: order?.userId,
                });
                if (!userWallet) {
                    userWallet = new walletModel_1.wallet({
                        userId: order?.userId,
                        balance: 0,
                        transactions: [],
                    });
                }
                userWallet.balance += cart.totalAmount;
                userWallet.transactions.push({
                    total_amount: cart.totalAmount,
                    source: "refund_to_user",
                    orderId: order._id,
                    type: "credit",
                    createdAt: new Date(),
                });
                await userWallet.save();
                await orderModel_1.orders.findByIdAndUpdate(order._id, {
                    $set: { isAmountCredited: true },
                });
                const book = await bookModel_1.books.findOne({ _id: cart.bookId });
                if (book) {
                    book.quantity += cart.quantity;
                    await book.save();
                }
                cart.quantity = 0;
                cart.types = "cancelled";
                await cart.save();
                const adminWallet = await bookDWallet_1.bookDWallet.findOne({});
                if (adminWallet) {
                    adminWallet.balance -= cart.totalAmount;
                    adminWallet.transactions.push({
                        source: "Payment return",
                        status: "debit",
                        total_amount: cart.totalAmount,
                    });
                    return await adminWallet.save();
                }
            }
        }
        const notificationsToReject = await notificationModel_1.notification.find({
            status: "requested",
            createdAt: { $lte: fiveDaysAgo },
        });
        if (notificationsToReject.length > 0) {
            for (const notif of notificationsToReject) {
                await notificationModel_1.notification.findByIdAndUpdate(notif._id, {
                    $set: { status: "rejected" },
                });
            }
        }
    }
    catch (error) {
        console.log("Error in cancelling orders:", error);
    }
});
//# sourceMappingURL=cronJob.js.map