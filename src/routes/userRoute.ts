import { signUp ,generateOtp, loginUser, verifyPhoneNumber, verifyOtp,updatePassword,logoutUser,loginByGoogle,updateUser,
updateProfileImage,deleteUserImage,getUser,sendUnlinkEmail,googleLog,linkGoogleAccount,userDetails,sendOTP,
calculateDistance,verifyEmail,
} from '../controllers/userController';
import express from 'express'
import upload from '../utils/imageFunctions/store';
import {verifyToken} from '../utils/middleware/authMiddleware';
import { bookDetail, exploreBooks, genresOfBooks,createOrder,createCheckout,genres ,lenderDetails,OrderToShowSuccess, lendingProcess, orders, rentBook, rentedBooks, sellBook, soldBooks, search, genreMatchedBooks,rentBookUpdate ,updateOrderStatus} from '../controllers/bookController';
import { notifications, sendNotification ,unReadNotifications,updateNotification} from '../controllers/notificationController';
import { allMessages, chat, createChatRoom, messageCreation, sendMessage, userMessagesList ,updateChatRoomRead,unReadMessages} from '../controllers/messageController';
import { updateCart, checkAccept, checkUserSentRequest, saveCart } from '../controllers/cartController';

const userRouter=express.Router()

userRouter.post('/sign-up',signUp)

userRouter.post('/otp-generate',generateOtp)

userRouter.post('/login',loginUser)

userRouter.post('/google-login',loginByGoogle)

userRouter.post('/check-email',verifyEmail)

userRouter.post('/check-phone',verifyPhoneNumber)

userRouter.post('/link-google-account',linkGoogleAccount)

userRouter.post('/google',googleLog)

userRouter.post('/verify-otp',verifyOtp)  

userRouter.post('/update-password',updatePassword) 

userRouter.post('/rent-book',verifyToken,upload.array('images', 10),rentBook)

userRouter.post('/sell-book',verifyToken,upload.array('images', 10),sellBook)

userRouter.get('/genres',verifyToken,genresOfBooks)

userRouter.get('/genre',verifyToken,genres)

userRouter.get('/books',verifyToken,exploreBooks)

userRouter.get('/book/:Id',verifyToken,bookDetail)

userRouter.get('/lender-details/:lenderId/:bookId',verifyToken,lenderDetails)

userRouter.put('/update-profile',verifyToken,updateUser)  

userRouter.put('/update-profile-image',verifyToken,upload.single('selectedImage'),updateProfileImage)  

userRouter.post('/notification',verifyToken,sendNotification)

userRouter.get('/notifications',verifyToken,notifications)

userRouter.post('/update-notification-status',verifyToken,updateNotification)

userRouter.get('/rented-books',verifyToken,rentedBooks)

userRouter.get('/sold-books',verifyToken,soldBooks)

userRouter.post('/create-message',verifyToken,messageCreation)

userRouter.get('/users-messages-list/:userId',verifyToken,userMessagesList)

userRouter.post('/create-chatRoom',verifyToken,createChatRoom)

userRouter.get('/chat-room/:chatRoomId',verifyToken,chat)

userRouter.post('/send-message',verifyToken,sendMessage)

userRouter.get('/messages/:chatRoomId',verifyToken,allMessages)

userRouter.get('/unread-messages/:userId',verifyToken,unReadMessages)

userRouter.get('/unread-notifications/:userId',verifyToken,unReadNotifications)

userRouter.get('/user/:receiverId',verifyToken,getUser)

userRouter.post('/send-email',verifyToken,sendUnlinkEmail)

userRouter.get('/check-request/:userId/:bookId', verifyToken, checkUserSentRequest);

userRouter.get('/check-accept/:userId/:bookId', verifyToken, checkAccept);

// userRouter.post('/request-send',verifyToken,saveRequest)

userRouter.post('/logout',logoutUser) 

userRouter.delete('/delete-profile-image',verifyToken,deleteUserImage)

userRouter.get('/google-distance',verifyToken,calculateDistance)

userRouter.get('/user-details/:lenderId',verifyToken,userDetails)

userRouter.get('/lending-details/:cartId',verifyToken,lendingProcess)

userRouter.post('/create-checkout',verifyToken,createCheckout)

userRouter.post('/create-order',verifyToken,createOrder)
userRouter.get('/get-order-to-showSuccess',verifyToken,OrderToShowSuccess)

userRouter.get('/orders/:userId',verifyToken,orders)

userRouter.get('/search/:searchQuery',verifyToken,search)
userRouter.get('/genre-books/:genreName',verifyToken,genreMatchedBooks)
// userRouter.get('/search/:searchQuery',verifyToken,search)

userRouter.post('/chatRoom-update/:chatRoomId',verifyToken,updateChatRoomRead)

// userRouter.put('/rent-book-update/:bookId',verifyToken,upload.array('images', 10),rentBookUpdate)
userRouter.put('/rent-book-update/:bookId', verifyToken, upload.array('images', 10),rentBookUpdate);

userRouter.post('/create-cart-item',verifyToken,saveCart);

userRouter.put('/cart-item-update/:cartId',verifyToken,updateCart)
userRouter.put('/update-order-status/:selectedOrderId',verifyToken,updateOrderStatus)


export default userRouter 



