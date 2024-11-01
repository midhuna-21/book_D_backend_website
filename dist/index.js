"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const db_1 = __importDefault(require("./config/db"));
const userRoute_1 = __importDefault(require("./routes/userRoute"));
const adminRoute_1 = __importDefault(require("./routes/adminRoute"));
const config_1 = __importDefault(require("./config/config"));
const userRefreshToken_1 = require("./controllers/userRefreshToken");
const adminRefreshToken_1 = require("./controllers/adminRefreshToken");
const chatService_1 = require("./services/chat/chatService");
require("./utils/ReuseFunctions/cronJob");
const chatRepository_1 = require("./respository/chat/chatRepository");
const chatRepository = new chatRepository_1.ChatRepository();
const chatService = new chatService_1.ChatService(chatRepository);
const app = (0, express_1.default)();
const corsOptions = {
    origin: config_1.default.API,
    credentials: true,
};
app.use((0, cors_1.default)(corsOptions));
const server = http_1.default.createServer(app);
const io = new socket_io_1.Server(server, {
    cors: {
        origin: config_1.default.API,
        methods: ["GET", "POST", "PUT"],
        credentials: true,
    },
});
app.set("io", io);
(0, db_1.default)();
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cookie_parser_1.default)());
// app.use(morgan('dev'))
app.use(express_1.default.static("public/"));
const userSockets = new Map();
let onlineUsers = new Set();
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
    socket.on("typing", ({ chatId, userId }) => {
        for (const [otherUserId, sockets] of userSockets.entries()) {
            if (otherUserId !== userId) {
                sockets.forEach((socketId) => {
                    io.to(socketId).emit("typing", { userId, chatId });
                });
            }
        }
    });
    socket.on('stop-typing', ({ chatId, userId }) => {
        for (const [otherUserId, sockets] of userSockets.entries()) {
            if (otherUserId !== userId) {
                sockets.forEach((socketId) => {
                    io.to(socketId).emit("stop-typing", { chatId, userId });
                });
            }
        }
    });
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
});
app.get("/api/user/:userId/online-status", (req, res) => {
    const userId = req.params.userId;
    const isOnline = onlineUsers.has(userId);
    res.json({ isOnline });
});
app.use((req, res, next) => {
    res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
    res.setHeader("Cross-Origin-Embedder-Policy", "require-corp");
    next();
});
app.use("/api/user", userRoute_1.default);
app.use("/api/admin", adminRoute_1.default);
app.post("/api/user-refresh-token", userRefreshToken_1.userRefreshTokenController);
app.post("/api/admin-refresh-token", adminRefreshToken_1.adminRefreshTokenController);
server.listen(config_1.default.PORT, () => {
    console.log(`Server running at ${config_1.default.PORT}`);
});
//# sourceMappingURL=index.js.map