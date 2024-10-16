import cron from 'node-cron';
import {orders} from '../../model/orderModel'
import { notification } from '../../model/notificationModel';

cron.schedule('* * * * *', async () => {
  try {
   const tenDaysAgo = new Date();
    tenDaysAgo.setDate(tenDaysAgo.getDate() - 10);
    

    const overdueOrders = await orders.find({
      bookStatus: 'not_returned',
      statusUpdateRenterDate: { $lte: tenDaysAgo },
    });

    if (overdueOrders.length > 0) {
      for (const order of overdueOrders) {
        await orders.findByIdAndUpdate(order._id, {
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

    const ordersToCancel = await orders.find({
      bookStatus: 'not_reached',
      createdAt: { $lte: fiveDaysAgo },
    });

    if (ordersToCancel.length > 0) {
      for (const order of ordersToCancel) {
        await orders.findByIdAndUpdate(order._id, {
          $set: { bookStatus: 'cancelled' },
        });
        console.log(`Order ${order._id} has been cancelled due to user not picking up within 5 days.`);
      }
    } 
  
    const notificationsToReject = await notification.find({
      status: 'requested',
      createdAt: { $lte: fiveDaysAgo },
     
    });

    if (notificationsToReject.length > 0) {
      for (const notif of notificationsToReject) {
        await notification.findByIdAndUpdate(notif._id, {
          $set: { status: 'rejected' },
        });
      }
    }
  } catch (error) {
    console.log('Error in cancelling orders:', error);
  }
});
