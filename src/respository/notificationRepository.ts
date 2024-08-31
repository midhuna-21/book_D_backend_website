import { notification, INotification } from "../model/notificationModel";
import { Notification } from "../interfaces/data";
import mongoose from "mongoose";

export class NotificationRepository {
    async createNotification(
        data: Partial<Notification>
    ): Promise<INotification | null> {
        try {
            console.log(data.bookId);
            return new notification({
                senderId: data.senderId,
                receiverId: data.receiverId,
                bookId: data.bookId,
                type: data.type,
                content: data.content,
                requestId: data.requestId,
            }).save();
        } catch (error) {
            console.log("Error createUser:", error);
            throw error;
        }
    }

    async notificationsByUserId(userId: string): Promise<INotification[]> {
        try {
            const notifications = await notification
                .find({ receiverId: new mongoose.Types.ObjectId(userId) })
                .populate("senderId")
                .populate("receiverId")
                .populate("bookId")
                .populate("requestId")
                .sort({ createdAt: -1 })

            return notifications;
        } catch (error) {
            console.log("Error notificationsByUserId:", error);
            throw error;
        }
    }

    async updateNotificationType(notificationId: string,type:string) {
        try {
            if(type=="accepted"){

                const update = await notification.findByIdAndUpdate(
                    notificationId,
                    { isAccepted: true,isRejected:false },
                    { new: true }
                );
                return update;
            }else{
                const update = await notification.findByIdAndUpdate(
                    notificationId,
                    { isReject: true ,isAccepted:false},
                    { new: true }
                );
                return update
            }
        } catch (error) {
            console.log("Error updateNotificationType:", error);
            throw error;
        }
    }

    
}
