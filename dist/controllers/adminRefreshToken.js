"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminRefreshTokenController = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const adminGenerateToken_1 = require("../utils/jwt/adminGenerateToken");
const config_1 = __importDefault(require("../config/config"));
const services_1 = require("../services");
const adminRefreshTokenController = async (req, res) => {
    try {
        const role = req.body.role;
        const cookieName = "adminrefreshToken";
        const cookieToken = req.cookies[cookieName];
        if (!cookieToken) {
            return res.status(401).json({
                message: "No token, authorization denied or token mismatch",
            });
        }
        let decoded;
        try {
            decoded = jsonwebtoken_1.default.verify(cookieToken, config_1.default.JWT_SECRET || "");
        }
        catch (err) {
            console.error("Token verification error", err);
            return res.status(401).json({ message: "Invalid token" });
        }
        if (!decoded || typeof decoded === "string") {
            return res.status(401).json({ message: "Invalid token" });
        }
        let admin;
        if (role) {
            admin = await services_1.adminService.getAdminById(decoded.adminId);
        }
        else {
            return res.status(401).json({ message: "Invalid user role" });
        }
        if (!admin) {
            return res.status(404).json({ message: "User not found" });
        }
        const adminId = admin._id.toString();
        const tokens = (0, adminGenerateToken_1.adminGenerateTokens)(res, { adminId, role });
        return res.status(200).json({
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken,
        });
    }
    catch (error) {
        console.error("Error in refreshTokenController", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};
exports.adminRefreshTokenController = adminRefreshTokenController;
//# sourceMappingURL=adminRefreshToken.js.map