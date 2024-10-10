"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const adminController_1 = require("../controllers/adminController");
const store_1 = __importDefault(require("../utils/imageFunctions/store"));
const authMiddleware_1 = require("../utils/middleware/authMiddleware");
const adminRouter = express_1.default.Router();
adminRouter.post("/admin-login", adminController_1.adminLogin);
// add genre
adminRouter.post("/add-genre", authMiddleware_1.verifyToken, store_1.default.single("file"), adminController_1.addGenre);
adminRouter.get("/genres", authMiddleware_1.verifyToken, adminController_1.genresList);
adminRouter.get("/genre/:genreId", authMiddleware_1.verifyToken, adminController_1.genre);
adminRouter.post("/genre-update/:genreId", authMiddleware_1.verifyToken, store_1.default.single("file"), adminController_1.updateGenre);
// get-users
adminRouter.get("/get-users", authMiddleware_1.verifyToken, adminController_1.getUsersList);
// block-user
adminRouter.post("/block-user", authMiddleware_1.verifyToken, adminController_1.blockUser);
// unblock-user
adminRouter.post("/unblock-user", authMiddleware_1.verifyToken, adminController_1.unBlockUser);
adminRouter.get("/total-rented-books", authMiddleware_1.verifyToken, adminController_1.totalRentedBooks);
adminRouter.get("/total-sold-books", authMiddleware_1.verifyToken, adminController_1.totalSoldBooks);
adminRouter.get("/total-books", authMiddleware_1.verifyToken, adminController_1.totalBooks);
adminRouter.get("/get-rental-orders", authMiddleware_1.verifyToken, adminController_1.allOrders);
adminRouter.get("/order-detail/:orderId", authMiddleware_1.verifyToken, adminController_1.orderDetail);
adminRouter.get("/get-wallet-transactions", authMiddleware_1.verifyToken, adminController_1.walletTransactions);
exports.default = adminRouter;
//# sourceMappingURL=adminRoute.js.map