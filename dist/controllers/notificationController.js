"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateNotification = exports.unReadNotifications = exports.notifications = exports.sendNotification = void 0;
const index_1 = require("../services/index");
const sendNotification = async (req, res) => {
    try {
        const { userId, receiverId, cartId, notificationId, bookId, status } = req.body;
        const data = {
            userId,
            receiverId,
            bookId,
            cartId,
            status,
        };
        const notification = await index_1.notificationService.getCreateNotification(notificationId, data);
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
        const notifications = await index_1.notificationService.getNotificationsByUserId(userId);
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
const unReadNotifications = async (req, res) => {
    try {
        const { userId } = req.params;
        if (!userId) {
            return res.status(400).json({ message: "User Id not found" });
        }
        const notifications = await index_1.notificationService.getUnReadNotifications(userId);
        return res.status(200).json({ count: notifications });
    }
    catch (error) {
        console.log("Error unReadNotifications:", error);
        return res
            .status(500)
            .json({ message: "Internal server error at unReadNotifications" });
    }
};
exports.unReadNotifications = unReadNotifications;
const updateNotification = async (req, res) => {
    try {
        const userId = req.userId;
        if (!userId) {
            return res.status(400).json({ message: "User Id not found" });
        }
        const notifications = await index_1.notificationService.getUpdateNotifications(userId);
        return res.status(200).json({ notifications });
    }
    catch (error) {
        console.log("Error unReadNotifications:", error);
        return res
            .status(500)
            .json({ message: "Internal server error at unReadNotifications" });
    }
};
exports.updateNotification = updateNotification;
//# sourceMappingURL=notificationController.js.map