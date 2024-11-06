import {
    createNewUser,
    requestOtpResend,
    authenticateUser,
    validateOtp,
    resetUserPassword,
    logoutUser,
    authenticateWithGoogle,
    updateUserProfile,
    updateUserProfileImage,
    removeUserProfileImage,
    sendEmailForUnlinking,
    processGoogleLogin,
    linkGoogleAccount,
    computeLocationDistance,
    sendOtpForForgotPassword,
    checkUserIsblock,
    
} from "../controllers/userController";
import express from "express";
import upload from "../utils/imageFunctions/store";
import {
    fetchBookDetails,
    fetchAvailableBooksForRent,
    fetchGenres,
    createRentalOrder,
    createRentalCheckout,
    fetchGenresWithAvailableBooks,
    fetchSuccessfullRentalOrders,
    rentalProcess,
    fetchRentalOrders,
    createBookLend,
    fetchUserLentBooks,
    fetchBooksBySearch,
    fetchBooksByGenre,
    updateLentBookDetails,
    updateOrderStatusByRenter,
    updateOrderStatusByLender,
    fetchLentBooks,
} from "../controllers/bookController";
import {
    fetchWalletTransactions,
    processWalletPayment,
    checkWalletStatus,
} from "../controllers/WalletController";
import {
    fetchUserNotifications,
    sendNotification,
    fetchUnreadNotifications,
    updateUserNotificationStatusIsRead,
} from "../controllers/notificationController";
import {
    fetchMessages,
    fetchChatRoom,
    createChatRoom,
    sendMessage,
    fetchUserChatList,
    updateChatRoomReadStatus,
    fetchUnreadMessages,
} from "../controllers/messageController";
import {
    updateCartItem,
    addItemToCart,
} from "../controllers/cartController";
import { userVerifyToken } from "../utils/middleware/userAuthMiddleware";
import { userRefreshToken } from "../controllers/userRefreshToken";
import { checkBlocked } from "../utils/middleware/checkUserBlock";

const userRoutes = express.Router();

userRoutes.post('/refresh-token',userRefreshToken)

userRoutes.post("/register", createNewUser);

userRoutes.post("/otp/resend", requestOtpResend);

// userRoutes.post("/verify-email", );/

userRoutes.post("/verify-otp", validateOtp);

userRoutes.post("/login", authenticateUser);

userRoutes.post("/google-login", authenticateWithGoogle);

userRoutes.post("/send-otp/password-reset", sendOtpForForgotPassword);

userRoutes.post("/link-google", linkGoogleAccount);

userRoutes.post("/oauth/google", processGoogleLogin);

userRoutes.post("/update-password", resetUserPassword);

userRoutes.post("/email/unlink", userVerifyToken, sendEmailForUnlinking);

userRoutes.put("/profile/update", userVerifyToken,checkBlocked, updateUserProfile);

userRoutes.put(
    "/profile/update-image",
    userVerifyToken,checkBlocked,
    upload.single("selectedImage"),
    updateUserProfileImage
);

userRoutes.post("/logout", logoutUser);

userRoutes.delete(
    "/profile/remove-image",
    userVerifyToken,checkBlocked,
    removeUserProfileImage
);

userRoutes.get("/user/check/isBlock", userVerifyToken,checkBlocked, checkUserIsblock);

//books
userRoutes.post(
    "/books/lend-book",
    userVerifyToken,checkBlocked,
    upload.array("images", 10),
    createBookLend
);


userRoutes.get("/books/genres", userVerifyToken,checkBlocked, fetchGenresWithAvailableBooks);

userRoutes.get(
    "/books/available-for-rent",
    userVerifyToken,checkBlocked,
    fetchAvailableBooksForRent
);

userRoutes.get("/books/details/:id", userVerifyToken,checkBlocked, fetchBookDetails);

userRoutes.get("/books/lent-books", userVerifyToken,checkBlocked, fetchUserLentBooks);

