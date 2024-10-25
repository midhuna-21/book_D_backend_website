import { IUser } from '../../model/userModel';
import { IGenre } from '../../model/genresModel';
import { IBooks } from '../../model/bookModel';
import { IAdmin } from '../../model/adminModel';
import { IBookWalletTransaction } from '../../model/bookDWallet';
import { IOrder } from '../../model/orderModel';
import {User,Genre,Admin, Notification} from '../../interfaces/data';
import { INotification } from '../../model/notificationModel';

export interface INotificationRepository {
   findCreateNotification(
      notificationId: string,
      data: Partial<Notification>
  ): Promise<INotification | null>
  findNotificationsByUserId(userId: string): Promise<INotification[]>
  findUpdateNotificationType(notificationId: string, type: string):Promise<INotification | null>
  findUnReadNotifications(userId: string):Promise<number>
  findUpdateNotifications(userId: string):Promise<INotification[] | null>
}
