import { notification, INotification } from "../../model/notificationModel";
import { Notification } from "../../interfaces/data";
import mongoose from "mongoose";

export class NotificationRepository {
    async findCreateNotification(
        notificationId: string,
        data: Partial<Notification>
    ): Promise<INotification | null> {
        try {
            if (notificationId) {
                const existNotification = await notification.findById({
                    _id: notificationId,
                });
                const id = existNotification?._id;
                const existNotificationUpdate = await notification
                    .findByIdAndUpdate(
                        { _id: id },
                        { status: data.status,updatedAt: new Date() },
                        { new: true }
                    )
                    .populate("userId")
                    .populate("receiverId")
                    .populate("bookId")
                    .populate("cartId")
                    .exec();

                const newNotification = new notification({
                    userId: data.userId,
                    receiverId: data.receiverId,
                    bookId: data.bookId,
                    cartId: data.cartId,
                    status: data.status,
                });

                const savedNotification = await newNotification.save();

                const value = await notification
                    .findById(savedNotification._id)
                    .populate("userId")
                    .populate("receiverId")
                    .populate("bookId")
                    .populate("cartId")
                    .exec();
                return value;
            } else {
                const newNotification = new notification({
                    userId: data.userId,
                    receiverId: data.receiverId,
                    bookId: data.bookId,
                    cartId: data.cartId,
                    status: data.status,
                });

                const savedNotification = await newNotification.save();

                const value = await notification
                    .findById(savedNotification._id)
                    .populate("userId")
                    .populate("receiverId")
                    .populate("bookId")
                    .populate("cartId")
                    .exec();
                return value;
            }
        } catch (error) {
            console.log("Error createUser:", error);
            throw error;
        }
    }

    async findNotificationsByUserId(userId: string): Promise<INotification[]> {
        try {
            const notifications = await notification
                .find({ receiverId: new mongoose.Types.ObjectId(userId) })
                .populate("userId")
                .populate("receiverId")
                .populate("bookId")
                .populate("cartId")
                .sort({ createdAt: -1 });
            return notifications;
        } catch (error) {
            console.log("Error notificationsByUserId:", error);
            throw error;
        }
    }

    async findUpdateNotificationType(notificationId: string, type: string):Promise<INotification | null> {
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

    async findUnReadNotifications(userId: string):Promise<number> {
        try {
            const notifications = await notification.countDocuments({
                receiverId: userId,
                isRead: false,
            });
            return notifications;
        } catch (error) {
            console.log("Error findUnReadNotifications:", error);
            throw error;
        }
    }

    async findUpdateNotifications(userId: string): Promise<INotification[] | null> {
        try {
            const notifications = await notification.find({ receiverId: userId });
    
            if (notifications.length === 0) {
                return null; 
            }
    
            await notification.updateMany(
                { receiverId: userId },
                { isRead: true }
            );
    
            const notificationList: INotification[] = notifications.map((n) => n.toObject() as INotification);
    
            return notificationList;
        } catch (error) {
            console.log("Error in findUpdateNotifications:", error);
            throw error;
        }
    }
    
}
