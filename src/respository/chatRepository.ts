import { IMessage } from "../model/message";
import { chatRoom, IChatRoom } from "../model/chatRoom";
import { message } from "../model/message";

export class ChatRepository {
    async createChatRoom(
        senderId: string,
        receiverId: string
    ): Promise<IChatRoom | null> {
        try {
            const chatRoomCreated = await new chatRoom({
                senderId,
                receiverId,
            }).save();
            console.log(chatRoomCreated, "chatRoom created");
            return chatRoomCreated;
        } catch (error) {
            console.log("Error createMessage:", error);
            throw error;
        }
    }

    async MessagesList(userId: string): Promise<IChatRoom[] | null> {
        try {
            const chatRooms = await chatRoom
                .find({
                    $or: [{ senderId: userId }, { receiverId: userId }],
                })
                .populate("receiverId", "name email image")
                .populate("senderId", "name email image")
                .populate('messageId')
                .exec();

            return chatRooms;
        } catch (error) {
            console.log("Error MessagesList:", error);
            throw error;
        }
    }
    async findUserChat(chatRoomId: string) {
        try {
            return await chatRoom
                .findById({ _id: chatRoomId })
                .populate("receiverId", "name image")
                .populate("senderId", "name image")
                .exec();
        } catch (error) {
            console.log("Error findUpdateMessagesList:", error);
            throw error;
        }
    }
    async createSendMessage(
        senderId: string,
        receiverId: string,
        content: string,
        chatRoomId: string
    ): Promise<IMessage | null> {
        try {
            const saveMessage = await new message({
                senderId,
                receiverId,
                content,
                chatRoomId,
            }).save();

            return saveMessage;
        } catch (error) {
            console.log("Error findSendMessage:", error);
            throw error;
        }
    }

    async updateChatRoom(chatRoomId: string, messageId: string) {
        try {
            return await chatRoom.findByIdAndUpdate(
                chatRoomId,
                { $push: { messageId: messageId } },
                { new: true }
            );
        } catch (error) {
            console.log("Erro updateChatroom:", error);
            throw error;
        }
    }

    async findMessage(messageId: string): Promise<IMessage[] | null> {
        try {
            return await message.findById({ _id: messageId });
        } catch (error) {
            console.log("Erro updateChatroom:", error);
            throw error;
        }
    }

    async findAllMessages(chatRoomId: string): Promise<IChatRoom | null> {
        try {
            return await chatRoom.findById(chatRoomId).populate({
                path: "messageId",
                select: "content senderId receiverId createdAt",
                populate: {
                    path: "senderId receiverId",
                    select: "name image",
                },
            });
        } catch (error) {
            console.log("Error finding all messages:", error);
            throw error;
        }
    }

    async findChatRoom(
        userId: string,
        receiverId: string
    ): Promise<IChatRoom | null> {
        try {
            return await chatRoom.findOne({
                $or: [
                    { senderId: userId, receiverId: receiverId },
                    { senderId: receiverId, receiverId: userId },
                ],
            });
        } catch (error) {
            console.log("Error finding chat room:", error);
            throw error;
        }
    }
}
