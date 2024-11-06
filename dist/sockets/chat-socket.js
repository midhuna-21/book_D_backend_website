"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeChatSocket = initializeChatSocket;
const userSockets = new Map();
let onlineUsers = new Set();
function initializeChatSocket(socket, io, userSockets, chatService) {
    socket.on("typing", ({ chatId, userId }) => {
        for (const [otherUserId, sockets] of userSockets.entries()) {
            if (otherUserId !== userId) {
                sockets.forEach((socketId) => {
                    io.to(socketId).emit("typing", { userId, chatId });
                });
            }
        }
    });
    socket.on("stop-typing", ({ chatId, userId }) => {
        for (const [otherUserId, sockets] of userSockets.entries()) {
            if (otherUserId !== userId) {
                sockets.forEach((socketId) => {
                    io.to(socketId).emit("stop-typing", { chatId, userId });
                });
            }
        }
    });
    socket.on("send-message", async (data) => {
        try {
            const { senderId, receiverId, content, chatRoomId } = data;
            if (!content.trim()) {
                return;
            }
            const message = {
                senderId,
                receiverId,
                content,
                chatRoomId,
                createdAt: new Date(),
            };
            const chatRoom = await chatService.getChatRoom(senderId, receiverId);
            if (!chatRoom) {
                console.error("Chat room not found");
                return;
            }
            socket.emit("receive-message", message);
            const receiverSocketIds = userSockets.get(receiverId);
            if (receiverSocketIds && receiverSocketIds.size > 0) {
                receiverSocketIds.forEach((socketId) => {
                    io.to(socketId).emit("receive-message", message);
                });
            }
            else {
                console.log(`No active socket found for user ${receiverId}`);
            }
        }
        catch (error) {
            console.error("Error handling send-message event:", error);
        }
    });
}
//# sourceMappingURL=chat-socket.js.map