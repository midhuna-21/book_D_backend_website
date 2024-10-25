import { Notification } from '../../interfaces/data';
import { INotification } from '../../model/notificationModel';

export interface INotificationService {
   getCreateNotification(notificationId: string,data: Partial<Notification>): Promise<INotification | null>
  getNotificationsByUserId(userId: string): Promise<INotification[]>
  getUpdateNotificationType(notificationId: string, type: string):Promise<INotification | null>
  getUnReadNotifications(userId: string):Promise<number>
  getUpdateNotifications(userId: string): Promise<INotification[] | null>
}
