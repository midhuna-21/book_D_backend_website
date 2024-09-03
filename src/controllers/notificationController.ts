import { Request, Response } from "express";
import { Notification } from "../interfaces/data";
import { AuthenticatedRequest } from "../utils/middleware/authMiddleware";
import { NotificationService } from "../services/notificationService";
import { getSignedImageUrl } from "../utils/imageFunctions/getImageFromS3";

const notificationService = new NotificationService();

const sendNotification = async (req: Request, res: Response) => {
    try {
       
        const { senderId, notificationId, receiverId, bookId, type, content,requestId } =
            req.body;
       
        if (type == "accepted") {
            const notification = await notificationService.getUpdateNotificationType(notificationId,type);
                return res.status(200).json({notification})
        }else if (type === "rejected") {
           const notification= await notificationService.getUpdateNotificationType(notificationId,type);
           return res.status(200).json({notification})
        }
        const data: Notification = {
            senderId,
            receiverId,
            bookId,
            type,
            content,
            requestId
        };
        const notification = await notificationService.getCreateNotification(data);
        return res.status(200).json({ notification });
    } catch (error: any) {
        console.log(error.message);
        return res.status(500).json({ message: "Internal server error" });
    }
};

const notifications = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const userId: string = req.userId!;

        if (!userId) {
            return res
                .status(400)
                .json({ message: "User ID not found in request" });
        }
        const notifications = await notificationService.getNotificationsByUserId(
            userId
        );
        // if(notifications && notifications.length >0){
        //     const updatedNotifications = await Promise.all(

        //         notifications.map(async(notification)=>{
        //         const senderImage = notifications?.senderId?.image
        //         const receiverImage = notifications?.receiverId?.image
        //        if(senderImage){
        //         await getSignedImageUrl(senderImage)
        //        }
        //        if(receiverImage){

        //            await getSignedImageUrl(receiverImage)
        //        }

        //        return notification;
        //     })
        //     )
        //     return res.status(200).json({notifications:updatedNotifications})
        // }else{
        //     return res.status(500).json({notifications:[]})
        // }
        return res.status(200).json({ notifications });
    } catch (error: any) {
        console.log(error.message);
        return res
            .status(500)
            .json({ message: "Internal server error at notifications" });
    }
};

export {
    sendNotification,
    notifications,

};
