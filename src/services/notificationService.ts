import {INotification} from '../model/notificationModel'
import {Notification} from '../interfaces/data'
import { NotificationRepository } from "../respository/notificationRepository";


const notificationRepository =new NotificationRepository()


export class NotificationService{
   
    async getCreateNotification(data:Partial<Notification>):Promise<INotification | null>{
        try{
            return await notificationRepository.createNotification(data)
        }catch(error){
            console.log("Error getCreateNotification:",error);
            throw error
        }
    }

    async   getNotificationsByUserId(userId: string): Promise<INotification[]> {
        try{
            return await notificationRepository.notificationsByUserId(userId)
        }catch(error){
            console.log("Error getNotificationsByUserId:",error);
            throw error
        }
      }

      async getUpdateNotificationType (notificationId:string,type:string){
         try{
             return await notificationRepository.updateNotificationType(notificationId,type)
         }catch(error){
             console.log(error)
             throw error;
         }
      }
}
