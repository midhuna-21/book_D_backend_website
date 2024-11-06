import { WalletService } from "./wallet/walletService";
import { BookService } from "./book/bookService";
import { UserService } from "./user/userService";
import { AdminService } from "./admin/adminService";
import { NotificationService } from "./notification/notificationService";
import { ChatService } from "./chat/chatService";
import { CartService } from "./cart/cartService";

import {
    bookRepository,
    walletRepository,
    adminRepository,
    notificationRepository,
    chatRepository,
    cartRepository,
} from "../respository";
import { UserRepository } from "../respository/user/userRepository";
const userRepository = new UserRepository();
const walletService = new WalletService(walletRepository);
const bookService = new BookService(bookRepository);
const userService = new UserService(userRepository);
const adminService = new AdminService(adminRepository);
const notificationService = new NotificationService(notificationRepository);
const chatService = new ChatService(chatRepository);
const cartService = new CartService(cartRepository);

export {
    walletService,
    bookService,
    userService,
    adminService,
    notificationService,
    chatService,
    cartService,
};
