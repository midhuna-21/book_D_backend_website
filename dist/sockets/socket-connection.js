"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeSocket = initializeSocket;
const chat_socket_1 = require("./chat-socket");
const notification_socket_1 = require("./notification-socket");
const userSockets = new Map();
let onlineUsers = new Set();
function initializeSocket(io, chatService, notificationService) {
    io.on("connection", (socket) => {
        socket.on("register", (userId) => {
            if (userId) {
                if (!userSockets.has(userId)) {
                    userSockets.set(userId, new Set());
                }
                userSockets.get(userId)?.add(socket.id);
                io.emit("user-status", { userId, status: "online" });
            }
        });
        socket.on("userConnected", (userId) => {
            onlineUsers.add(userId);
            io.emit("userOnline", userId);
        });
        socket.on("disconnect", () => {
            for (const [userId, sockets] of userSockets.entries()) {
                if (sockets.has(socket.id)) {
                    sockets.delete(socket.id);
                    if (sockets.size === 0) {
                        userSockets.delete(userId);
                        onlineUsers.delete(userId);
                        io.emit("user-status", { userId, status: "offline" });
                        io.emit("userOffline", userId);
                    }
                    break;
                }
            }
        });
        (0, chat_socket_1.initializeChatSocket)(socket, io, userSockets, chatService);
        (0, notification_socket_1.initializeNotificationSocket)(socket, io, userSockets, notificationService);
    });
}
//# sourceMappingURL=socket-connection.js.map