import express from "express";
import {
    createGenre,
    authenticateAdmin,
    fetchUsers,
    fetchGenres,
    fetchGenreById,
    blockUserAccount,
    updateGenre,
    unblockUserAccount,
    fetchLentBooks,
    fetchBooks,
    fetchRentalOrders,
    fetchRentalOrderDetails,
    fetchWalletTransactions,
    removeGenre,
} from "../controllers/adminController";
import upload from "../utils/imageFunctions/store";
import { adminVerifyToken } from "../utils/middleware/adminAuthMiddleware";
import {adminRefreshToken} from '../controllers/adminRefreshToken'

const adminRoutes = express.Router();

adminRoutes.post('/refresh-token',adminRefreshToken)

adminRoutes.post("/login", authenticateAdmin);

adminRoutes.post(
    "/genres/create",
    adminVerifyToken,
    upload.single("file"),
    createGenre
);

adminRoutes.get("/genres", adminVerifyToken, fetchGenres);

adminRoutes.get("/genres/:genreId", adminVerifyToken, fetchGenreById);

adminRoutes.put(
    "/genres/update/:genreId",
    adminVerifyToken,
    upload.single("file"),
    updateGenre
);

adminRoutes.post("/genres/remove", adminVerifyToken, removeGenre);

adminRoutes.get("/users", adminVerifyToken, fetchUsers);

adminRoutes.post("/user/block", adminVerifyToken, blockUserAccount);

adminRoutes.post("/user/unblock", adminVerifyToken, unblockUserAccount);

adminRoutes.get("/books/lent", adminVerifyToken, fetchLentBooks);

adminRoutes.get("/books", adminVerifyToken, fetchBooks);

adminRoutes.get("/books/rental-orders", adminVerifyToken, fetchRentalOrders);

adminRoutes.get(
    "/books/rental-order/:orderId",
    adminVerifyToken,
    fetchRentalOrderDetails
);

adminRoutes.get(
    "/wallet/transactions",
    adminVerifyToken,
    fetchWalletTransactions
);

export default adminRoutes;
