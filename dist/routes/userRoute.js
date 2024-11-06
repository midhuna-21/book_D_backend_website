"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const userController_1 = require("../controllers/userController");
const express_1 = __importDefault(require("express"));
const store_1 = __importDefault(require("../utils/imageFunctions/store"));
const bookController_1 = require("../controllers/bookController");
const WalletController_1 = require("../controllers/WalletController");
const notificationController_1 = require("../controllers/notificationController");
const messageController_1 = require("../controllers/messageController");
const cartController_1 = require("../controllers/cartController");
const userAuthMiddleware_1 = require("../utils/middleware/userAuthMiddleware");
const userRefreshToken_1 = require("../controllers/userRefreshToken");
const checkUserBlock_1 = require("../utils/middleware/checkUserBlock");
const userRoutes = express_1.default.Router();
userRoutes.post('/refresh-token', userRefreshToken_1.userRefreshToken);
userRoutes.post("/register", userController_1.createNewUser);
userRoutes.post("/otp/resend", userController_1.requestOtpResend);
// userRoutes.post("/verify-email", );/
userRoutes.post("/verify-otp", userController_1.validateOtp);
userRoutes.post("/login", userController_1.authenticateUser);
userRoutes.post("/google-login", userController_1.authenticateWithGoogle);
userRoutes.post("/send-otp/password-reset", userController_1.sendOtpForForgotPassword);
userRoutes.post("/link-google", userController_1.linkGoogleAccount);
userRoutes.post("/oauth/google", userController_1.processGoogleLogin);
userRoutes.post("/update-password", userController_1.resetUserPassword);
userRoutes.post("/email/unlink", userAuthMiddleware_1.userVerifyToken, userController_1.sendEmailForUnlinking);
userRoutes.put("/profile/update", userAuthMiddleware_1.userVerifyToken, checkUserBlock_1.checkBlocked, userController_1.updateUserProfile);
userRoutes.put("/profile/update-image", userAuthMiddleware_1.userVerifyToken, checkUserBlock_1.checkBlocked, store_1.default.single("selectedImage"), userController_1.updateUserProfileImage);
userRoutes.post("/logout", userController_1.logoutUser);
userRoutes.delete("/profile/remove-image", userAuthMiddleware_1.userVerifyToken, checkUserBlock_1.checkBlocked, userController_1.removeUserProfileImage);
userRoutes.get("/user/check/isBlock", userAuthMiddleware_1.userVerifyToken, checkUserBlock_1.checkBlocked, userController_1.checkUserIsblock);
//books
userRoutes.post("/books/lend-book", userAuthMiddleware_1.userVerifyToken, checkUserBlock_1.checkBlocked, store_1.default.array("images", 10), bookController_1.createBookLend);
userRoutes.get("/books/genres", userAuthMiddleware_1.userVerifyToken, checkUserBlock_1.checkBlocked, bookController_1.fetchGenresWithAvailableBooks);
userRoutes.get("/books/available-for-rent", userAuthMiddleware_1.userVerifyToken, checkUserBlock_1.checkBlocked, bookController_1.fetchAvailableBooksForRent);
userRoutes.get("/books/details/:id", userAuthMiddleware_1.userVerifyToken, checkUserBlock_1.checkBlocked, bookController_1.fetchBookDetails);
userRoutes.get("/books/lent-books", userAuthMiddleware_1.userVerifyToken, checkUserBlock_1.checkBlocked, bookController_1.fetchUserLentBooks);
userRoutes.get("/books/search/:searchQuery", userAuthMiddleware_1.userVerifyToken, checkUserBlock_1.checkBlocked, bookController_1.fetchBooksBySearch);
userRoutes.put("/books/lent/update/:bookId", userAuthMiddleware_1.userVerifyToken, checkUserBlock_1.checkBlocked, store_1.default.array("images", 10), bookController_1.updateLentBookDetails);
//notifications
userRoutes.post("/notifications/send-notification", userAuthMiddleware_1.userVerifyToken, checkUserBlock_1.checkBlocked, notificationController_1.sendNotification);
userRoutes.get("/notifications", userAuthMiddleware_1.userVerifyToken, checkUserBlock_1.checkBlocked, notificationController_1.fetchUserNotifications);
userRoutes.put("/notifications/update-status", userAuthMiddleware_1.userVerifyToken, checkUserBlock_1.checkBlocked, notificationController_1.updateUserNotificationStatusIsRead);
userRoutes.get("/notifications/unread/:userId", userAuthMiddleware_1.userVerifyToken, checkUserBlock_1.checkBlocked, notificationController_1.fetchUnreadNotifications);
//messages
userRoutes.get("/chats/:userId", userAuthMiddleware_1.userVerifyToken, checkUserBlock_1.checkBlocked, messageController_1.fetchUserChatList);
userRoutes.post("/chat-room/create", userAuthMiddleware_1.userVerifyToken, checkUserBlock_1.checkBlocked, messageController_1.createChatRoom);
userRoutes.get("/chat-room/:chatRoomId", userAuthMiddleware_1.userVerifyToken, checkUserBlock_1.checkBlocked, messageController_1.fetchChatRoom);
userRoutes.post("/messages/send-message", userAuthMiddleware_1.userVerifyToken, checkUserBlock_1.checkBlocked, messageController_1.sendMessage);
userRoutes.get("/messages/:chatRoomId", userAuthMiddleware_1.userVerifyToken, checkUserBlock_1.checkBlocked, messageController_1.fetchMessages);
userRoutes.get("/messages/unread/:userId", userAuthMiddleware_1.userVerifyToken, checkUserBlock_1.checkBlocked, messageController_1.fetchUnreadMessages);
userRoutes.put("/chatrooms/read-status/:chatRoomId", userAuthMiddleware_1.userVerifyToken, checkUserBlock_1.checkBlocked, messageController_1.updateChatRoomReadStatus);
//cart-items
// userRoutes.get(
//     "/books/rent-requests/acceptance/:userId/:bookId",
//     userVerifyToken,checkBlocked,
//     checkRentalAcceptance
// );
userRoutes.post("/cart/add", userAuthMiddleware_1.userVerifyToken, checkUserBlock_1.checkBlocked, cartController_1.addItemToCart);
userRoutes.put("/cart/update-item/:cartId", userAuthMiddleware_1.userVerifyToken, checkUserBlock_1.checkBlocked, cartController_1.updateCartItem);
//goolge location
userRoutes.get("/google/locations/distance", userAuthMiddleware_1.userVerifyToken, checkUserBlock_1.checkBlocked, userController_1.computeLocationDistance);
//payment
userRoutes.get("/payments/rental-details/:cartId", userAuthMiddleware_1.userVerifyToken, checkUserBlock_1.checkBlocked, bookController_1.rentalProcess);
userRoutes.post("/payments/checkout", userAuthMiddleware_1.userVerifyToken, checkUserBlock_1.checkBlocked, bookController_1.createRentalCheckout);
//rent
userRoutes.post("/books/rent/create-order", userAuthMiddleware_1.userVerifyToken, checkUserBlock_1.checkBlocked, bookController_1.createRentalOrder);
userRoutes.get("/books/rentals/success", userAuthMiddleware_1.userVerifyToken, checkUserBlock_1.checkBlocked, bookController_1.fetchSuccessfullRentalOrders);
userRoutes.get("/books/rental-orders/:userId", userAuthMiddleware_1.userVerifyToken, bookController_1.fetchRentalOrders);
userRoutes.get("/books/lent/:userId", userAuthMiddleware_1.userVerifyToken, checkUserBlock_1.checkBlocked, bookController_1.fetchLentBooks);
//genres
userRoutes.get("/genres/books/:genreName", userAuthMiddleware_1.userVerifyToken, checkUserBlock_1.checkBlocked, bookController_1.fetchBooksByGenre);
userRoutes.get("/genres", userAuthMiddleware_1.userVerifyToken, checkUserBlock_1.checkBlocked, bookController_1.fetchGenres);
//orders
userRoutes.put("/books/rental-orders/status/update/:selectedOrderId", userAuthMiddleware_1.userVerifyToken, checkUserBlock_1.checkBlocked, bookController_1.updateOrderStatusByRenter);
userRoutes.put("/books/lent-orders/lender/status/update/:selectedOrderId", userAuthMiddleware_1.userVerifyToken, checkUserBlock_1.checkBlocked, bookController_1.updateOrderStatusByLender);
//wallet
userRoutes.get("/wallet/transactions", userAuthMiddleware_1.userVerifyToken, checkUserBlock_1.checkBlocked, WalletController_1.fetchWalletTransactions);
userRoutes.patch("/wallet/payment", userAuthMiddleware_1.userVerifyToken, checkUserBlock_1.checkBlocked, WalletController_1.processWalletPayment);
userRoutes.patch("/wallet/check", userAuthMiddleware_1.userVerifyToken, checkUserBlock_1.checkBlocked, WalletController_1.checkWalletStatus);
exports.default = userRoutes;
//# sourceMappingURL=userRoute.js.map