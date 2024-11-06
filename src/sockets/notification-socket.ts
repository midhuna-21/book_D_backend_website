import { Server, Socket } from "socket.io";
import { Notification } from "../interfaces/data";
import { NotificationService } from "../services/notification/notificationService";

const userSockets = new Map<string, Set<string>>();
let onlineUsers = new Set();

export function initializeNotificationSocket(
    socket: Socket,
    io: Server,
    userSockets: Map<string, Set<string>>,
    notificationService: NotificationService
) {
    socket.on(
        "send-notification",
        (data: { receiverId: string; notification: Notification }) => {
            const receiverSocketIds = userSockets.get(data.receiverId);
            console.log(receiverSocketIds, "receiverSocketIds");

            if (receiverSocketIds) {
                Array.from(receiverSocketIds).forEach((socketId) => {
                    io.to(socketId).emit("notification", data.notification);
                });
                console.log(`Notification sent to ${data.receiverId}`);
            } else {
                console.log(
                    `No active socket found for user ${data.receiverId}`
                );
            }
        }
    );
}
