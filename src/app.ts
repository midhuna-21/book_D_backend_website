import express from "express";
import http from "http";
import { Server } from "socket.io";
import cookieParser from "cookie-parser";
import { Request, Response } from "express";
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

const userService = new UserService();
const bookService = new BookService();
const chatService = new ChatService();

const app = express();

const corsOptions = {
    origin: "http://localhost:5173",
    credentials: true,
};

app.use(cors(corsOptions));

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
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

io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    socket.on("register", (userId) => {
        if (userId) {
            console.log(userId, "userId at socket ");
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
        } else {
            console.log(`No active socket found for user ${data.receiverId}`);
        }
    });

    //     const receiverSocketId = userSockets.get(data.receiverId);
    //     if (receiverSocketId) {
    //         io.to(receiverSocketId).emit('notification', data.notification);
    //         console.log(`reply notification sent to ${data.receiverId}`);
    //     }
    // });

    // socket.on('requestBook', async (data) => {
    //   try {

    //     console.log(data)
    //     const { userId,ownerId, bookId,status} = data;
    //     const receiverSocketId = userSockets.get(ownerId);
    //     const user: IUser | null = await userService.getUserById(userId);
    //     const book: IBooks | null = await bookService.getBookById(bookId);
    //     const receiver: IUser | null = await userService.getUserById(ownerId);

    //     if (!user || !book || !receiver) {
    //       console.error('User, book, or receiver not found');
    //       return;
    //     }

    //     if (receiverSocketId) {
    //       io.to(receiverSocketId).emit('notification', data);
    //       console.log(`request notification is sent to  ${ownerId}`);

    //     } else {
    //       console.log(`No active socket found for user ${ownerId}`);
    //     }
    //   } catch (error) {
    //     console.error('Error handling requestBook event:', error);
    //   }
    // });
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

app.use((req, res, next) => {
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
