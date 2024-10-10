import {INotification} from '../model/notificationModel'
import {Notification} from '../interfaces/data'
import { NotificationRepository } from "../respository/notificationRepository";


const notificationRepository =new NotificationRepository()


export class NotificationService{
   
    async getCreateNotification(notificationId:string,
        data: Partial<Notification>
    ): Promise<INotification | null> {
        try {
            return await notificationRepository.createNotification(notificationId,data)
        }catch(error){
            console.log("Error getCreateNotification:",error);
            throw error
        }
    }

    async  getNotificationsByUserId(userId: string): Promise<INotification[]> {
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

      async getUnReadNotifications(userId:string){
        try{
            return await notificationRepository.findUnReadNotifications(userId)
        }catch(error){
            console.log("Error getUnReadNotifications:",error)
            throw error
        }
     }

     async getUpdateNotifications(userId:string){
        try{
            return await notificationRepository.findUpdateNotifications(userId)
        }catch(error){
            console.log("Error getUpdateNotifications:",error)
            throw error
        }
     }
}
