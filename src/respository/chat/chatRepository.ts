import { IMessage } from "../../model/message";
import { chatRoom, IChatRoom } from "../../model/chatRoom";
import { message } from "../../model/message";

export class ChatRepository {
    async findCreateChatRoom(
        senderId: string,
        receiverId: string
    ): Promise<IChatRoom | null> {
        try {
            const chatRoomCreated = await new chatRoom({
                senderId,
                receiverId,
            }).save();
            return chatRoomCreated;
        } catch (error) {
            console.log("Error createMessage:", error);
            throw error;
        }
    }

    async findChatRoomById(chatRoomId: string): Promise<IChatRoom | null> {
        try {
            const isChatRoom = await chatRoom.findById(chatRoomId);
            return isChatRoom;
        } catch (error) {
            console.log("Error findChatRoomById:", error);
            throw error;
        }
    }

    async findUpdateChatRoomRead(
        chatRoomId: string
    ): Promise<{ message: IMessage[]; chat: IChatRoom | null }> {
        try {
            const messages = await message
                .find({ chatRoomId: chatRoomId })
                .exec();

            await message
                .updateMany(
                    { chatRoomId: chatRoomId },
                    { isRead: true },
                    { new: true }
                )
                .exec();

            const chatUpdate = await chatRoom
                .findByIdAndUpdate(
                    { _id: chatRoomId },
                    { isRead: true },
                    { new: true }
                )
                .exec();
            return { message: messages, chat: chatUpdate };
        } catch (error) {
            console.log("Error findUpdateChatRoomRead:", error);
            throw error;
        }
    }

    async findUserChatList(userId: string): Promise<IChatRoom[] | null> {
        try {
            const chatRooms = await chatRoom
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
        } catch (error) {
            console.log("Error findUserChatList:", error);
            throw error;
        }
    }

    async findUserChat(chatroomId: string): Promise<IChatRoom[]> {
        try {
            const chatRoomData = await chatRoom
                .findById(chatroomId)
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
        } catch (error) {
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

    async findCreateSendMessage(
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

    async findUpdateChatRoom(
        chatRoomId: string,
        messageId: string
    ): Promise<IChatRoom | null> {
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

    async findUnReadMessages(userId: string): Promise<number> {
        try {
            const messages = await message.countDocuments({
                receiverId: userId,
                isRead: false,
            });
            return messages;
        } catch (error) {
            console.log("Error finding all messages:", error);
            throw error;
        }
    }
}
