"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.unReadMessages = exports.allMessages = exports.sendMessage = exports.chat = exports.userMessagesList = exports.updateChatRoomRead = exports.createChatRoom = exports.messageCreation = void 0;
const chatService_1 = require("../services/chatService");
const chatService = new chatService_1.ChatService();
const createChatRoom = async (req, res) => {
    try {
        const { senderId, receiverId } = req.body;
        if (!senderId || !receiverId) {
            return res
                .status(400)
                .json({ message: "Missing userId or receiverId" });
        }
        const isExistChatRoom = await chatService.getChatRoom(senderId, receiverId);
        if (isExistChatRoom) {
            return res.status(200).json({ isExistChatRoom });
        }
        const chatRoom = await chatService.getCreateChatRoom(senderId, receiverId);
        return res.status(200).json({ chatRoom });
    }
    catch (error) {
        console.log(error.message);
        return res.status(500).json({ message: "Internal server error" });
    }
};
exports.createChatRoom = createChatRoom;
const updateChatRoomRead = async (req, res) => {
    try {
        const { chatRoomId } = req.params;
        if (!chatRoomId) {
            return res
                .status(400)
                .json({ message: "Missing chatRoomId" });
        }
        const isExistChatRoom = await chatService.getChatRoomById(chatRoomId);
        if (!isExistChatRoom) {
            return res.status(400).json({ message: "chat is not found" });
        }
        const { message, chat } = await chatService.getUpdateChatRoomRead(chatRoomId);
        console.log(chat?.isRead, 'ok cana chat');
        const isRead = chat?.isRead;
        return res.status(200).json({ isRead });
    }
    catch (error) {
        console.log(error.message);
        return res.status(500).json({ message: "Internal server error" });
    }
};
exports.updateChatRoomRead = updateChatRoomRead;
const messageCreation = async (req, res) => {
    try {
        const { senderId, chatRoomId, content } = req.body;
    }
    catch (error) {
        console.log("Error messsageCreation", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};
exports.messageCreation = messageCreation;
const userMessagesList = async (req, res) => {
    try {
        const { userId } = req.params;
        const conversations = await chatService.getUserMessagesList(userId);
        if (conversations) {
            conversations.map((conversation) => {
                // console.log(conversation,'one by one conversation')
            });
        }
        return res.status(200).json({ conversations });
    }
    catch (error) {
        console.log("Error messsageCreation", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};
exports.userMessagesList = userMessagesList;
const chat = async (req, res) => {
    try {
        const { chatRoomId } = req.params;
        const chat = await chatService.getUserChat(chatRoomId);
        return res.status(200).json({ chat });
    }
    catch (error) {
        console.log("Error messsageCreation", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};
exports.chat = chat;
const sendMessage = async (req, res) => {
    try {
        const { senderId, receiverId, content, chatRoomId } = req.body;
        if (!senderId && !receiverId && !chatRoomId) {
            return res
                .status(500)
                .json({
                message: "senderId or receiverId or chatRoomId is not available",
            });
        }
        const savedMessage = await chatService.getSendMessage(senderId, receiverId, content, chatRoomId);
        const isExistChatRoom = await chatService.getChatRoom(senderId, receiverId);
        if (!isExistChatRoom) {
            return res.status(500).json({ message: "ChatRoom not found" });
        }
        if (!savedMessage) {
            return res.status(500).json({ message: "message is not saved" });
        }
        const chatRoomIdStr = isExistChatRoom._id;
        const messageIdStr = savedMessage._id;
        const saveChatRoom = await chatService.getUpdateChatRoom(chatRoomIdStr, messageIdStr);
        const message = await chatService.getMesssage(messageIdStr);
        return res.status(200).json({ message });
    }
    catch (error) {
        console.log("Error sendMessage", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};
exports.sendMessage = sendMessage;
const allMessages = async (req, res) => {
    try {
        const { chatRoomId } = req.params;
        if (!chatRoomId) {
            return res.status(400).json({ message: "chatroom ID not found" });
        }
        const messages = await chatService.getAllMessages(chatRoomId);
        return res.status(200).json({ messages });
    }
    catch (error) {
        console.log("Error checkUserSent:", error);
        return res
            .status(500)
            .json({ message: "Internal server error at checkUserSent" });
    }
};
exports.allMessages = allMessages;
const unReadMessages = async (req, res) => {
    try {
        const { userId } = req.params;
        if (!userId) {
            return res.status(400).json({ message: "User Id not found" });
        }
        const messages = await chatService.getUnReadMessages(userId);
        return res.status(200).json({ count: messages });
    }
    catch (error) {
        console.log("Error checkUserSent:", error);
        return res
            .status(500)
            .json({ message: "Internal server error at checkUserSent" });
    }
};
exports.unReadMessages = unReadMessages;
//# sourceMappingURL=messageController.js.map