"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationService = void 0;
const notificationRepository_1 = require("../respository/notificationRepository");
const notificationRepository = new notificationRepository_1.NotificationRepository();
class NotificationService {
    async getCreateNotification(notificationId, data) {
        try {
            return await notificationRepository.createNotification(notificationId, data);
        }
        catch (error) {
            console.log("Error getCreateNotification:", error);
            throw error;
        }
    }
    async getNotificationsByUserId(userId) {
        try {
            return await notificationRepository.notificationsByUserId(userId);
        }
        catch (error) {
            console.log("Error getNotificationsByUserId:", error);
            throw error;
        }
    }
    async getUpdateNotificationType(notificationId, type) {
        try {
            return await notificationRepository.updateNotificationType(notificationId, type);
        }
        catch (error) {
            console.log(error);
            throw error;
        }
    }
    async getUnReadNotifications(userId) {
        try {
            return await notificationRepository.findUnReadNotifications(userId);
        }
        catch (error) {
            console.log("Error getUnReadNotifications:", error);
            throw error;
        }
    }
    async getUpdateNotifications(userId) {
        try {
            return await notificationRepository.findUpdateNotifications(userId);
        }
        catch (error) {
            console.log("Error getUpdateNotifications:", error);
            throw error;
        }
    }
}
exports.NotificationService = NotificationService;
//# sourceMappingURL=notificationService.js.map