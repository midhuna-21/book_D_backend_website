import { Request, Response } from "express";
import { UserService } from "../services/userService";
import { Notification } from "../interfaces/data";
import { AuthenticatedRequest } from "../utils/middleware/authMiddleware";

const userService = new UserService();

const sendNotification = async (req: Request, res: Response) => {
    try {
       
        const { senderId, notificationId, receiverId, bookId, type, content,requestId } =
            req.body;
        if (type == "accepted") {
            const notificationUpdate =
                await userService.getUpdateNotificationType(notificationId);
        }
        const data: Notification = {
            senderId,
            receiverId,
            bookId,
            type,
            content,
            requestId
        };
        const notification = await userService.getCreateNotification(data);
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
        const notifications = await userService.getNotificationsByUserId(
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
