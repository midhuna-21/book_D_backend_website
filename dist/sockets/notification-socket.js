"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeNotificationSocket = initializeNotificationSocket;
const userSockets = new Map();
let onlineUsers = new Set();
function initializeNotificationSocket(socket, io, userSockets, notificationService) {
    socket.on("send-notification", (data) => {
        const receiverSocketIds = userSockets.get(data.receiverId);
        console.log(receiverSocketIds, "receiverSocketIds");
        if (receiverSocketIds) {
            Array.from(receiverSocketIds).forEach((socketId) => {
                io.to(socketId).emit("notification", data.notification);
            });
            console.log(`Notification sent to ${data.receiverId}`);
        }
        else {
            console.log(`No active socket found for user ${data.receiverId}`);
        }
    });
}
//# sourceMappingURL=notification-socket.js.map