"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const adminController_1 = require("../controllers/adminController");
const store_1 = __importDefault(require("../utils/imageFunctions/store"));
const adminAuthMiddleware_1 = require("../utils/middleware/adminAuthMiddleware");
const adminRouter = express_1.default.Router();
adminRouter.post("/admin-login", adminController_1.adminLogin);
// add genre
adminRouter.post("/add-genre", adminAuthMiddleware_1.adminVerifyToken, store_1.default.single("file"), adminController_1.addGenre);
adminRouter.get("/genres", adminAuthMiddleware_1.adminVerifyToken, adminController_1.genresList);
adminRouter.get("/genre/:genreId", adminAuthMiddleware_1.adminVerifyToken, adminController_1.genre);
adminRouter.post("/genre-update/:genreId", adminAuthMiddleware_1.adminVerifyToken, store_1.default.single("file"), adminController_1.updateGenre);
adminRouter.get("/get-users", adminAuthMiddleware_1.adminVerifyToken, adminController_1.getUsersList);
adminRouter.post("/block-user", adminAuthMiddleware_1.adminVerifyToken, adminController_1.blockUser);
adminRouter.post("/unblock-user", adminAuthMiddleware_1.adminVerifyToken, adminController_1.unBlockUser);
adminRouter.get("/total-rented-books", adminAuthMiddleware_1.adminVerifyToken, adminController_1.totalRentedBooks);
adminRouter.get("/total-books", adminAuthMiddleware_1.adminVerifyToken, adminController_1.totalBooks);
adminRouter.get("/get-rental-orders", adminAuthMiddleware_1.adminVerifyToken, adminController_1.allOrders);
adminRouter.get("/order-detail/:orderId", adminAuthMiddleware_1.adminVerifyToken, adminController_1.orderDetail);
adminRouter.get("/bookd-wallet", adminAuthMiddleware_1.adminVerifyToken, adminController_1.walletTransactions);
// adminRouter.get("/bookd-wallet", verifyToken,walletTransactions);
exports.default = adminRouter;
//# sourceMappingURL=adminRoute.js.map