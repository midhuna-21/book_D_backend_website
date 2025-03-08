import express from "express";
import http from "http";
import { Server } from "socket.io";
import cookieParser from "cookie-parser";
import morgan from 'morgan';
import cors,{CorsOptions} from "cors";
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
    origin: 'http://localhost:5000',
    credentials: true,
    optionSuccessStatus: 200
}

app.use(cors(corsOptions));

app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', "http://localhost:5000");
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    next();
});
const server = http.createServer(app);

const io = new Server(server, {
    cors:corsOptions,
});
app.set("io", io);


dbConnect();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan('dev'))
app.use(express.static("public/"));

initializeSocket(io, chatService, notificationService);

// app.use(cors(corsOptions)); 


app.use("/api/user", userRoutes);
app.use("/api/admin", adminRoutes);

server.listen(config.PORT, () => {
    console.log(`Server running at ${config.PORT}`);
});
