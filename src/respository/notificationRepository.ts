import { notification, INotification } from "../model/notificationModel";
import { Notification } from "../interfaces/data";
import mongoose from "mongoose";

export class NotificationRepository {
    async createNotification(
        notificationId: string,
        data: Partial<Notification>
    ): Promise<INotification | null> {
        try {
            if (notificationId) {
                
                const existnotification = await notification.findById({
                    _id: notificationId,
                });
                const id = existnotification?._id;
                return await notification
                    .findByIdAndUpdate(
                        { _id: id },
                        { status: data.status },
                        { new: true }
                    )
                    .populate('userId')
                    .populate('ownerId')
                    .populate('bookId')
                    .populate("cartId")
                    .exec();
            }else {
                const newNotification = new notification({
                    userId: data.userId,
                    ownerId: data.ownerId,
                    bookId: data.bookId,
                    cartId:data.cartId,
                    status: data.status,
                  });
            
                  const savedNotification = await newNotification.save();

                  const value = await notification
                    .findById(savedNotification._id)
                    .populate('userId')
                    .populate('ownerId')
                    .populate('bookId')
                    .populate("cartId")
                    .exec();
                    return value;
                }
        } catch (error) {
            console.log("Error createUser:", error);
            throw error;
        }
    }

    async notificationsByUserId(userId: string): Promise<INotification[]> {
        try {
            const notifications = await notification  
            .find({
                $or: [
                    { userId: new mongoose.Types.ObjectId(userId) },
                    { ownerId: new mongoose.Types.ObjectId(userId) } 
                ]
            })
                .populate("userId")
                .populate("ownerId")
                .populate("bookId")
                .populate("cartId")
                .sort({ createdAt: -1 });

            return notifications;
        } catch (error) {
            console.log("Error notificationsByUserId:", error);
            throw error;
        }
    }

    async updateNotificationType(notificationId: string, type: string) {
        try {
            if (type == "accepted") {
                const update = await notification.findByIdAndUpdate(
                    notificationId,
                    { isAccepted: true, isRejected: false },
                    { new: true }
                );
                return update;
            } else {
                const update = await notification.findByIdAndUpdate(
                    notificationId,
                    { isReject: true, isAccepted: false },
                    { new: true }
                );
                return update;
            }
        } catch (error) {
            console.log("Error updateNotificationType:", error);
            throw error;
        }
    }
}
