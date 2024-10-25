import { Request, Response } from "express";
import { Notification } from "../interfaces/data";
import { AuthenticatedRequest } from "../utils/middleware/userAuthMiddleware";
import { notificationService } from "../services/index";

const sendNotification = async (req: Request, res: Response) => {
    try {
        const { userId, receiverId, cartId, notificationId, bookId, status } =
            req.body;
        const data: Notification = {
            userId,
            receiverId,
            bookId,
            cartId,
            status,
        };
        const notification = await notificationService.getCreateNotification(
            notificationId,
            data
        );
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
        const notifications =
            await notificationService.getNotificationsByUserId(userId);
        return res.status(200).json({ notifications });
    } catch (error: any) {
        console.log(error.message);
        return res
            .status(500)
            .json({ message: "Internal server error at notifications" });
    }
};

const unReadNotifications = async (req: Request, res: Response) => {
    try {
        const { userId } = req.params;
        if (!userId) {
            return res.status(400).json({ message: "User Id not found" });
        }
        const notifications = await notificationService.getUnReadNotifications(
            userId
        );
        return res.status(200).json({ count: notifications });
    } catch (error: any) {
        console.log("Error unReadNotifications:", error);
        return res
            .status(500)
            .json({ message: "Internal server error at unReadNotifications" });
    }
};

const updateNotification = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const userId = req.userId;
        if (!userId) {
            return res.status(400).json({ message: "User Id not found" });
        }
        const notifications = await notificationService.getUpdateNotifications(
            userId
        );
        return res.status(200).json({ notifications });
    } catch (error: any) {
        console.log("Error unReadNotifications:", error);
        return res
            .status(500)
            .json({ message: "Internal server error at unReadNotifications" });
    }
};

export {
    sendNotification,
    notifications,
    unReadNotifications,
    updateNotification,
};
