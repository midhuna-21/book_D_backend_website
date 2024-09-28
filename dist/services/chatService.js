"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatService = void 0;
const chatRepository_1 = require("../respository/chatRepository");
const chatRepository = new chatRepository_1.ChatRepository();
class ChatService {
    async getUserMessagesList(userId) {
        try {
            return await chatRepository.MessagesList(userId);
        }
        catch (error) {
            console.log("Error getUserMessagesList:", error);
            throw error;
        }
    }
    async getChatRoomById(chatRoomId) {
        try {
            return await chatRepository.findChatRoomById(chatRoomId);
        }
        catch (error) {
            console.log("Error getChatRoomById:", error);
            throw error;
        }
    }
    async getUpdateChatRoomRead(chatRoomId) {
        try {
            return await chatRepository.findUpdateChatRoomRead(chatRoomId);
        }
        catch (error) {
            console.log("Error getUpdateChatRoomRead:", error);
            throw error;
        }
    }
    async getUserChat(chatRoomId) {
        try {
            return await chatRepository.findUserChat(chatRoomId);
        }
        catch (error) {
            console.log("Error getUserChatRoom:", error);
            throw error;
        }
    }
    async getChatRoom(userId, receiverId) {
        try {
            return await chatRepository.findChatRoom(userId, receiverId);
        }
        catch (error) {
            console.log("Error getChatRoom:", error);
            throw error;
        }
    }
    async getCreateChatRoom(senderId, receiverId) {
        try {
            return await chatRepository.createChatRoom(senderId, receiverId);
        }
        catch (error) {
            console.log("Error getAllMessage:", error);
            throw error;
        }
    }
    async getUpdateChatRoom(chatRoomId, messageId) {
        try {
            return await chatRepository.updateChatRoom(chatRoomId, messageId);
        }
        catch (error) {
            console.log("Error gerUpdateChatRoom:", error);
            throw error;
        }
    }
    async getMesssage(messageId) {
        try {
            return await chatRepository.findMessage(messageId);
        }
        catch (error) {
            console.log("Error gerUpdateChatRoom:", error);
            throw error;
        }
    }
    async getAllMessages(chatRoomId) {
        try {
            return await chatRepository.findAllMessages(chatRoomId);
        }
        catch (error) {
            console.log("Error gerUpdateChatRoom:", error);
            throw error;
        }
    }
    async getSendMessage(senderId, receiverId, content, chatRoomId) {
        try {
            return await chatRepository.createSendMessage(senderId, receiverId, content, chatRoomId);
        }
        catch (error) {
            console.log("Error getSendMessage:", error);
            throw error;
        }
    }
    async getUnReadMessages(userId) {
        try {
            return await chatRepository.findUnReadMessages(userId);
        }
        catch (error) {
            console.log("Error getUnReadMessages:", error);
            throw error;
        }
    }
}
exports.ChatService = ChatService;
//# sourceMappingURL=chatService.js.map