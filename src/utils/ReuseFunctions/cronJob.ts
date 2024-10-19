import cron from "node-cron";
import { orders } from "../../model/orderModel";
import { notification } from "../../model/notificationModel";
import { wallet } from "../../model/walletModel";
import { ICart } from "../../model/cartModel";
import {bookDWallet} from '../../model/bookDWallet';

cron.schedule("* * * * *", async () => {
    try {
        const tenDaysAgo = new Date();
        tenDaysAgo.setDate(tenDaysAgo.getDate() - 10);

        const overdueOrders = await orders.find({
            bookStatusFromRenter: "not_returned",isAmountCredited: false,
            statusUpdateRenterDate: { $lte: tenDaysAgo },
        });

        if (overdueOrders.length > 0) {
            for (const order of overdueOrders) {
                await orders.findByIdAndUpdate(order._id, {
                    $set: { bookStatusFromRenter: "overdue" },
                });
                const cart = order?.cartId as ICart;
                let lenderWallet = await wallet.findOne({
                    userId: order?.lenderId,
                });

                if (!lenderWallet) {
                    console.log(
                        `Creating a new wallet for user ${order?.lenderId}`
                    );
                    lenderWallet = new wallet({
                        userId: order?.lenderId,
                        balance: 0,
                        transactions: [],
                    });
                }

                lenderWallet.balance += cart.totalAmount;

                lenderWallet.transactions.push({
                    total_amount: cart.totalAmount,
                    source: "payment_to_lender",
                    orderId:order._id,
                    type: "credit",
                    createdAt: new Date(),
                });

                await lenderWallet.save();
                await orders.findByIdAndUpdate(order._id, {
                  $set: { isAmountCredited: true },
                });

                const adminWallet = await bookDWallet.findOne({}); 

                if (adminWallet) {
                    adminWallet.balance -= cart.totalAmount;
                    adminWallet.transactions.push({
                        source: "Payment return",
                        status: "debit",
                        total_amount: cart.totalAmount,
                    });
                    return await adminWallet.save();
                }

                console.log(
                    `Refunded full amount ${cart.totalAmount} to user ${order?.userId}'s wallet for cancelled order ${order._id}`
                );
            }
        }
       

        const fiveDaysAgo = new Date();
        fiveDaysAgo.setDate(fiveDaysAgo.getDate() - 5);

        const ordersToCancel = await orders.find({
            bookStatusFromRenter: "not_reached",isAmountCredited: false,
            createdAt: { $lte: fiveDaysAgo },
        });
      
        if (ordersToCancel.length > 0) {
         
            for (const order of ordersToCancel) {
                await orders.findByIdAndUpdate(order._id, {
                    $set: { bookStatusFromRenter: "cancelled" },
                });
            
                const cart = order?.cartId as ICart;
                let userWallet = await wallet.findOne({
                    userId: order?.userId,
                });

                if (!userWallet) {
                    console.log(
                        `Creating a new wallet for user ${order?.userId}`
                    );
                    userWallet = new wallet({
                        userId: order?.userId,
                        balance: 0,
                        transactions: [],
                    });
                }

                userWallet.balance += cart.totalAmount;

                userWallet.transactions.push({
                    total_amount: cart.totalAmount,
                    source: "refund_to_user",
                    orderId:order._id,
                    type: "credit",
                    createdAt: new Date(),
                });

                await userWallet.save();
                await orders.findByIdAndUpdate(order._id, {
                  $set: { isAmountCredited: true },
                });

                const adminWallet = await bookDWallet.findOne({}); 

                if (adminWallet) {
                    adminWallet.balance -= cart.totalAmount;
                    adminWallet.transactions.push({
                        source: "Payment return",
                        status: "debit",
                        total_amount: cart.totalAmount,
                    });
                    return await adminWallet.save();
                }

                console.log(
                    `Refunded full amount ${cart.totalAmount} to user ${order?.userId}'s wallet for cancelled order ${order._id}`
                );
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
