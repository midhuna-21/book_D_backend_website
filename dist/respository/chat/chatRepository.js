"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatRepository = void 0;
const chatRoom_1 = require("../../model/chatRoom");
const message_1 = require("../../model/message");
class ChatRepository {
    async findCreateChatRoom(senderId, receiverId) {
        try {
            const chatRoomCreated = await new chatRoom_1.chatRoom({
                senderId,
                receiverId,
            }).save();
            return chatRoomCreated;
        }
        catch (error) {
            console.log("Error createMessage:", error);
            throw error;
        }
    }
    async findChatRoomById(chatRoomId) {
        try {
            const isChatRoom = await chatRoom_1.chatRoom.findById(chatRoomId);
            return isChatRoom;
        }
        catch (error) {
            console.log("Error findChatRoomById:", error);
            throw error;
        }
    }
    async findUpdateChatRoomRead(chatRoomId) {
        try {
            const messages = await message_1.message.find({ chatRoomId: chatRoomId }).exec();
            await message_1.message
                .updateMany({ chatRoomId: chatRoomId }, { isRead: true }, { new: true })
                .exec();
            const chatUpdate = await chatRoom_1.chatRoom
                .findByIdAndUpdate({ _id: chatRoomId }, { isRead: true }, { new: true })
                .exec();
            return { message: messages, chat: chatUpdate };
        }
        catch (error) {
            console.log("Error findUpdateChatRoomRead:", error);
            throw error;
        }
    }
    async findUserMessagesList(userId) {
        try {
            const chatRooms = await chatRoom_1.chatRoom
                .find({
                $or: [{ senderId: userId }, { receiverId: userId }],
            })
                .populate("receiverId", "name email image")
                .populate("senderId", "name email image")
                .populate("messageId")
                .sort({ updatedAt: -1 })
                .exec();
            const filteredChatRooms = chatRooms.filter((chatRoom) => {
                const senderId = chatRoom.senderId;
                const receiverId = chatRoom.receiverId;
                return (senderId && receiverId) !== null;
            });
            return filteredChatRooms;
        }
        catch (error) {
            console.log("Error MessagesList:", error);
            throw error;
        }
    }
    async findUserChat(chatRoomId) {
        try {
            const chatRoomData = await chatRoom_1.chatRoom
                .findById(chatRoomId)
                .populate({
                path: "receiverId",
                select: "name image",
                match: { _id: { $exists: true } },
            })
                .populate({
                path: "senderId",
                select: "name image",
                match: { _id: { $exists: true } },
            })
                .exec();
            if (!chatRoomData?.receiverId || !chatRoomData?.senderId) {
                return [];
            }
            return [chatRoomData];
        }
        catch (error) {
            console.log("Error in findUserChat:", error);
            throw error;
        }
    }
    // async findUserChat(chatRoomId: string):Promise<IChatRoom[]>  {
    //     try {
    //         const chatRoomData = await chatRoom
    //             .findById(chatRoomId)
    //             .populate({
    //                 path: "receiverId",
    //                 select: "name image",
    //                 match: { _id: { $exists: true } },
    //             })
    //             .populate({
    //                 path: "senderId",
    //                 select: "name image",
    //                 match: { _id: { $exists: true } },
    //             })
    //             .exec();
    //         if (!chatRoomData?.receiverId || !chatRoomData?.senderId) {
    //             return null;
    //         }
    //         return chatRoomData;
    //     } catch (error) {
    //         console.log("Error in findUserChat:", error);
    //         throw error;
    //     }
    // }
    async findCreateSendMessage(senderId, receiverId, content, chatRoomId) {
        try {
            const saveMessage = await new message_1.message({
                senderId,
                receiverId,
                content,
                chatRoomId,
            }).save();
            return saveMessage;
        }
        catch (error) {
            console.log("Error findSendMessage:", error);
            throw error;
        }
    }
    async findUpdateChatRoom(chatRoomId, messageId) {
        try {
            return await chatRoom_1.chatRoom.findByIdAndUpdate(chatRoomId, { $push: { messageId: messageId } }, { new: true });
        }
        catch (error) {
            console.log("Erro updateChatroom:", error);
            throw error;
        }
    }
    async findMessage(messageId) {
        try {
            return await message_1.message.findById({ _id: messageId });
        }
        catch (error) {
            console.log("Erro updateChatroom:", error);
            throw error;
        }
    }
    async findAllMessages(chatRoomId) {
        try {
            return await chatRoom_1.chatRoom.findById(chatRoomId).populate({
                path: "messageId",
                select: "content senderId receiverId createdAt",
                populate: {
                    path: "senderId receiverId",
                    select: "name image",
                },
            });
        }
        catch (error) {
            console.log("Error finding all messages:", error);
            throw error;
        }
    }
    async findChatRoom(userId, receiverId) {
        try {
            return await chatRoom_1.chatRoom.findOne({
                $or: [
                    { senderId: userId, receiverId: receiverId },
                    { senderId: receiverId, receiverId: userId },
                ],
            });
        }
        catch (error) {
            console.log("Error finding chat room:", error);
            throw error;
        }
    }
    async findUnReadMessages(userId) {
        try {
            const messages = await message_1.message.countDocuments({
                receiverId: userId,
                isRead: false,
            });
            return messages;
        }
        catch (error) {
            console.log("Error finding all messages:", error);
            throw error;
        }
    }
}
exports.ChatRepository = ChatRepository;
//# sourceMappingURL=chatRepository.js.map