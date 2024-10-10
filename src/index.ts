import express, { Request, Response, NextFunction } from "express";
import http from "http";
import { Server ,Socket} from "socket.io";
import cookieParser from "cookie-parser";
import cors from "cors";
import dbConnect from "./config/db";
import userRouter from "./routes/userRoute";
import adminRouter from "./routes/adminRoute";
import config from "./config/config";
import { refreshTokenController } from "./controllers/refreshToken";
import { UserService } from "./services/userService";
import { BookService } from "./services/bookService";
import { ChatService } from "./services/chatService";
import './utils/ReuseFunctions/cronJob';
import { Notification } from "./interfaces/data";

const userService = new UserService();
const bookService = new BookService();
const chatService = new ChatService();

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

const userSockets = new Map<string, string>();
const onlineUsers = new Map<string, string>();

io.on("connection", (socket:Socket) => {
    console.log("A user connected:", socket.id);

    socket.on("register", (userId:string) => {
        if (userId) {
            userSockets.set(userId, socket.id);
            onlineUsers.set(userId, socket.id);
            console.log(userSockets,'user sockets')
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

    socket.on("send-notification", (data:{receiverId:string,notification:Notification}) => {
        const receiverSocketId = userSockets.get(data.receiverId);
        console.log(receiverSocketId,'receiverSocketId')
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("notification", data.notification);
            console.log(`Notification sent to ${data.receiverId}`);
        } else {
            console.log(`No active socket found for user ${data.receiverId}`);
        }
    });

    socket.on("send-message", async (data: { senderId: string; receiverId: string; content: string; chatRoomId: string }) => {
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

            const receiverSocketId = userSockets.get(receiverId);
            if (receiverSocketId) {
                io.to(receiverSocketId).emit("receive-message", message);
            } else {
                console.log(`No active socket found for user ${receiverId}`);
            }
        } catch (error) {
            console.error("Error handling send-message event:", error);
        }
    });
});

app.get("/api/user/:userId/online-status", (req: Request, res: Response) => {
    const userId = req.params.userId;
    const isOnline = onlineUsers.has(userId);
    console.log(isOnline, "Id oneli");
    res.json({ isOnline });
});

app.use((req:Request, res:Response, next:NextFunction) => {
    res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
    res.setHeader("Cross-Origin-Embedder-Policy", "require-corp");
    next();
});
app.use("/api/user", userRouter);
app.use("/api/admin", adminRouter);
app.post("/api/refresh-token", refreshTokenController);

server.listen(config.PORT, () => {
    console.log(`Server running at ${config.PORT}`);
});
