"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const adminController_1 = require("../controllers/adminController");
const store_1 = __importDefault(require("../utils/imageFunctions/store"));
const adminAuthMiddleware_1 = require("../utils/middleware/adminAuthMiddleware");
const adminRefreshToken_1 = require("../controllers/adminRefreshToken");
const adminRoutes = express_1.default.Router();
adminRoutes.post("/refresh-token", adminRefreshToken_1.adminRefreshToken);
adminRoutes.post("/login", adminController_1.authenticateAdmin);
adminRoutes.post("/genres/create", adminAuthMiddleware_1.adminVerifyToken, store_1.default.single("file"), adminController_1.createGenre);
adminRoutes.get("/genres", adminAuthMiddleware_1.adminVerifyToken, adminController_1.fetchGenres);
adminRoutes.get("/genres/:genreId", adminAuthMiddleware_1.adminVerifyToken, adminController_1.fetchGenreById);
adminRoutes.put("/genres/update/:genreId", adminAuthMiddleware_1.adminVerifyToken, store_1.default.single("file"), adminController_1.updateGenre);
adminRoutes.post("/genres/remove", adminAuthMiddleware_1.adminVerifyToken, adminController_1.removeGenre);
adminRoutes.get("/users", adminAuthMiddleware_1.adminVerifyToken, adminController_1.fetchUsers);
adminRoutes.post("/user/block", adminAuthMiddleware_1.adminVerifyToken, adminController_1.blockUserAccount);
adminRoutes.post("/user/unblock", adminAuthMiddleware_1.adminVerifyToken, adminController_1.unblockUserAccount);
adminRoutes.get("/books/lent", adminAuthMiddleware_1.adminVerifyToken, adminController_1.fetchLentBooks);
adminRoutes.get("/books", adminAuthMiddleware_1.adminVerifyToken, adminController_1.fetchBooks);
adminRoutes.get("/orders", adminAuthMiddleware_1.adminVerifyToken, adminController_1.fetchOrders);
adminRoutes.get("/books/rental-orders", adminAuthMiddleware_1.adminVerifyToken, adminController_1.fetchRentalOrders);
adminRoutes.get("/books/rental-order/:orderId", adminAuthMiddleware_1.adminVerifyToken, adminController_1.fetchRentalOrderDetails);
adminRoutes.get("/wallet/transactions", adminAuthMiddleware_1.adminVerifyToken, adminController_1.fetchWalletTransactions);
exports.default = adminRoutes;
//# sourceMappingURL=adminRoute.js.map