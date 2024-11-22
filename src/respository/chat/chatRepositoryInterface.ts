import { IChatRoom } from "../../model/chatRoom";
import { IMessage } from "../../model/message";

export interface IChatRepository {
    findCreateChatRoom(
        senderId: string,
        receiverId: string
    ): Promise<IChatRoom | null>;
    findChatRoomById(chatroomId: string): Promise<IChatRoom | null>;
    findUpdateChatRoomRead(
        chatRoomId: string
    ): Promise<{ message: IMessage[]; chat: IChatRoom | null }>;
    findUserChatList(userId: string): Promise<IChatRoom[] | null>;
    findUserChat(chatRoomId: string): Promise<IChatRoom[]>;
    findCreateSendMessage(
        senderId: string,
        receiverId: string,
        content: string,
        chatRoomId: string
    ): Promise<IMessage | null>;
    findUpdateChatRoom(
        chatRoomId: string,
        messageId: string
    ): Promise<IChatRoom | null>;
    findMessage(messageId: string): Promise<IMessage[] | null>;
    findAllMessages(chatRoomId: string): Promise<IChatRoom | null>;
    findChatRoom(userId: string, receiverId: string): Promise<IChatRoom | null>;
    findUnReadMessages(userId: string): Promise<number>;
}
