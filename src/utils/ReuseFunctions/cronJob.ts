import cron from "node-cron";
import { orders } from "../../model/orderModel";
import { notification } from "../../model/notificationModel";
import { wallet } from "../../model/walletModel";
import { cart, ICart } from "../../model/cartModel";
import { bookDWallet } from "../../model/bookDWallet";
import { books } from "../../model/bookModel";

cron.schedule("* * * * *", async () => {
    try {
        const acceptedCarts = await cart.find({
            types: "accepted",
            isPaid: false,
            acceptedDate: { $ne: null },
        });

        for (const cartItem of acceptedCarts) {
            const currentTime = new Date();
            const acceptedDate = new Date(cartItem.acceptedDate!);

            const timeDifference =
                currentTime.getTime() - acceptedDate.getTime();
            const timeDifferenceInHours = timeDifference / (1000 * 3600);

            if (timeDifferenceInHours >= 24) {
                const book = await books.findOne({ _id: cartItem.bookId });

                if (book) {
                    book.quantity += cartItem.quantity!;
                    await book.save();
                    cartItem.quantity = 0;
                    cartItem.types = "timed-out";
                    await cartItem.save();
                }
            }
        }
        const tenDaysAgo = new Date();
        tenDaysAgo.setDate(tenDaysAgo.getDate() - 10);

        const overdueOrders = await orders.find({
            bookStatus: "not_returned",
            isAmountCredited: false,
            statusUpdateRenterDate: { $lte: tenDaysAgo },
        });

        if (overdueOrders.length > 0) {
            for (const order of overdueOrders) {
                await orders.findByIdAndUpdate(order._id, {
                    $set: { bookStatus: "overdue" },
                });
                const cart = order?.cartId as ICart;
                let lenderWallet = await wallet.findOne({
                    userId: order?.lenderId,
                });

                if (!lenderWallet) {
                    lenderWallet = new wallet({
                        userId: order?.lenderId,
                        balance: 0,
                        transactions: [],
                    });
                }

                lenderWallet.balance += cart.totalAmount!;

                lenderWallet.transactions.push({
                    total_amount: cart.totalAmount,
                    source: "payment_to_lender",
                    orderId: order._id,
                    type: "credit",
                    createdAt: new Date(),
                });

                await lenderWallet.save();
                await orders.findByIdAndUpdate(order._id, {
                    $set: { isAmountCredited: true },
                });

                const adminWallet = await bookDWallet.findOne({});

                if (adminWallet) {
                    adminWallet.balance -= cart.totalAmount!;
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

        const ordersToCancel = await orders.find({
            bookStatus: "not_picked_up",
            isAmountCredited: false,
            createdAt: { $lte: fiveDaysAgo },
        });

        if (ordersToCancel.length > 0) {
            for (const order of ordersToCancel) {
                await orders.findByIdAndUpdate(order._id, {
                    $set: { bookStatus: "cancelled" },
                });

                const cart = order?.cartId as ICart;
                let userWallet = await wallet.findOne({
                    userId: order?.userId,
                });

                if (!userWallet) {
                    userWallet = new wallet({
                        userId: order?.userId,
                        balance: 0,
                        transactions: [],
                    });
                }

                userWallet.balance += cart.totalAmount!;

                userWallet.transactions.push({
                    total_amount: cart.totalAmount,
                    source: "refund_to_user",
                    orderId: order._id,
                    type: "credit",
                    createdAt: new Date(),
                });

                await userWallet.save();
                await orders.findByIdAndUpdate(order._id, {
                    $set: { isAmountCredited: true },
                });
                const book = await books.findOne({ _id: cart.bookId });
                if (book) {
                    book.quantity += cart.quantity!;
                    await book.save();
                }

                cart.quantity = 0;
                cart.types = "cancelled";
                await cart.save();
                const adminWallet = await bookDWallet.findOne({});

                if (adminWallet) {
                    adminWallet.balance -= cart.totalAmount!;
                    adminWallet.transactions.push({
                        source: "Payment return",
                        status: "debit",
                        total_amount: cart.totalAmount,
                    });
                    return await adminWallet.save();
                }
            }
        }

        const notificationsToReject = await notification.find({
            status: "requested",
            createdAt: { $lte: fiveDaysAgo },
        });

        if (notificationsToReject.length > 0) {
            for (const notif of notificationsToReject) {
                await notification.findByIdAndUpdate(notif._id, {
                    $set: { status: "rejected" },
                });
            }
        }
    } catch (error) {
        console.log("Error in cancelling orders:", error);
    }
});
