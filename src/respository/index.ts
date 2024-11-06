import { UserRepository } from "./user/userRepository";
import { BookRepository } from "./book/bookRepository";
import { WalletRepository } from "./wallet/walletRepository";
import { AdminRepository } from "./admin/adminRespository";
import { ChatRepository } from "./chat/chatRepository";
import { NotificationRepository } from "./notification/notificationRepository";
import { CartRepository } from "./cart/cartRepository";

const userRepository = new UserRepository();
const bookRepository = new BookRepository();
const walletRepository = new WalletRepository();
const adminRepository = new AdminRepository();
const notificationRepository = new NotificationRepository();
const chatRepository = new ChatRepository();
const cartRepository = new CartRepository();

export {
    userRepository,
    bookRepository,
    walletRepository,
    adminRepository,
    notificationRepository,
    chatRepository,
    cartRepository,
};
