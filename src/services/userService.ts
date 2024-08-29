import { UserRepository } from "../respository/userRepository";
import { userData } from "../utils/ReuseFunctions/interface/data";
import {Books, ChatRoom, User,Requests, Order} from '../interfaces/data'
import {IUser, user} from '../model/userModel'
import {IBooks} from '../model/bookModel'
import {INotification} from '../model/notificationModel'
import {Notification} from '../interfaces/data'
import { Types } from "mongoose";
import { IMessage } from "../model/message";
import { chatRoom, IChatRoom } from "../model/chatRoom";
import { IRequests } from "../model/requests";


const userRepository =new UserRepository()


export class UserService{
    async getCreateUser(data:Partial<User>):Promise<IUser | null>{
        try{
            return await userRepository.createUser(data)
        }catch(error){
            console.log("Error getUserByGmail:",error);
            throw error
        }
    } 
    async getDeleteUserImage(userId:string):Promise<IUser | null>{
        try{
            const user = await userRepository.deleteUserImage(userId)
            return user
        }catch(error){
            console.log('Error getDeleteUserImage:',error)
            throw error
        } 
    }
    async getUserByEmail(email:string):Promise<IUser | null>{
        try{
            return await userRepository.findUserByEmail(email)
        }catch(error){
            console.log("Error getByEmail:",error);
            throw error
        }
    }

    async getUserByGmail(email:string):Promise<IUser | null>{
        try{
            return await userRepository.findByGmail(email)
        }catch(error){
            console.log("Error getUserByGmail:",error);
            throw error
        }
    }
    async getUpdateIsGoogleTrue(email:string){
        try{
            return await userRepository.findUpdateIsGoogleTrue(email)
        }catch(error:any){
            console.log("Error getUpdateIsGoogleTrue:",error)
            throw error
        }
    }
    async getUserByName(name:string):Promise<IUser | null>{
        try{
            return await userRepository.findByUserName(name)
        }catch(error){
            console.log("Error getUserByName:",error);
            throw error
        }
    }

    async getCreateUserByGoogle(data:User):Promise<IUser | null>{
        try{
            return await userRepository.createUserByGoogle(data)
        }catch(error){
            console.log("Error getCreateUserByGoogle:",error);
            throw error
        }
    }
    async getUpdatePassword(data:User):Promise<IUser | null>{
        try{
            return await userRepository.updatePassword(data)
        }catch(error){
            console.log("Error getUpdatePassword:",error);
            throw error
        }
    }
   

    async getAddToBookRent(bookRentData:Books):Promise<IBooks | null>{
        try{
            return await userRepository.addToBookRent(bookRentData)
        }catch(error){
            console.log("Error getAddToBookRent:",error);
            throw error
        }
    }
    async getAddToBookSell(bookSelldata:Books):Promise<IBooks | null>{
        try{
            return await userRepository.addToBookSell(bookSelldata)
        }catch(error){
            console.log("Error getAddToBookSell:",error);
            throw error
        }
    }

    async getSaveRequest(data:Requests):Promise<IRequests | null>{
        try{
            return await userRepository.addSaveRequest(data)
        }catch(error){
            console.log("Error getSaveRequest:",error)
            throw error;
        }
    }
    async getUserById(lenderId:string):Promise<IUser | null>{
        try{
         
            return await userRepository.findUserById(lenderId)
          
        }catch(error){
            console.log("Error getUserById:",error);
            throw error
        }
    }


    async getAllGenres(){
        try{
            return await userRepository.findAllGenres()
        }catch(error){
            console.log("Error getAllGenres:",error);
            throw error
        }
    }
    async getAllBooks(){
        try{
            return await userRepository.findAllBooks()
        }catch(error){
            console.log("Error getAllBooks:",error);
            throw error
        }
    }
    async getUpdateUser(userId:string,filteredUser:User):Promise<IUser | null>{
        try{
            return await userRepository.updateUser(userId,filteredUser)
        }catch(error){
            console.log("Error getUpdateUser:",error);
            throw error
        }
    }
    async getBookById(bookId:string): Promise<IBooks | null> {
        try{
            return await userRepository.findBook(bookId)
        }catch(error:any){
            console.log("Error getBook:",error)
            throw error
        }
    }
    async getCreateNotification(data:Partial<Notification>):Promise<INotification | null>{
        try{
            return await userRepository.createNotification(data)
        }catch(error){
            console.log("Error getCreateNotification:",error);
            throw error
        }
    }

    async   getNotificationsByUserId(userId: string): Promise<INotification[]> {
        try{
            return await userRepository.notificationsByUserId(userId)
        }catch(error){
            console.log("Error getNotificationsByUserId:",error);
            throw error
        }
    }

    // async getCreateMessage(data:Partial<Message>):Promise<IMessage| null>{
    //     try{
    //         return await userRepository.createMessage(data)
    //     }catch(error){
    //         console.log("Error getCreateChat:",error);
    //         throw error
    //     }
    // }

