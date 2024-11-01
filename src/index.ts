import express, { Request, Response, NextFunction } from "express";
import http from "http";
import { Server, Socket } from "socket.io";
import cookieParser from "cookie-parser";
import cors from "cors";
import dbConnect from "./config/db";
import userRouter from "./routes/userRoute";
import adminRouter from "./routes/adminRoute";
import config from "./config/config";
import { userRefreshTokenController } from "./controllers/userRefreshToken";
import { adminRefreshTokenController } from "./controllers/adminRefreshToken";
import { ChatService } from "./services/chat/chatService";
import "./utils/ReuseFunctions/cronJob";
import { Notification } from "./interfaces/data";
import { ChatRepository } from "./respository/chat/chatRepository";

const chatRepository = new ChatRepository();
const chatService = new ChatService(chatRepository);

const app = express();

const corsOptions = {
    origin: config.API,
    credentials: true,
};
app.use(cors(corsOptions));

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: config.API,
        methods: ["GET", "POST", "PUT"],
        credentials: true,
    },
});

app.set("io", io);

dbConnect();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
// app.use(morgan('dev'))
app.use(express.static("public/"));


const userSockets = new Map<string, Set<string>>();
let onlineUsers = new Set();

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
    

      socket.on("typing", ({ chatId, userId }) => {
        for (const [otherUserId, sockets] of userSockets.entries()) {
            if (otherUserId !== userId) {
                sockets.forEach((socketId) => {
                    io.to(socketId).emit("typing", { userId, chatId });
                });
            }
        }
    });
    socket.on('stop-typing', ({chatId ,userId }) => {
        for (const [otherUserId, sockets] of userSockets.entries()) {
            if (otherUserId !== userId) {
                sockets.forEach((socketId) => {
                    io.to(socketId).emit("stop-typing", { chatId,userId });
                });
            }
        }
      });

    
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
                console.log(`No active socket found for user ${data.receiverId}`);
            }
        }
    );


    socket.on(
        "send-message",
        async (data: {
            senderId: string;
            receiverId: string;
            content: string;
            chatRoomId: string;
        }) => {
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
                const chatRoom = await chatService.getChatRoom(
                    senderId,
                    receiverId
                );
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
                } else {
                    console.log(`No active socket found for user ${receiverId}`);
                }
                
                
            } catch (error) {
                console.error("Error handling send-message event:", error);
            }
        }
    );
});

app.get("/api/user/:userId/online-status", (req: Request, res: Response) => {
    const userId = req.params.userId;
    const isOnline = onlineUsers.has(userId);
    res.json({ isOnline });
});

app.use((req: Request, res: Response, next: NextFunction) => {
    res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
    res.setHeader("Cross-Origin-Embedder-Policy", "require-corp");
    next();
});
app.use("/api/user", userRouter);
app.use("/api/admin", adminRouter);
app.post("/api/user-refresh-token", userRefreshTokenController);
app.post("/api/admin-refresh-token", adminRefreshTokenController);

server.listen(config.PORT, () => {
    console.log(`Server running at ${config.PORT}`);
});
