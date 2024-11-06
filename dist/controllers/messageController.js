"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchUnreadMessages = exports.fetchMessages = exports.sendMessage = exports.fetchChatRoom = exports.fetchUserChatList = exports.updateChatRoomReadStatus = exports.createChatRoom = void 0;
const index_1 = require("../services/index");
const createChatRoom = async (req, res) => {
    try {
        const { senderId, receiverId } = req.body;
        if (!senderId || !receiverId) {
            return res
                .status(400)
                .json({ message: "Missing userId or receiverId" });
        }
        const isExistChatRoom = await index_1.chatService.getChatRoom(senderId, receiverId);
        if (isExistChatRoom) {
            return res.status(200).json({ isExistChatRoom });
        }
        const chatRoom = await index_1.chatService.getCreateChatRoom(senderId, receiverId);
        return res.status(200).json({ chatRoom });
    }
    catch (error) {
        console.log(error.message);
        return res.status(500).json({ message: "Internal server error" });
    }
};
exports.createChatRoom = createChatRoom;
const updateChatRoomReadStatus = async (req, res) => {
    try {
        const { chatRoomId } = req.params;
        if (!chatRoomId) {
            return res.status(400).json({ message: "Missing chatRoomId" });
        }
        const isExistChatRoom = await index_1.chatService.getChatRoomById(chatRoomId);
        if (!isExistChatRoom) {
            return res.status(400).json({ message: "chat is not found" });
        }
        const { message, chat } = await index_1.chatService.getUpdateChatRoomRead(chatRoomId);
        const isRead = chat?.isRead;
        return res.status(200).json({ isRead });
    }
    catch (error) {
        console.log(error.message);
        return res.status(500).json({ message: "Internal server error" });
    }
};
exports.updateChatRoomReadStatus = updateChatRoomReadStatus;
const fetchUserChatList = async (req, res) => {
    try {
        const { userId } = req.params;
        const conversations = await index_1.chatService.getUserChatList(userId);
        console.log(conversations, 'con');
        return res.status(200).json({ conversations });
    }
    catch (error) {
        console.log("Error fetchUserMessages", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};
exports.fetchUserChatList = fetchUserChatList;
const fetchChatRoom = async (req, res) => {
    try {
        const { chatRoomId } = req.params;
        console.log(chatRoomId, "chatRoomId");
        const chat = await index_1.chatService.getUserChat(chatRoomId);
        return res.status(200).json({ chat });
    }
    catch (error) {
        console.log("Error messsageCreation", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};
exports.fetchChatRoom = fetchChatRoom;
const sendMessage = async (req, res) => {
    try {
        const { senderId, receiverId, content, chatRoomId } = req.body;
        if (!senderId && !receiverId && !chatRoomId) {
            return res.status(500).json({
                message: "senderId or receiverId or chatRoomId is not available",
            });
        }
        const savedMessage = await index_1.chatService.getSendMessage(senderId, receiverId, content, chatRoomId);
        const isExistChatRoom = await index_1.chatService.getChatRoom(senderId, receiverId);
        if (!isExistChatRoom) {
            return res.status(500).json({ message: "ChatRoom not found" });
        }
        if (!savedMessage) {
            return res.status(500).json({ message: "message is not saved" });
        }
        const chatRoomIdStr = isExistChatRoom._id;
        const messageIdStr = savedMessage._id;
        const saveChatRoom = await index_1.chatService.getUpdateChatRoom(chatRoomIdStr, messageIdStr);
        const message = await index_1.chatService.getMesssage(messageIdStr);
        return res.status(200).json({ message });
    }
    catch (error) {
        console.log("Error sendMessage", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};
exports.sendMessage = sendMessage;
const fetchMessages = async (req, res) => {
    try {
        const { chatRoomId } = req.params;
        console.log(chatRoomId, 'chatRoomId');
        if (!chatRoomId) {
            return res.status(400).json({ message: "chatroom ID not found" });
        }
        const messages = await index_1.chatService.getAllMessages(chatRoomId);
        return res.status(200).json({ messages });
    }
    catch (error) {
        console.log("Error checkUserSent:", error);
        return res
            .status(500)
            .json({ message: "Internal server error at checkUserSent" });
    }
};
exports.fetchMessages = fetchMessages;
const fetchUnreadMessages = async (req, res) => {
    try {
        const { userId } = req.params;
        if (!userId) {
            return res.status(400).json({ message: "User Id not found" });
        }
        const messages = await index_1.chatService.getUnReadMessages(userId);
        return res.status(200).json({ count: messages });
    }
    catch (error) {
        console.log("Error checkUserSent:", error);
        return res
            .status(500)
            .json({ message: "Internal server error at checkUserSent" });
    }
};
exports.fetchUnreadMessages = fetchUnreadMessages;
//# sourceMappingURL=messageController.js.map