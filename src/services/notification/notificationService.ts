import { INotification } from "../../model/notificationModel";
import { Notification } from "../../interfaces/data";
import { INotificationService } from "./notificationServiceInterface";
import { INotificationRepository } from "../../respository/notification/notificationRepositoryInterface";

export class NotificationService implements INotificationService {
    private notificationRepository: INotificationRepository;

    constructor(notificationRepository: INotificationRepository) {
        this.notificationRepository = notificationRepository;
    }
    async getCreateNotification(
        notificationId: string,
        data: Partial<Notification>
    ): Promise<INotification | null> {
        try {
            return await this.notificationRepository.findCreateNotification(
                notificationId,
                data
            );
        } catch (error) {
            console.log("Error getCreateNotification:", error);
            throw error;
        }
    }

    async getNotificationsByUserId(userId: string): Promise<INotification[]> {
        try {
            return await this.notificationRepository.findNotificationsByUserId(
                userId
            );
        } catch (error) {
            console.log("Error getNotificationsByUserId:", error);
            throw error;
        }
    }

    async getUpdateNotificationType(
        notificationId: string,
        type: string
    ): Promise<INotification | null> {
        try {
            return await this.notificationRepository.findUpdateNotificationType(
                notificationId,
                type
            );
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    async getUnReadNotifications(userId: string): Promise<number> {
        try {
            return await this.notificationRepository.findUnReadNotifications(
                userId
            );
        } catch (error) {
            console.log("Error getUnReadNotifications:", error);
            throw error;
        }
    }

    async getUpdateNotificationsIsread(
        userId: string
    ): Promise<INotification[] | null> {
        try {
            return await this.notificationRepository.findUpdateNotificationsIsread(
                userId
            );
        } catch (error) {
            console.log("Error getUpdateNotifications:", error);
            throw error;
        }
    }
}
