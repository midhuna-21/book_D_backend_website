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
    checkIsCurrentPassword,
    updateUserProfilePassword,
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
    archiveBook,
    unArchiveBook,
    removeBook,
    updateConfirmPickupByLender,
    updateConfirmReturnByRenter,
    checkIsOrderExistByOrderId,
    cancelRentalOrder
} from "../controllers/bookController";
import {
    fetchWalletTransactions,
    processWalletPayment,
    checkWalletStatus,
    createRentalOrderByWallet,
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
import { updateCartItem, addItemToCart } from "../controllers/cartController";
import { userVerifyToken } from "../utils/middleware/userAuthMiddleware";
import { userRefreshToken } from "../controllers/userRefreshToken";
import { checkBlocked } from "../utils/middleware/checkUserBlock";
import { checkIsOrderExist } from "../controllers/cartController";

const userRoutes = express.Router();

userRoutes.post("/refresh-token", userRefreshToken);

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

userRoutes.put(
    "/profile/update",
    userVerifyToken,
    checkBlocked,
    updateUserProfile
);

userRoutes.put(
    "/profile/update-password",
    userVerifyToken,
    checkBlocked,
    updateUserProfilePassword
);

userRoutes.get(
    "/user/check-current-password/:userId/:currentPassword",
    userVerifyToken,
    checkBlocked,
    checkIsCurrentPassword
);

userRoutes.put(
    "/profile/update-image",
    userVerifyToken,
    checkBlocked,
    upload.single("selectedImage"),
    updateUserProfileImage
);

userRoutes.post("/logout", logoutUser);

userRoutes.delete(
    "/profile/remove-image",
    userVerifyToken,
    checkBlocked,
    removeUserProfileImage
);

userRoutes.get(
    "/user/check/isBlock",
    userVerifyToken,
    checkBlocked,
    checkUserIsblock
);

//books

userRoutes.put('/books/update-cancellation-rental/:orderId/:userId',userVerifyToken,checkBlocked,cancelRentalOrder)

userRoutes.post(
    "/books/lend-book",
    userVerifyToken,
    checkBlocked,
    upload.array("images", 10),
    createBookLend
);

userRoutes.get(
    "/books/genres",
    userVerifyToken,
    checkBlocked,
    fetchGenresWithAvailableBooks
);

userRoutes.get(
    "/books/available-for-rent",
    userVerifyToken,
    checkBlocked,
    fetchAvailableBooksForRent
);

userRoutes.get(
    "/books/details/:id",
    userVerifyToken,
    checkBlocked,
    fetchBookDetails
);

userRoutes.get(
    "/books/lent-books",
    userVerifyToken,
    checkBlocked,
    fetchUserLentBooks
);

userRoutes.get(
    "/books/search/:searchQuery",
    userVerifyToken,
    checkBlocked,
    fetchBooksBySearch
);

userRoutes.put(
    "/books/lent/update/:bookId",
    userVerifyToken,
    checkBlocked,
    upload.array("images", 10),
    updateLentBookDetails
);

userRoutes.post("/books/archive", userVerifyToken, archiveBook);

userRoutes.post("/books/unarchive", userVerifyToken, unArchiveBook);

userRoutes.delete("/books/remove/:bookId", userVerifyToken, removeBook);

//notifications
userRoutes.post(
    "/notifications/send-notification",
    userVerifyToken,
    checkBlocked,
    sendNotification
);

userRoutes.get(
    "/notifications",
    userVerifyToken,
    checkBlocked,
    fetchUserNotifications
);

userRoutes.put(
    "/notifications/update-status",
    userVerifyToken,
    checkBlocked,
    updateUserNotificationStatusIsRead
);

userRoutes.get(
    "/notifications/unread/:userId",
    userVerifyToken,
    checkBlocked,
    fetchUnreadNotifications
);

//messages

userRoutes.get(
    "/chats/:userId",
    userVerifyToken,
    checkBlocked,
    fetchUserChatList
);

userRoutes.post(
    "/chat-room/create",
    userVerifyToken,
    checkBlocked,
    createChatRoom
);

userRoutes.get(
    "/chat-room/:chatRoomId",
    userVerifyToken,
    checkBlocked,
    fetchChatRoom
);

userRoutes.post(
    "/messages/send-message",
    userVerifyToken,
    checkBlocked,
    sendMessage
);

userRoutes.get(
    "/messages/:chatRoomId",
    userVerifyToken,
    checkBlocked,
    fetchMessages
);

userRoutes.get(
    "/messages/unread/:userId",
    userVerifyToken,
    checkBlocked,
    fetchUnreadMessages
);

userRoutes.put(
    "/chatrooms/read-status/:chatRoomId",
    userVerifyToken,
    checkBlocked,
    updateChatRoomReadStatus
);

//cart-items
// userRoutes.get(
//     "/books/rent-requests/acceptance/:userId/:bookId",
//     userVerifyToken,checkBlocked,
//     checkRentalAcceptance
// );

userRoutes.post("/cart/add", userVerifyToken, checkBlocked, addItemToCart);

userRoutes.put(
    "/cart/update-item/:cartId",
    userVerifyToken,
    checkBlocked,
    updateCartItem
);

//goolge location
userRoutes.get(
    "/google/locations/distance",
    userVerifyToken,
    checkBlocked,
    computeLocationDistance
);

//payment
userRoutes.get(
    "/payments/rental-details/:cartId",
    userVerifyToken,
    checkBlocked,
    rentalProcess
);

userRoutes.post(
    "/payments/checkout",
    userVerifyToken,
    checkBlocked,
    createRentalCheckout
);

//rent
userRoutes.post(
    "/books/rent/create-order",
    userVerifyToken,
    checkBlocked,
    createRentalOrder
);

userRoutes.get(
    "/books/rentals/success",
    userVerifyToken,
    checkBlocked,
    fetchSuccessfullRentalOrders
);

userRoutes.get(
    "/books/rental-orders/:userId",
    userVerifyToken,
    fetchRentalOrders
);

userRoutes.get(
    "/books/lent/:userId",
    userVerifyToken,
    checkBlocked,
    fetchLentBooks
);

//genres
userRoutes.get(
    "/genres/books/:genreName",
    userVerifyToken,
    checkBlocked,
    fetchBooksByGenre
);

userRoutes.get("/genres", userVerifyToken, checkBlocked, fetchGenres);

//orders
userRoutes.put(
    "/books/rental-orders/status/update/:selectedOrderId",
    userVerifyToken,
    checkBlocked,
    updateOrderStatusByRenter
);

userRoutes.put(
    "/books/lent-orders/lender/status/update/:selectedOrderId",
    userVerifyToken,
    checkBlocked,
    updateOrderStatusByLender
);

//confirmation of updating pickupcode
userRoutes.put(
    "/books/lend-orders/lender/confirm/pickup/:orderId",
    userVerifyToken,
    checkBlocked,
    updateConfirmPickupByLender
);

userRoutes.put(
    "/books/rental-orders/renter/confirm/return/:orderId",
    userVerifyToken,
    checkBlocked,
    updateConfirmReturnByRenter
);

//wallet
userRoutes.get(
    "/wallet/transactions",
    userVerifyToken,
    checkBlocked,
    fetchWalletTransactions
);

userRoutes.post(
    "/wallet/payment",
    userVerifyToken,
    checkBlocked,
    createRentalOrderByWallet
);

userRoutes.post(
    "/wallet/check",
    userVerifyToken,
    checkBlocked,
    checkWalletStatus
);

userRoutes.get(
    "/orders/is-exist/:cartId",
    userVerifyToken,
    checkBlocked,
    checkIsOrderExist
);

userRoutes.get(
    "/order/:orderId",
    userVerifyToken,
    checkBlocked,
    checkIsOrderExistByOrderId
);

export default userRoutes;
