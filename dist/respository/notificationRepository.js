"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationRepository = void 0;
const notificationModel_1 = require("../model/notificationModel");
const mongoose_1 = __importDefault(require("mongoose"));
class NotificationRepository {
    async createNotification(notificationId, data) {
        try {
            if (notificationId) {
                const existnotification = await notificationModel_1.notification.findById({
                    _id: notificationId,
                });
                const id = existnotification?._id;
                return await notificationModel_1.notification
                    .findByIdAndUpdate({ _id: id }, { status: data.status }, { new: true })
                    .populate('userId')
                    .populate('ownerId')
                    .populate('bookId')
                    .populate("cartId")
                    .exec();
            }
            else {
                const newNotification = new notificationModel_1.notification({
                    userId: data.userId,
                    ownerId: data.ownerId,
                    bookId: data.bookId,
                    cartId: data.cartId,
                    status: data.status,
                });
                const savedNotification = await newNotification.save();
                const value = await notificationModel_1.notification
                    .findById(savedNotification._id)
                    .populate('userId')
                    .populate('ownerId')
                    .populate('bookId')
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
    async notificationsByUserId(userId) {
        try {
            const notifications = await notificationModel_1.notification
                .find({
                $or: [
                    { userId: new mongoose_1.default.Types.ObjectId(userId) },
                    { ownerId: new mongoose_1.default.Types.ObjectId(userId) }
                ]
            })
                .populate("userId")
                .populate("ownerId")
                .populate("bookId")
                .populate("cartId")
                .sort({ createdAt: -1 });
            return notifications;
        }
        catch (error) {
            console.log("Error notificationsByUserId:", error);
            throw error;
        }
    }
    async updateNotificationType(notificationId, type) {
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
}
exports.NotificationRepository = NotificationRepository;
//# sourceMappingURL=notificationRepository.js.map