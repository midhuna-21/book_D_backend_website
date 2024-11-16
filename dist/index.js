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
require("./utils/ReuseFunctions/cronJob");
const chatService_1 = require("./services/chat/chatService");
const chatRepository_1 = require("./respository/chat/chatRepository");
const services_1 = require("./services");
const socket_connection_1 = require("./sockets/socket-connection");
const chatRepository = new chatRepository_1.ChatRepository();
const chatService = new chatService_1.ChatService(chatRepository);
const app = (0, express_1.default)();
const corsOptions = {
    origin: config_1.default.API,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
};
app.use((0, cors_1.default)(corsOptions));
const server = http_1.default.createServer(app);
const io = new socket_io_1.Server(server, {
    cors: {
        origin: config_1.default.API,
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"],
        credentials: true,
    },
});
app.options("*", (0, cors_1.default)(corsOptions));
app.set("io", io);
(0, db_1.default)();
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cookie_parser_1.default)());
// app.use(morgan('dev'))
app.use(express_1.default.static("public/"));
(0, socket_connection_1.initializeSocket)(io, chatService, services_1.notificationService);
app.use("/api/user", userRoute_1.default);
app.use("/api/admin", adminRoute_1.default);
server.listen(config_1.default.PORT, () => {
    console.log(`Server running at ${config_1.default.PORT}`);
});
//# sourceMappingURL=index.js.map