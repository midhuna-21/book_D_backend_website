import mongoose, { Schema, model, Document } from "mongoose";

interface IChatRoom extends Document {
    senderId?: string;
    receiverId?: string;
    messageId?: mongoose.Types.ObjectId[];
    isRead?: boolean;
}
const chatRoomSchema = new Schema<IChatRoom>(
    {
        senderId: { type: String, ref: "user" },
        receiverId: { type: String, ref: "user" },
        messageId: [{ type: mongoose.Schema.Types.ObjectId, ref: "messages" }],
        isRead: { type: Boolean, default: false },
    },
    { timestamps: true }
);

const chatRoom = mongoose.model<IChatRoom>("chatRoom", chatRoomSchema);
export { chatRoom, IChatRoom };
