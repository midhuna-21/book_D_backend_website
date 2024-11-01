import express, { Request, Response } from "express";
import {
    addGenre,
    adminLogin,
    getUsersList,
    genresList,
    genre,
    blockUser,
    updateGenre,
    unBlockUser,
    totalRentedBooks,
    totalBooks,
    allOrders,
    orderDetail,
    walletTransactions,
    deleteGenre
} from "../controllers/adminController";
import upload from "../utils/imageFunctions/store";
import { adminVerifyToken } from "../utils/middleware/adminAuthMiddleware";

const adminRouter = express.Router();

adminRouter.post("/admin-login", adminLogin);

adminRouter.post("/add-genre", adminVerifyToken, upload.single("file"), addGenre);

adminRouter.get("/genres", adminVerifyToken, genresList);

adminRouter.get("/genre/:genreId", adminVerifyToken, genre);

adminRouter.post(
    "/genre-update/:genreId",
    adminVerifyToken,
    upload.single("file"),
    updateGenre
);

adminRouter.get("/get-users", adminVerifyToken, getUsersList);

adminRouter.post("/block-user", adminVerifyToken, blockUser);

adminRouter.post("/unblock-user", adminVerifyToken, unBlockUser);

adminRouter.get("/total-rented-books", adminVerifyToken, totalRentedBooks);

adminRouter.get("/total-books", adminVerifyToken, totalBooks);

adminRouter.get("/get-rental-orders", adminVerifyToken, allOrders);

adminRouter.get("/order-detail/:orderId", adminVerifyToken, orderDetail);

adminRouter.get("/bookd-wallet", adminVerifyToken, walletTransactions);

adminRouter.post('/delete-genre',adminVerifyToken,deleteGenre)

// adminRouter.get("/bookd-wallet", verifyToken,walletTransactions);


export default adminRouter;
