import { IChatRoom } from "../model/chatRoom";
import { IMessage } from "../model/message";
import { ChatRepository } from "../respository/chatRepository";


const chatRepository =new ChatRepository()


export class ChatService{

    async getUserMessagesList(userId:string):Promise<IChatRoom[] | null>{
        try{
            return await chatRepository.MessagesList(userId)
        }catch(error){
            console.log("Error getUserMessagesList:",error)
            throw error
        }
    }

    async getChatRoomById(chatRoomId:string){
        try{
            return await chatRepository.findChatRoomById(chatRoomId)
        }catch(error){
            console.log("Error getChatRoomById:",error)
            throw error
        }
    }

   

    async getUpdateChatRoomRead(chatRoomId:string){
        try{
            return await chatRepository.findUpdateChatRoomRead(chatRoomId)
        }catch(error){
            console.log("Error getUpdateChatRoomRead:",error)
            throw error
        }
    }
    async getUserChat(chatRoomId:string){
        try{
            return await chatRepository.findUserChat(chatRoomId)
 
        }catch(error){
            console.log("Error getUserChatRoom:",error)
            throw error
        }
    }

     async getChatRoom (userId:string,receiverId:string):Promise<IChatRoom | null>{
        try{
            return await  chatRepository.findChatRoom(userId,receiverId)
        }catch(error){
            console.log("Error getChatRoom:",error)
            throw error;
        }
     }
     async getCreateChatRoom(senderId:string,receiverId:string):Promise<IChatRoom | null>{
        try{
            return await chatRepository.createChatRoom(senderId,receiverId)
        }catch(error){
            console.log("Error getAllMessage:",error)
            throw error
        }
     }

     async getUpdateChatRoom(chatRoomId:string,messageId:string){
        try{
            return await chatRepository.updateChatRoom(chatRoomId,messageId)

        }catch(error){
            console.log("Error gerUpdateChatRoom:",error)
            throw error;
        }
     }

     async getMesssage(messageId:string):Promise<IMessage[] | null>{
        try{
      
            return await chatRepository.findMessage(messageId)

        }catch(error){
            console.log("Error gerUpdateChatRoom:",error)
            throw error;
        }
     }

     async getAllMessages(chatRoomId:string):Promise<IChatRoom | null>{
        try{
      
            return await chatRepository.findAllMessages(chatRoomId)

        }catch(error){
            console.log("Error gerUpdateChatRoom:",error)
            throw error;
        }
     }

     async getSendMessage(senderId:string,receiverId:string,content:string,chatRoomId:string):Promise<IMessage | null>{
        try{
            return await chatRepository.createSendMessage(senderId,receiverId,content,chatRoomId)
        }catch(error){
            console.log("Error getSendMessage:",error)
            throw error
        }
     }

     async getUnReadMessages(userId:string){
        try{
            return await chatRepository.findUnReadMessages(userId)
        }catch(error){
            console.log("Error getUnReadMessages:",error)
            throw error
        }
     }
   
}
