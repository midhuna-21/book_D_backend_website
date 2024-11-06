import { Request, Response } from "express";
import { IChatRoom } from "../model/chatRoom";
import { IMessage } from "../model/message";
import { chatService } from "../services/index";

const createChatRoom = async (req: Request, res: Response) => {
    try {
        const { senderId, receiverId } = req.body;
        if (!senderId || !receiverId) {
            return res
                .status(400)
                .json({ message: "Missing userId or receiverId" });
        }
        const isExistChatRoom = await chatService.getChatRoom(
            senderId,
            receiverId
        );
        if (isExistChatRoom) {
            return res.status(200).json({ isExistChatRoom });
        }
        const chatRoom: IChatRoom | null = await chatService.getCreateChatRoom(
            senderId,
            receiverId
        );
        return res.status(200).json({ chatRoom });
    } catch (error: any) {
        console.log(error.message);
        return res.status(500).json({ message: "Internal server error" });
    }
};
const updateChatRoomReadStatus = async (req: Request, res: Response) => {
    try {
        const { chatRoomId } = req.params;
        if (!chatRoomId) {
            return res.status(400).json({ message: "Missing chatRoomId" });
        }
        const isExistChatRoom = await chatService.getChatRoomById(chatRoomId);
        if (!isExistChatRoom) {
            return res.status(400).json({ message: "chat is not found" });
        }
        const { message, chat } = await chatService.getUpdateChatRoomRead(
            chatRoomId
        );

        const isRead = chat?.isRead;
        return res.status(200).json({ isRead });
    } catch (error: any) {
        console.log(error.message);
        return res.status(500).json({ message: "Internal server error" });
    }
};

const fetchUserChatList = async (req: Request, res: Response) => {
    try {
        const { userId } = req.params;
        const conversations: IChatRoom[] | null = await chatService.getUserChatList(userId);
        console.log(conversations,'con')
        return res.status(200).json({ conversations });
    } catch (error) {
        console.log("Error fetchUserMessages", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

const fetchChatRoom = async (req: Request, res: Response) => {
    try {
        const { chatRoomId } = req.params;
        console.log(chatRoomId,"chatRoomId");
        
        const chat = await chatService.getUserChat(chatRoomId);
        return res.status(200).json({ chat });
    } catch (error) {
        console.log("Error messsageCreation", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

const sendMessage = async (req: Request, res: Response) => {
    try {
        const { senderId, receiverId, content, chatRoomId } = req.body;
        if (!senderId && !receiverId && !chatRoomId) {
            return res.status(500).json({
                message:
                    "senderId or receiverId or chatRoomId is not available",
            });
        }
        const savedMessage: IMessage | null = await chatService.getSendMessage(
            senderId,
            receiverId,
            content,
            chatRoomId
        );
        const isExistChatRoom: IChatRoom | null = await chatService.getChatRoom(
            senderId,
            receiverId
        );

        if (!isExistChatRoom) {
            return res.status(500).json({ message: "ChatRoom not found" });
        }
        if (!savedMessage) {
            return res.status(500).json({ message: "message is not saved" });
        }
        const chatRoomIdStr = isExistChatRoom._id as string;
        const messageIdStr = savedMessage._id as string;

        const saveChatRoom = await chatService.getUpdateChatRoom(
            chatRoomIdStr,
            messageIdStr
        );
        const message: IMessage[] | null = await chatService.getMesssage(
            messageIdStr
        );
        return res.status(200).json({ message });
    } catch (error) {
        console.log("Error sendMessage", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

const fetchMessages = async (req: Request, res: Response) => {
    try {
        const { chatRoomId } = req.params;
        console.log(chatRoomId,'chatRoomId')
        if (!chatRoomId) {
            return res.status(400).json({ message: "chatroom ID not found" });
        }
        const messages = await chatService.getAllMessages(chatRoomId);
        return res.status(200).json({ messages });
    } catch (error: any) {
        console.log("Error checkUserSent:", error);
        return res
            .status(500)
            .json({ message: "Internal server error at checkUserSent" });
    }
};

const fetchUnreadMessages = async (req: Request, res: Response) => {
    try {
        const { userId } = req.params;
        if (!userId) {
            return res.status(400).json({ message: "User Id not found" });
        }

        const messages = await chatService.getUnReadMessages(userId);
        return res.status(200).json({ count: messages });
    } catch (error: any) {
        console.log("Error checkUserSent:", error);
        return res
            .status(500)
            .json({ message: "Internal server error at checkUserSent" });
    }
};

export {
    createChatRoom,
    updateChatRoomReadStatus,
    fetchUserChatList,
    fetchChatRoom,
    sendMessage,
    fetchMessages,
    fetchUnreadMessages,
};
