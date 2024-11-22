import express, { Request, Response, NextFunction } from "express";
import http from "http";
import { Server } from "socket.io";
import cookieParser from "cookie-parser";
import cors from "cors";
import dbConnect from "./config/db";
import userRoutes from "./routes/userRoute";
import adminRoutes from "./routes/adminRoute";
import config from "./config/config";
import "./utils/ReuseFunctions/cronJob";
import { ChatService } from "./services/chat/chatService";
import { ChatRepository } from "./respository/chat/chatRepository";
import { notificationService } from "./services";
import { initializeSocket } from "./sockets/socket-connection";

const chatRepository = new ChatRepository();
const chatService = new ChatService(chatRepository);

const app = express();

const corsOptions = {
    origin: config.API,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
};
const apiOrigin = config.API ?? "*";
app.use(cors(corsOptions));

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", apiOrigin);
    res.setHeader(
        "Access-Control-Allow-Headers",
        "Content-Type, Authorization"
    );
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, OPTIONS, PUT, PATCH, DELETE"
    );
    res.setHeader(
        "Cache-Control",
        "no-store, no-cache, must-revalidate, proxy-revalidate"
    );
    res.setHeader("Pragma", "no-cache");
    res.setHeader("Expires", "0");
    next();
});

const server = http.createServer(app);
const io = new Server(server, {
    cors: corsOptions,
});

app.options("*", cors(corsOptions));
app.set("io", io);

dbConnect();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
// app.use(morgan('dev'))
app.use(express.static("public/"));

initializeSocket(io, chatService, notificationService);

app.use("/api/user", userRoutes);
app.use("/api/admin", adminRoutes);

server.listen(config.PORT, () => {
    console.log(`Server running at ${config.PORT}`);
});
