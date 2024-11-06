import { Server, Socket } from "socket.io";
import { ChatService } from "../services/chat/chatService";
import { NotificationService } from "../services/notification/notificationService";
import { initializeChatSocket } from "./chat-socket";
import { initializeNotificationSocket } from "./notification-socket";

const userSockets = new Map<string, Set<string>>();
let onlineUsers = new Set();

export function initializeSocket(
    io: Server,
    chatService: ChatService,
    notificationService: NotificationService
) {
    io.on("connection", (socket: Socket) => {
        socket.on("register", (userId: string) => {
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

        initializeChatSocket(socket, io, userSockets, chatService);
        initializeNotificationSocket(
            socket,
            io,
            userSockets,
            notificationService
        );
    });
}
