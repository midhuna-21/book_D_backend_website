"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_cron_1 = __importDefault(require("node-cron"));
const orderModel_1 = require("../../model/orderModel");
const notificationModel_1 = require("../../model/notificationModel");
node_cron_1.default.schedule('* * * * *', async () => {
    try {
        const tenDaysAgo = new Date();
        tenDaysAgo.setDate(tenDaysAgo.getDate() - 10);
        const overdueOrders = await orderModel_1.orders.find({
            bookStatus: 'not_returned',
            statusUpdateRenterDate: { $lte: tenDaysAgo },
        });
        if (overdueOrders.length > 0) {
            for (const order of overdueOrders) {
                await orderModel_1.orders.findByIdAndUpdate(order._id, {
                    $set: { bookStatus: 'overdue' },
                });
                console.log(`Order ${order._id} has been marked as overdue.`);
            }
        }
        // else {
        //   console.log('No orders to mark as overdue today.');
        // }
        const fiveDaysAgo = new Date();
        fiveDaysAgo.setDate(fiveDaysAgo.getDate() - 5);
        const ordersToCancel = await orderModel_1.orders.find({
            bookStatus: 'not_reached',
            createdAt: { $lte: fiveDaysAgo },
        });
        if (ordersToCancel.length > 0) {
            for (const order of ordersToCancel) {
                await orderModel_1.orders.findByIdAndUpdate(order._id, {
                    $set: { bookStatus: 'cancelled' },
                });
                console.log(`Order ${order._id} has been cancelled due to user not picking up within 5 days.`);
            }
        }
        const notificationsToReject = await notificationModel_1.notification.find({
            status: 'requested',
            createdAt: { $lte: fiveDaysAgo },
        });
        if (notificationsToReject.length > 0) {
            for (const notif of notificationsToReject) {
                await notificationModel_1.notification.findByIdAndUpdate(notif._id, {
                    $set: { status: 'rejected' },
                });
            }
        }
    }
    catch (error) {
        console.log('Error in cancelling orders:', error);
    }
});
//# sourceMappingURL=cronJob.js.map