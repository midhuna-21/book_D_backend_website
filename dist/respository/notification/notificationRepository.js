"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationRepository = void 0;
const notificationModel_1 = require("../../model/notificationModel");
const mongoose_1 = __importDefault(require("mongoose"));
class NotificationRepository {
    async findCreateNotification(notificationId, data) {
        try {
            if (notificationId) {
                const existNotification = await notificationModel_1.notification.findById({
                    _id: notificationId,
                });
                const id = existNotification?._id;
                const existNotificationUpdate = await notificationModel_1.notification
                    .findByIdAndUpdate({ _id: id }, { status: data.status }, { new: true })
                    .populate("userId")
                    .populate("receiverId")
                    .populate("bookId")
                    .populate("cartId")
                    .exec();
                const newNotification = new notificationModel_1.notification({
                    userId: data.userId,
                    receiverId: data.receiverId,
                    bookId: data.bookId,
                    cartId: data.cartId,
                    status: data.status,
                });
                const savedNotification = await newNotification.save();
                const value = await notificationModel_1.notification
                    .findById(savedNotification._id)
                    .populate("userId")
                    .populate("receiverId")
                    .populate("bookId")
                    .populate("cartId")
                    .exec();
                return value;
            }
            else {
                const newNotification = new notificationModel_1.notification({
                    userId: data.userId,
                    receiverId: data.receiverId,
                    bookId: data.bookId,
                    cartId: data.cartId,
                    status: data.status,
                });
                const savedNotification = await newNotification.save();
                const value = await notificationModel_1.notification
                    .findById(savedNotification._id)
                    .populate("userId")
                    .populate("receiverId")
                    .populate("bookId")
                    .populate("cartId")
                    .exec();
                return value;
            }
        }
        catch (error) {
            console.log("Error createUser:", error);
            throw error;
        }
    }
    async findNotificationsByUserId(userId) {
        try {
            const notifications = await notificationModel_1.notification
                .find({ receiverId: new mongoose_1.default.Types.ObjectId(userId) })
                .populate("userId")
                .populate("receiverId")
                .populate("bookId")
                .populate("cartId")
                .sort({ updatedAt: -1 });
            return notifications;
        }
        catch (error) {
            console.log("Error notificationsByUserId:", error);
            throw error;
        }
    }
    async findUpdateNotificationType(notificationId, type) {
        try {
            if (type == "accepted") {
                const update = await notificationModel_1.notification.findByIdAndUpdate(notificationId, { isAccepted: true, isRejected: false }, { new: true });
                return update;
            }
            else {
                const update = await notificationModel_1.notification.findByIdAndUpdate(notificationId, { isReject: true, isAccepted: false }, { new: true });
                return update;
            }
        }
        catch (error) {
            console.log("Error updateNotificationType:", error);
            throw error;
        }
    }
    async findUnReadNotifications(userId) {
        try {
            const notifications = await notificationModel_1.notification.countDocuments({
                receiverId: userId,
                isRead: false,
            });
            return notifications;
        }
        catch (error) {
            console.log("Error findUnReadNotifications:", error);
            throw error;
        }
    }
    async findUpdateNotifications(userId) {
        try {
            const notifications = await notificationModel_1.notification.find({ receiverId: userId });
            if (notifications.length === 0) {
                return null;
            }
            await notificationModel_1.notification.updateMany({ receiverId: userId }, { isRead: true });
            const notificationList = notifications.map((n) => n.toObject());
            return notificationList;
        }
        catch (error) {
            console.log("Error in findUpdateNotifications:", error);
            throw error;
        }
    }
}
exports.NotificationRepository = NotificationRepository;
//# sourceMappingURL=notificationRepository.js.map