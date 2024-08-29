import express, { Request, Response } from 'express';
import { addGenre, adminLogin,getUsersList ,blockUser,unBlockUser,totalRentedBooks,totalSoldBooks,totalBooks} from '../controllers/adminController';
import upload from '../utils/imageFunctions/store';
import {verifyToken} from '../utils/middleware/authMiddleware';

const adminRouter = express.Router()

adminRouter.post('/admin-login',adminLogin)

// add genre

adminRouter.post('/add-genre',verifyToken,upload.single('file'),addGenre);

// get-users
adminRouter.get('/get-users',verifyToken,getUsersList)
// block-user
adminRouter.post('/block-user',verifyToken,blockUser)
// unblock-user
adminRouter.post('/unblock-user',verifyToken,unBlockUser)

adminRouter.get('/total-rented-books',verifyToken,totalRentedBooks)

adminRouter.get('/total-sold-books',verifyToken,totalSoldBooks)

adminRouter.get('/total-books',verifyToken,totalBooks)

export default adminRouter 


 