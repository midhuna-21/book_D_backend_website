import {
    signUp,
    generateOtp,
    loginUser,
    verifyPhoneNumber,
    verifyOtp,
    updatePassword,
    logoutUser,
    loginByGoogle,
    updateUser,
    updateProfileImage,
    deleteUserImage,
    getUser,
    sendUnlinkEmail,
    googleLog,
    linkGoogleAccount,
    userDetails,
    sendOTP,
    calculateDistance,
    verifyEmail,
} from "../controllers/userController";
import express from "express";
import upload from "../utils/imageFunctions/store";
import {
    bookDetail,
    exploreBooks,
    genresOfBooks,
    createOrder,
    createCheckout,
    genres,
    OrderToShowSuccess,
    lendingProcess,
    orders,
    rentBook,
    rentedBooks,
    sellBook,
    soldBooks,
    search,
    genreMatchedBooks,
    rentBookUpdate,
    updateOrderStatusRenter,
    updateOrderStatusLender,
    rentList,
    lendList,
} from "../controllers/bookController";
import {walletTransactions,paymentWallet,checkWallet} from '../controllers/WalletController'
import {
    notifications,
    sendNotification,
    unReadNotifications,
    updateNotification,
} from "../controllers/notificationController";
import {
    allMessages,
    chat,
    createChatRoom,
    messageCreation,
    sendMessage,
    userMessagesList,
    updateChatRoomRead,
    unReadMessages,
} from "../controllers/messageController";
import {
    updateCart,
    checkAccept,
    checkUserSentRequest,
    saveCart,
} from "../controllers/cartController";
import { userVerifyToken } from "../utils/middleware/userAuthMiddleware";

const userRouter = express.Router();

userRouter.post("/sign-up", signUp);

userRouter.post("/otp-generate", generateOtp);

userRouter.post("/login", loginUser);

userRouter.post("/google-login", loginByGoogle);

userRouter.post("/check-email", verifyEmail);

userRouter.post("/check-phone", verifyPhoneNumber);

userRouter.post("/link-google-account", linkGoogleAccount);

userRouter.post("/google", googleLog);

userRouter.post("/verify-otp", verifyOtp);

userRouter.post("/update-password", updatePassword);

userRouter.post(
    "/rent-book",
    userVerifyToken,
    upload.array("images", 10),
    rentBook
);

userRouter.post(
    "/sell-book",
    userVerifyToken,
    upload.array("images", 10),
    sellBook
);

userRouter.get("/genres", userVerifyToken, genresOfBooks);

userRouter.get("/genre", userVerifyToken, genres);

userRouter.get("/books", userVerifyToken, exploreBooks);

userRouter.get("/book/:Id", userVerifyToken, bookDetail);

userRouter.put("/update-profile", userVerifyToken, updateUser);

userRouter.put(
    "/update-profile-image",
    userVerifyToken,
    upload.single("selectedImage"),
    updateProfileImage
);

userRouter.post("/notification", userVerifyToken, sendNotification);

userRouter.get("/notifications", userVerifyToken, notifications);

userRouter.post("/update-notification-status", userVerifyToken, updateNotification);

userRouter.get("/rented-books", userVerifyToken, rentedBooks);

userRouter.get("/sold-books", userVerifyToken, soldBooks);

userRouter.post("/create-message", userVerifyToken, messageCreation);

userRouter.get("/users-messages-list/:userId", userVerifyToken, userMessagesList);

userRouter.post("/create-chatRoom", userVerifyToken, createChatRoom);

userRouter.get("/chat-room/:chatRoomId", userVerifyToken, chat);

userRouter.post("/send-message", userVerifyToken, sendMessage);

userRouter.get("/messages/:chatRoomId", userVerifyToken, allMessages);

userRouter.get("/unread-messages/:userId", userVerifyToken, unReadMessages);

userRouter.get(
    "/unread-notifications/:userId",
    userVerifyToken,
    unReadNotifications
);

userRouter.get("/user/:receiverId", userVerifyToken, getUser);

userRouter.post("/send-email", userVerifyToken, sendUnlinkEmail);

userRouter.get(
    "/check-request/:userId/:bookId",
    userVerifyToken,
    checkUserSentRequest
);

userRouter.get("/check-accept/:userId/:bookId", userVerifyToken, checkAccept);

// userRouter.post('/request-send',verifyToken,saveRequest)

userRouter.post("/logout", logoutUser);

userRouter.delete("/delete-profile-image", userVerifyToken, deleteUserImage);

userRouter.get("/google-distance", userVerifyToken, calculateDistance);

userRouter.get("/user-details/:lenderId", userVerifyToken, userDetails);

userRouter.get("/lending-details/:cartId", userVerifyToken, lendingProcess);

userRouter.post("/create-checkout", userVerifyToken, createCheckout);

userRouter.post("/create-order", userVerifyToken, createOrder);
userRouter.get("/get-order-to-showSuccess", userVerifyToken, OrderToShowSuccess);

userRouter.get("/orders/:userId", userVerifyToken, orders);
userRouter.get("/rent-list/:userId", userVerifyToken, rentList);
userRouter.get("/lend-list/:userId", userVerifyToken, lendList);

userRouter.get("/search/:searchQuery", userVerifyToken, search);
userRouter.get("/genre-books/:genreName", userVerifyToken, genreMatchedBooks);
// userRouter.get('/search/:searchQuery',verifyToken,search)

userRouter.post(
    "/chatRoom-update/:chatRoomId",
    userVerifyToken,
    updateChatRoomRead
);

// userRouter.put('/rent-book-update/:bookId',verifyToken,upload.array('images', 10),rentBookUpdate)
userRouter.put(
    "/rent-book-update/:bookId",
    userVerifyToken,
    upload.array("images", 10),
    rentBookUpdate
);

userRouter.post("/create-cart-item", userVerifyToken, saveCart);

userRouter.put("/cart-item-update/:cartId", userVerifyToken, updateCart);
userRouter.post(
    "/update-order-status/:selectedOrderId",
    userVerifyToken,
    updateOrderStatusRenter
);

userRouter.post(
    "/update-order-status-from-lender/:selectedOrderId",
    userVerifyToken,
    updateOrderStatusLender
);

userRouter.get("/wallet", userVerifyToken,walletTransactions);

userRouter.post("/payment-wallet", userVerifyToken, paymentWallet);

userRouter.post("/check-wallet", userVerifyToken, checkWallet);


export default userRouter;
