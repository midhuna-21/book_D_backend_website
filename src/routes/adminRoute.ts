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
    totalSoldBooks,
    totalBooks,
    allOrders,
    orderDetail,
    walletTransactions,
} from "../controllers/adminController";
import upload from "../utils/imageFunctions/store";
import { verifyToken } from "../utils/middleware/authMiddleware";

const adminRouter = express.Router();

adminRouter.post("/admin-login", adminLogin);

// add genre

adminRouter.post("/add-genre", verifyToken, upload.single("file"), addGenre);

adminRouter.get("/genres", verifyToken, genresList);

adminRouter.get("/genre/:genreId", verifyToken, genre);

adminRouter.post(
    "/genre-update/:genreId",
    verifyToken,
    upload.single("file"),
    updateGenre
);
// get-users
adminRouter.get("/get-users", verifyToken, getUsersList);
// block-user
adminRouter.post("/block-user", verifyToken, blockUser);
// unblock-user
adminRouter.post("/unblock-user", verifyToken, unBlockUser);

adminRouter.get("/total-rented-books", verifyToken, totalRentedBooks);

adminRouter.get("/total-sold-books", verifyToken, totalSoldBooks);

adminRouter.get("/total-books", verifyToken, totalBooks);

adminRouter.get("/get-rental-orders", verifyToken, allOrders);
adminRouter.get("/order-detail/:orderId", verifyToken, orderDetail);
adminRouter.get("/get-wallet-transactions", verifyToken, walletTransactions);

export default adminRouter;
