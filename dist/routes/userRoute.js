"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const userController_1 = require("../controllers/userController");
const express_1 = __importDefault(require("express"));
const store_1 = __importDefault(require("../utils/imageFunctions/store"));
const authMiddleware_1 = require("../utils/middleware/authMiddleware");
const bookController_1 = require("../controllers/bookController");
const notificationController_1 = require("../controllers/notificationController");
const messageController_1 = require("../controllers/messageController");
const cartController_1 = require("../controllers/cartController");
const userRouter = express_1.default.Router();
userRouter.post('/sign-up', userController_1.signUp);
userRouter.post('/otp-generate', userController_1.generateOtp);
userRouter.post('/login', userController_1.loginUser);
userRouter.post('/google-login', userController_1.loginByGoogle);
userRouter.post('/check-email', userController_1.verifyEmail);
userRouter.post('/check-phone', userController_1.verifyPhoneNumber);
userRouter.post('/link-google-account', userController_1.linkGoogleAccount);
userRouter.post('/google', userController_1.googleLog);
userRouter.post('/verify-otp', userController_1.verifyOtp);
userRouter.post('/update-password', userController_1.updatePassword);
userRouter.post('/rent-book', authMiddleware_1.verifyToken, store_1.default.array('images', 10), bookController_1.rentBook);
userRouter.post('/sell-book', authMiddleware_1.verifyToken, store_1.default.array('images', 10), bookController_1.sellBook);
userRouter.get('/genres', authMiddleware_1.verifyToken, bookController_1.genresOfBooks);
userRouter.get('/genre', authMiddleware_1.verifyToken, bookController_1.genres);
userRouter.get('/books', authMiddleware_1.verifyToken, bookController_1.exploreBooks);
userRouter.get('/book/:Id', authMiddleware_1.verifyToken, bookController_1.bookDetail);
userRouter.get('/lender-details/:lenderId/:bookId', authMiddleware_1.verifyToken, bookController_1.lenderDetails);
userRouter.put('/update-profile', authMiddleware_1.verifyToken, userController_1.updateUser);
userRouter.put('/update-profile-image', authMiddleware_1.verifyToken, store_1.default.single('selectedImage'), userController_1.updateProfileImage);
userRouter.post('/notification', authMiddleware_1.verifyToken, notificationController_1.sendNotification);
userRouter.get('/notifications', authMiddleware_1.verifyToken, notificationController_1.notifications);
userRouter.post('/update-notification-status', authMiddleware_1.verifyToken, notificationController_1.updateNotification);
userRouter.get('/rented-books', authMiddleware_1.verifyToken, bookController_1.rentedBooks);
userRouter.get('/sold-books', authMiddleware_1.verifyToken, bookController_1.soldBooks);
userRouter.post('/create-message', authMiddleware_1.verifyToken, messageController_1.messageCreation);
userRouter.get('/users-messages-list/:userId', authMiddleware_1.verifyToken, messageController_1.userMessagesList);
userRouter.post('/create-chatRoom', authMiddleware_1.verifyToken, messageController_1.createChatRoom);
userRouter.get('/chat-room/:chatRoomId', authMiddleware_1.verifyToken, messageController_1.chat);
userRouter.post('/send-message', authMiddleware_1.verifyToken, messageController_1.sendMessage);
userRouter.get('/messages/:chatRoomId', authMiddleware_1.verifyToken, messageController_1.allMessages);
userRouter.get('/unread-messages/:userId', authMiddleware_1.verifyToken, messageController_1.unReadMessages);
userRouter.get('/unread-notifications/:userId', authMiddleware_1.verifyToken, notificationController_1.unReadNotifications);
userRouter.get('/user/:receiverId', authMiddleware_1.verifyToken, userController_1.getUser);
userRouter.post('/send-email', authMiddleware_1.verifyToken, userController_1.sendUnlinkEmail);
userRouter.get('/check-request/:userId/:bookId', authMiddleware_1.verifyToken, cartController_1.checkUserSentRequest);
userRouter.get('/check-accept/:userId/:bookId', authMiddleware_1.verifyToken, cartController_1.checkAccept);
// userRouter.post('/request-send',verifyToken,saveRequest)
userRouter.post('/logout', userController_1.logoutUser);
userRouter.delete('/delete-profile-image', authMiddleware_1.verifyToken, userController_1.deleteUserImage);
userRouter.get('/google-distance', authMiddleware_1.verifyToken, userController_1.calculateDistance);
userRouter.get('/user-details/:lenderId', authMiddleware_1.verifyToken, userController_1.userDetails);
userRouter.get('/lending-details/:cartId', authMiddleware_1.verifyToken, bookController_1.lendingProcess);
userRouter.post('/create-checkout', authMiddleware_1.verifyToken, bookController_1.createCheckout);
userRouter.post('/create-order', authMiddleware_1.verifyToken, bookController_1.createOrder);
userRouter.get('/get-order-to-showSuccess', authMiddleware_1.verifyToken, bookController_1.OrderToShowSuccess);
userRouter.get('/orders/:userId', authMiddleware_1.verifyToken, bookController_1.orders);
userRouter.get('/search/:searchQuery', authMiddleware_1.verifyToken, bookController_1.search);
userRouter.get('/genre-books/:genreName', authMiddleware_1.verifyToken, bookController_1.genreMatchedBooks);
// userRouter.get('/search/:searchQuery',verifyToken,search)
userRouter.post('/chatRoom-update/:chatRoomId', authMiddleware_1.verifyToken, messageController_1.updateChatRoomRead);
// userRouter.put('/rent-book-update/:bookId',verifyToken,upload.array('images', 10),rentBookUpdate)
userRouter.put('/rent-book-update/:bookId', authMiddleware_1.verifyToken, store_1.default.array('images', 10), bookController_1.rentBookUpdate);
userRouter.post('/create-cart-item', authMiddleware_1.verifyToken, cartController_1.saveCart);
userRouter.put('/cart-item-update/:cartId', authMiddleware_1.verifyToken, cartController_1.updateCart);
userRouter.put('/update-order-status/:selectedOrderId', authMiddleware_1.verifyToken, bookController_1.updateOrderStatus);
exports.default = userRouter;
//# sourceMappingURL=userRoute.js.map