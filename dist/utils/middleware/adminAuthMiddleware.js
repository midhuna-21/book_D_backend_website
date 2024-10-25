"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminVerifyToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("../../config/config"));
const adminVerifyToken = (req, res, next) => {
    const token = req.headers["authorization"];
    if (!token) {
        return res.status(403).json({ message: "No token provided!" });
    }
    const accessToken = token.split(" ")[1];
    jsonwebtoken_1.default.verify(accessToken, config_1.default.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: "Unauthorized!" });
        }
        if (decoded && decoded.role === "admin") {
            req.adminId = decoded.userId;
        }
        else {
            return res
                .status(403)
                .json({ message: "Forbidden: Access denied" });
        }
        next();
    });
};
exports.adminVerifyToken = adminVerifyToken;
//# sourceMappingURL=adminAuthMiddleware.js.map