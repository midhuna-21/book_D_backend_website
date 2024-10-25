import { IChatRoom } from "../../model/chatRoom";
import { IMessage } from "../../model/message";
import { IChatService } from "./chatServiceInterface";
import { IChatRepository } from "../../respository/chat/chatRepositoryInterface";


export class ChatService implements IChatService{
  
    private chatRepository: IChatRepository;
  
    constructor(chatRepository: IChatRepository) {
      this.chatRepository = chatRepository;
    }
    async getUserMessagesList(userId: string): Promise<IChatRoom[] | null> {
        try {
            return await this.chatRepository.findMessagesList(userId);
        } catch (error) {
            console.log("Error getUserMessagesList:", error);
            throw error;
        }
    }

    async getChatRoomById(chatRoomId: string):Promise<IChatRoom | null> {
        try {
            return await this.chatRepository.findChatRoomById(chatRoomId);
        } catch (error) {
            console.log("Error getChatRoomById:", error);
            throw error;
        }
    }

    async getUpdateChatRoomRead(chatRoomId: string):Promise<{ message: IMessage[]; chat: IChatRoom | null }>  {
        try {
            return await this.chatRepository.findUpdateChatRoomRead(chatRoomId);
        } catch (error) {
            console.log("Error getUpdateChatRoomRead:", error);
            throw error;
        }
    }
    async getUserChat(chatRoomId: string):Promise<IChatRoom[]>  {
        try {
            return await this.chatRepository.findUserChat(chatRoomId);
        } catch (error) {
            console.log("Error getUserChatRoom:", error);
            throw error;
        }
    }

    async getChatRoom(
        userId: string,
        receiverId: string
    ): Promise<IChatRoom | null> {
        try {
            return await this.chatRepository.findChatRoom(userId, receiverId);
        } catch (error) {
            console.log("Error getChatRoom:", error);
            throw error;
        }
    }
    async getCreateChatRoom(
        senderId: string,
        receiverId: string
    ): Promise<IChatRoom | null> {
        try {
            return await this.chatRepository.findCreateChatRoom(senderId, receiverId);
        } catch (error) {
            console.log("Error getAllMessage:", error);
            throw error;
        }
    }

    async getUpdateChatRoom(chatRoomId: string, messageId: string):Promise<IChatRoom | null>  {
        try {
            return await this.chatRepository.findUpdateChatRoom(chatRoomId, messageId);
        } catch (error) {
            console.log("Error gerUpdateChatRoom:", error);
            throw error;
        }
    }

    async getMesssage(messageId: string): Promise<IMessage[] | null> {
        try {
            return await this.chatRepository.findMessage(messageId);
        } catch (error) {
            console.log("Error gerUpdateChatRoom:", error);
            throw error;
        }
    }

    async getAllMessages(chatRoomId: string): Promise<IChatRoom | null> {
        try {
            return await this.chatRepository.findAllMessages(chatRoomId);
        } catch (error) {
            console.log("Error gerUpdateChatRoom:", error);
            throw error;
        }
    }

    async getSendMessage(
        senderId: string,
        receiverId: string,
        content: string,
        chatRoomId: string
    ): Promise<IMessage | null> {
        try {
            return await this.chatRepository.findCreateSendMessage(
                senderId,
                receiverId,
                content,
                chatRoomId
            );
        } catch (error) {
            console.log("Error getSendMessage:", error);
            throw error;
        }
    }

    async getUnReadMessages(userId: string):Promise<number> {
        try {
            return await this.chatRepository.findUnReadMessages(userId);
        } catch (error) {
            console.log("Error getUnReadMessages:", error);
            throw error;
        }
    }
}