    async getUserMessagesList(userId:string):Promise<IChatRoom[] | null>{
        try{
            return await userRepository.MessagesList(userId)
        }catch(error){
            console.log("Error getUserMessagesList:",error)
            throw error
        }
    }
    async getUserChat(chatRoomId:string){
        try{
            return await userRepository.findUserChat(chatRoomId)
 
        }catch(error){
            console.log("Error getUserChatRoom:",error)
            throw error
        }
    }
    async getActiveUsers(){
        try{
           return await userRepository.activeUsers()
        }catch(error){
           console.log("Error getAllUsers:",error);
           throw error
     }
     }

     async getUpdateNotificationType (notificationId:string){
        try{
            return await userRepository.updateNotificationType(notificationId)
        }catch(error){
            console.log(error)
            throw error;
        }
     }

     async getChatRoom (userId:string,receiverId:string):Promise<IChatRoom | null>{
        try{
            return await  userRepository.findChatRoom(userId,receiverId)
        }catch(error){
            console.log("Error getChatRoom:",error)
            throw error;
        }
     }
     async getCreateChatRoom(senderId:string,receiverId:string):Promise<IChatRoom | null>{
        try{
            return await userRepository.createChatRoom(senderId,receiverId)
        }catch(error){
            console.log("Error getAllMessage:",error)
            throw error
        }
     }

     async getUpdateChatRoom(chatRoomId:string,messageId:string){
        try{
            return await userRepository.updateChatRoom(chatRoomId,messageId)

        }catch(error){
            console.log("Error gerUpdateChatRoom:",error)
            throw error;
        }
     }

     async getMesssage(messageId:string):Promise<IMessage[] | null>{
        try{
      
            return await userRepository.findMessage(messageId)

        }catch(error){
            console.log("Error gerUpdateChatRoom:",error)
            throw error;
        }
     }

     async getAllMessages(chatRoomId:string):Promise<IChatRoom | null>{
        try{
      
            return await userRepository.findAllMessages(chatRoomId)

        }catch(error){
            console.log("Error gerUpdateChatRoom:",error)
            throw error;
        }
     }

     async getSendMessage(senderId:string,receiverId:string,content:string,chatRoomId:string):Promise<IMessage | null>{
        try{
            return await userRepository.createSendMessage(senderId,receiverId,content,chatRoomId)
        }catch(error){
            console.log("Error getSendMessage:",error)
            throw error
        }
     }
     async getUpdateProfileImage(userId:string,imageUrl:string): Promise<IUser | null>{
        try{
            return await userRepository.updateProfileImage(userId,imageUrl)
        }catch(error){
            console.log("Error getUpdateProfileImage:",error)
            throw error
        }
     }
     async getCheckRequest(userId:string,bookId:string): Promise<Boolean>{
        try{
            return await userRepository.findCheckRequest(userId,bookId)
        }catch(error){
            console.log("Error getCheckRequest:",error)
            throw error
        }
     }
     
     async getCheckAccepted(userId:string,bookId:string): Promise<Boolean>{
        try{
            return await userRepository.findCheckAccept(userId,bookId)
        }catch(error){
            console.log("Error getUpdateProfileImage:",error)
            throw error
        }
     }

     async getSaveToken (userId:string,resetToken:string,resetTokenExpiration:number){
        try{
            return await userRepository.saveToken(userId,resetToken,resetTokenExpiration)
        }catch(error){
            console.log("Error saveToken:",error)
        }
     }
     
     async getUpdateIsGoogle(gmail:string,resetToken:string,resetTokenExpiration:number){
        try{
            return await userRepository.updateIsGoogle(gmail,resetToken,resetTokenExpiration)
        }catch(error){
            console.log("Error getUpdateIsGoogle:",error)
            throw error
        }
     }

     async getRequestById(requestId:string){
        try{
            console.log(requestId,'requestId')
            return await userRepository.findRequestById(requestId)
        }catch(error){
            console.log("Error getRequestById:",error)
            throw error
        }
    }

    async getAcceptRequest(requestId:string,types:string){
        try{
            return await userRepository.findAcceptRequest(requestId,types)
        }catch(error){
            console.log("Error getAcceptRequest:",error)
            throw error
        }
    }

    async getRequestDetails(requestId:string){
        try{
            return await userRepository.findRequestDetails(requestId)
        }catch(error){
            console.log("Error getRequestDetails:",error)
            throw error
        }
    }

    async getCreateOrderProcess(data:Order){
        try{
            return await userRepository.findCreateOrderProcess(data)
        }catch(error){
            console.log("Error getCreateOrderProcess:",error)
            throw error
        }
    }
    async getCreateOrder(userId:string,bookId:string){
        try{
            return await userRepository.findCreateOrder(userId,bookId)
        }catch(error){
            console.log("Error getCreateOrder:",error)
            throw error
        }
    }

    async getOrders(userId:string){
        try{
            return await userRepository.findOrders(userId)
        }catch(error){
            console.log("Error getOrders:",error)
            throw error
        }
    }
    async getUpdateRequest(requestId:string){
        try{
            return await userRepository.findUpdateRequest(requestId)
        }catch(error){
            console.log("Error getUpdateRequest:",error)
            throw error
        }
    }
}
