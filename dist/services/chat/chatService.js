"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatService = void 0;
class ChatService {
    constructor(chatRepository) {
        this.chatRepository = chatRepository;
    }
    async getUserMessagesList(userId) {
        try {
            return await this.chatRepository.findUserMessagesList(userId);
        }
        catch (error) {
            console.log("Error getUserMessagesList:", error);
            throw error;
        }
    }
    async getChatRoomById(chatRoomId) {
        try {
            return await this.chatRepository.findChatRoomById(chatRoomId);
        }
        catch (error) {
            console.log("Error getChatRoomById:", error);
            throw error;
        }
    }
    async getUpdateChatRoomRead(chatRoomId) {
        try {
            return await this.chatRepository.findUpdateChatRoomRead(chatRoomId);
        }
        catch (error) {
            console.log("Error getUpdateChatRoomRead:", error);
            throw error;
        }
    }
    async getUserChat(chatRoomId) {
        try {
            return await this.chatRepository.findUserChat(chatRoomId);
        }
        catch (error) {
            console.log("Error getUserChatRoom:", error);
            throw error;
        }
    }
    async getChatRoom(userId, receiverId) {
        try {
            return await this.chatRepository.findChatRoom(userId, receiverId);
        }
        catch (error) {
            console.log("Error getChatRoom:", error);
            throw error;
        }
    }
    async getCreateChatRoom(senderId, receiverId) {
        try {
            return await this.chatRepository.findCreateChatRoom(senderId, receiverId);
        }
        catch (error) {
            console.log("Error getAllMessage:", error);
            throw error;
        }
    }
    async getUpdateChatRoom(chatRoomId, messageId) {
        try {
            return await this.chatRepository.findUpdateChatRoom(chatRoomId, messageId);
        }
        catch (error) {
            console.log("Error gerUpdateChatRoom:", error);
            throw error;
        }
    }
    async getMesssage(messageId) {
        try {
            return await this.chatRepository.findMessage(messageId);
        }
        catch (error) {
            console.log("Error gerUpdateChatRoom:", error);
            throw error;
        }
    }
    async getAllMessages(chatRoomId) {
        try {
            return await this.chatRepository.findAllMessages(chatRoomId);
        }
        catch (error) {
            console.log("Error gerUpdateChatRoom:", error);
            throw error;
        }
    }
    async getSendMessage(senderId, receiverId, content, chatRoomId) {
        try {
            return await this.chatRepository.findCreateSendMessage(senderId, receiverId, content, chatRoomId);
        }
        catch (error) {
            console.log("Error getSendMessage:", error);
            throw error;
        }
    }
    async getUnReadMessages(userId) {
        try {
            return await this.chatRepository.findUnReadMessages(userId);
        }
        catch (error) {
            console.log("Error getUnReadMessages:", error);
            throw error;
        }
    }
}
exports.ChatService = ChatService;
//# sourceMappingURL=chatService.js.map