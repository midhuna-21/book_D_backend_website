import { Request, Response } from "express";
import { Notification } from "../interfaces/data";
import { AuthenticatedRequest } from "../utils/middleware/authMiddleware";
import { NotificationService } from "../services/notificationService";
import { getSignedImageUrl } from "../utils/imageFunctions/getImageFromS3";

const notificationService = new NotificationService();

const sendNotification = async (req: Request, res: Response) => {
    try {
       
        const { userId, ownerId, cartId,notificationId,bookId, status } =
            req.body;
        const data: Notification = {
            userId,
            ownerId,
            bookId,
            cartId,
            status,
          
        };
        const notification = await notificationService.getCreateNotification(notificationId,data);
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
