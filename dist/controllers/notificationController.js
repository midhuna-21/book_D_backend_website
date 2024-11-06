"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserNotificationStatusIsRead = exports.fetchUnreadNotifications = exports.fetchUserNotifications = exports.sendNotification = void 0;
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
const fetchUserNotifications = async (req, res) => {
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
exports.fetchUserNotifications = fetchUserNotifications;
const fetchUnreadNotifications = async (req, res) => {
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
exports.fetchUnreadNotifications = fetchUnreadNotifications;
const updateUserNotificationStatusIsRead = async (req, res) => {
    try {
        const userId = req.userId;
        if (!userId) {
            return res.status(400).json({ message: "User Id not found" });
        }
        const notifications = await index_1.notificationService.getUpdateNotificationsIsread(userId);
        return res.status(200).json({ notifications });
    }
    catch (error) {
        console.log("Error unReadNotifications:", error);
        return res
            .status(500)
            .json({ message: "Internal server error at unReadNotifications" });
    }
};
exports.updateUserNotificationStatusIsRead = updateUserNotificationStatusIsRead;
//# sourceMappingURL=notificationController.js.map