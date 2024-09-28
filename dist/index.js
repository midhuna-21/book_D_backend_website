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
const refreshToken_1 = require("./controllers/refreshToken");
const userService_1 = require("./services/userService");
const bookService_1 = require("./services/bookService");
const chatService_1 = require("./services/chatService");
require("./utils/ReuseFunctions/cronJob");
const userService = new userService_1.UserService();
const bookService = new bookService_1.BookService();
const chatService = new chatService_1.ChatService();
const app = (0, express_1.default)();
console.log(config_1.default.API, 'bucket region ');
const corsOptions = {
    origin: config_1.default.API,
    credentials: true,
};
console.log(config_1.default.API, 'p');
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
const onlineUsers = new Map();
io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);
    socket.on("register", (userId) => {
        if (userId) {
            userSockets.set(userId, socket.id);
            onlineUsers.set(userId, socket.id);
            // console.log(onlineUsers,'onlineUsers')
            io.emit("user-status", { userId, isOnline: true });
        }
    });
    socket.on("disconnect", () => {
        for (const [userId, socketId] of onlineUsers.entries()) {
            if (socketId === socket.id) {
                onlineUsers.delete(userId);
                io.emit("user-status", { userId, isOnline: false });
                io.emit("user-offline", userId);
                break;
            }
        }
    });
    socket.on("send-notification", (data) => {
        const receiverSocketId = userSockets.get(data.receiverId);
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("notification", data.notification);
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
            const receiverSocketId = userSockets.get(receiverId);
            if (receiverSocketId) {
                io.to(receiverSocketId).emit("receive-message", message);
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
    console.log(isOnline, "Id oneli");
    res.json({ isOnline });
});
app.use((req, res, next) => {
    res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
    res.setHeader("Cross-Origin-Embedder-Policy", "require-corp");
    next();
});
app.use("/api/user", userRoute_1.default);
app.use("/api/admin", adminRoute_1.default);
app.post("/api/refresh-token", refreshToken_1.refreshTokenController);
server.listen(config_1.default.PORT, () => {
    console.log(`Server running at ${config_1.default.PORT}`);
});
//# sourceMappingURL=index.js.map