
import { Notification } from "../../interfaces/data";
import { INotification } from "../../model/notificationModel";

export interface INotificationRepository {
    findCreateNotification(
        notificationId: string,
        data: Partial<Notification>
    ): Promise<INotification | null>;
    findNotificationsByUserId(userId: string): Promise<INotification[]>;
    findUpdateNotificationType(
        notificationId: string,
        type: string
    ): Promise<INotification | null>;
    findUnReadNotifications(userId: string): Promise<number>;
    findUpdateNotificationsIsread(userId: string): Promise<INotification[] | null>;
}