userRoutes.get(
    "/books/search/:searchQuery",
    userVerifyToken,checkBlocked,
    fetchBooksBySearch
);

userRoutes.put(
    "/books/lent/update/:bookId",
    userVerifyToken,checkBlocked,
    upload.array("images", 10),
    updateLentBookDetails
);

//notifications
userRoutes.post(
    "/notifications/send-notification",
    userVerifyToken,checkBlocked,
    sendNotification
);

userRoutes.get("/notifications", userVerifyToken,checkBlocked, fetchUserNotifications);

userRoutes.put(
    "/notifications/update-status",
    userVerifyToken,checkBlocked,
    updateUserNotificationStatusIsRead
);

userRoutes.get(
    "/notifications/unread/:userId",
    userVerifyToken,checkBlocked,
    fetchUnreadNotifications
);

//messages

userRoutes.get("/chats/:userId", userVerifyToken,checkBlocked, fetchUserChatList);

userRoutes.post("/chat-room/create", userVerifyToken,checkBlocked, createChatRoom);

userRoutes.get("/chat-room/:chatRoomId", userVerifyToken,checkBlocked, fetchChatRoom);

userRoutes.post("/messages/send-message", userVerifyToken, checkBlocked,sendMessage);

userRoutes.get("/messages/:chatRoomId", userVerifyToken,checkBlocked, fetchMessages);

userRoutes.get(
    "/messages/unread/:userId",
    userVerifyToken,checkBlocked,
    fetchUnreadMessages
);

userRoutes.put(
    "/chatrooms/read-status/:chatRoomId",
    userVerifyToken,checkBlocked,
    updateChatRoomReadStatus
);

//cart-items
// userRoutes.get(
//     "/books/rent-requests/acceptance/:userId/:bookId",
//     userVerifyToken,checkBlocked,
//     checkRentalAcceptance
// );

userRoutes.post("/cart/add", userVerifyToken, checkBlocked,addItemToCart);

userRoutes.put("/cart/update-item/:cartId", userVerifyToken,checkBlocked, updateCartItem);

//goolge location
userRoutes.get(
    "/google/locations/distance",
    userVerifyToken,checkBlocked,
    computeLocationDistance
);

//payment
userRoutes.get(
    "/payments/rental-details/:cartId",
    userVerifyToken,checkBlocked,
    rentalProcess
);

userRoutes.post("/payments/checkout", userVerifyToken, checkBlocked,createRentalCheckout);

//rent
userRoutes.post("/books/rent/create-order", userVerifyToken,checkBlocked, createRentalOrder);

userRoutes.get(
    "/books/rentals/success",
    userVerifyToken,checkBlocked,
    fetchSuccessfullRentalOrders
);

userRoutes.get(
    "/books/rental-orders/:userId",
    userVerifyToken,
    fetchRentalOrders
);

userRoutes.get("/books/lent/:userId", userVerifyToken,checkBlocked, fetchLentBooks);

//genres
userRoutes.get("/genres/books/:genreName", userVerifyToken,checkBlocked, fetchBooksByGenre);

userRoutes.get("/genres", userVerifyToken,checkBlocked, fetchGenres);

//orders
userRoutes.put(
    "/books/rental-orders/status/update/:selectedOrderId",
    userVerifyToken,checkBlocked,
    updateOrderStatusByRenter
);

userRoutes.put(
    "/books/lent-orders/lender/status/update/:selectedOrderId",
    userVerifyToken,checkBlocked,
    updateOrderStatusByLender
);

//wallet
userRoutes.get(
    "/wallet/transactions",
    userVerifyToken,checkBlocked,
    fetchWalletTransactions
);

userRoutes.patch("/wallet/payment", userVerifyToken,checkBlocked, processWalletPayment);

userRoutes.patch("/wallet/check", userVerifyToken,checkBlocked, checkWalletStatus);

export default userRoutes;
