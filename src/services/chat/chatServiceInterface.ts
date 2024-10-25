import { IChatRoom } from '../../model/chatRoom';
import { IMessage } from '../../model/message';

export interface IChatService {
   getUserMessagesList(userId: string): Promise<IChatRoom[] | null>
   getChatRoomById(chatRoomId: string):Promise<IChatRoom | null>
   getUpdateChatRoomRead(chatRoomId: string):Promise<{ message: IMessage[]; chat: IChatRoom | null }>
   getUserChat(chatRoomId: string):Promise<IChatRoom[]> 
   getChatRoom(userId: string,receiverId: string): Promise<IChatRoom | null>
   getCreateChatRoom(senderId: string,receiverId: string): Promise<IChatRoom | null>
   getUpdateChatRoom(chatRoomId: string, messageId: string):Promise<IChatRoom | null> 
   getMesssage(messageId: string): Promise<IMessage[] | null>
   getAllMessages(chatRoomId: string): Promise<IChatRoom | null>
   getSendMessage(senderId: string,receiverId: string,content: string,chatRoomId: string): Promise<IMessage | null>
   getUnReadMessages(userId: string):Promise<number> 

}
