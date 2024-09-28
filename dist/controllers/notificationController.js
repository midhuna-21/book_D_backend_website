"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notifications = exports.sendNotification = void 0;
const notificationService_1 = require("../services/notificationService");
const notificationService = new notificationService_1.NotificationService();
const sendNotification = async (req, res) => {
    try {
        const { userId, ownerId, cartId, notificationId, bookId, status } = req.body;
        const data = {
            userId,
            ownerId,
            bookId,
            cartId,
            status,
        };
        const notification = await notificationService.getCreateNotification(notificationId, data);
        return res.status(200).json({ notification });
    }
    catch (error) {
        console.log(error.message);
        return res.status(500).json({ message: "Internal server error" });
    }
};
exports.sendNotification = sendNotification;
const notifications = async (req, res) => {
    try {
        const userId = req.userId;
        if (!userId) {
            return res
                .status(400)
                .json({ message: "User ID not found in request" });
        }
        const notifications = await notificationService.getNotificationsByUserId(userId);
        return res.status(200).json({ notifications });
    }
    catch (error) {
        console.log(error.message);
        return res
            .status(500)
            .json({ message: "Internal server error at notifications" });
    }
};
exports.notifications = notifications;
//# sourceMappingURL=notificationController.js.map