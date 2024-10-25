"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationService = void 0;
class NotificationService {
    constructor(notificationRepository) {
        this.notificationRepository = notificationRepository;
    }
    async getCreateNotification(notificationId, data) {
        try {
            return await this.notificationRepository.findCreateNotification(notificationId, data);
        }
        catch (error) {
            console.log("Error getCreateNotification:", error);
            throw error;
        }
    }
    async getNotificationsByUserId(userId) {
        try {
            return await this.notificationRepository.findNotificationsByUserId(userId);
        }
        catch (error) {
            console.log("Error getNotificationsByUserId:", error);
            throw error;
        }
    }
    async getUpdateNotificationType(notificationId, type) {
        try {
            return await this.notificationRepository.findUpdateNotificationType(notificationId, type);
        }
        catch (error) {
            console.log(error);
            throw error;
        }
    }
    async getUnReadNotifications(userId) {
        try {
            return await this.notificationRepository.findUnReadNotifications(userId);
        }
        catch (error) {
            console.log("Error getUnReadNotifications:", error);
            throw error;
        }
    }
    async getUpdateNotifications(userId) {
        try {
            return await this.notificationRepository.findUpdateNotifications(userId);
        }
        catch (error) {
            console.log("Error getUpdateNotifications:", error);
            throw error;
        }
    }
}
exports.NotificationService = NotificationService;
//# sourceMappingURL=notificationService.js.map