import { Request, Response } from "express";
import { UserService } from "../services/userService";
import { IChatRoom } from "../model/chatRoom";
import { IMessage } from "../model/message";


const userService = new UserService();

const createChatRoom = async (req: Request, res: Response) => {
    try {
        const { senderId, receiverId } = req.body;
        if (!senderId || !receiverId) {
            return res
                .status(400)
                .json({ message: "Missing userId or receiverId" });
        }
        const isExistChatRoom = await userService.getChatRoom(
            senderId,
            receiverId
        );
        if (isExistChatRoom) {
            return res.status(200).json({ isExistChatRoom });
        }
        const chatRoom: IChatRoom | null = await userService.getCreateChatRoom(
            senderId,
            receiverId
        );
        return res.status(200).json({ chatRoom });
    } catch (error: any) {
        console.log(error.message);
        return res.status(500).json({ message: "Internal server error" });
    }
};

const messageCreation = async (req: Request, res: Response) => {
    try {
        const { senderId, chatRoomId, content } = req.body;
    } catch (error) {
        console.log("Error messsageCreation", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

const userMessagesList = async (req: Request, res: Response) => {
    try {
        const { userId } = req.params;

        const conversations: IChatRoom[] | null =
            await userService.getUserMessagesList(userId);

        return res.status(200).json({ conversations });
    } catch (error) {
        console.log("Error messsageCreation", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

const chat = async (req: Request, res: Response) => {
    try {
        const { chatRoomId } = req.params;

        const chat = await userService.getUserChat(chatRoomId);

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
            return res
                .status(500)
                .json({
                    message:
                        "senderId or receiverId or chatRoomId is not available",
                });
        }
        const savedMessage: IMessage | null = await userService.getSendMessage(
            senderId,
            receiverId,
            content,
            chatRoomId
        );
        const isExistChatRoom: IChatRoom | null = await userService.getChatRoom(
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

        const saveChatRoom = await userService.getUpdateChatRoom(
            chatRoomIdStr,
            messageIdStr
        );
        const message: IMessage[] | null = await userService.getMesssage(
            messageIdStr
        );

        return res.status(200).json({ message });
    } catch (error) {
        console.log("Error sendMessage", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

const allMessages = async (req: Request, res: Response) => {
    try {
        const { chatRoomId } = req.params;
        if (!chatRoomId) {
            return res.status(400).json({ message: "chatroom ID not found" });
        }

        const messages = await userService.getAllMessages(chatRoomId);
        return res.status(200).json({ messages });
    } catch (error: any) {
        console.log("Error checkUserSent:", error);
        return res
            .status(500)
            .json({ message: "Internal server error at checkUserSent" });
    }
};


export {
    messageCreation,
    createChatRoom,
    userMessagesList,
    chat,
    sendMessage,
    allMessages,
 
};
