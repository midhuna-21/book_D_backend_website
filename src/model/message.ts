import mongoose, { Schema, model, Document } from "mongoose";

interface IMessage extends Document {
    senderId: mongoose.Types.ObjectId;
    receiverId: mongoose.Types.ObjectId;
    content: string;
    chatRoomId: mongoose.Types.ObjectId;
    isRead: boolean;
    createdAt: Date;
}

const messageSchema = new Schema<IMessage>({
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true,
    },
    receiverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true,
    },
    content: { type: String, required: true },
    chatRoomId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "chatRoom",
        required: true,
    },
    isRead: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
});

const message = mongoose.model<IMessage>("messages", messageSchema);
export { message, IMessage };
