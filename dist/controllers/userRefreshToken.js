"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRefreshToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const userService_1 = require("../services/user/userService");
const userGenerateToken_1 = require("../utils/jwt/userGenerateToken");
const config_1 = __importDefault(require("../config/config"));
const userRepository_1 = require("../respository/user/userRepository");
const userRepository = new userRepository_1.UserRepository();
const userService = new userService_1.UserService(userRepository);
const userRefreshToken = async (req, res) => {
    try {
        const role = req.body.role;
        const cookieName = "userrefreshToken";
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
        let user;
        if (role === "user") {
            user = await userService.getUserById(decoded.userId);
            if (user?.isBlocked) {
                return res.status(401).json({ message: "User is blocked" });
            }
        }
        else {
            return res.status(401).json({ message: "Invalid user role" });
        }
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const userId = user._id.toString();
        const tokens = (0, userGenerateToken_1.generateUserTokens)(res, { userId, role });
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
exports.userRefreshToken = userRefreshToken;
//# sourceMappingURL=userRefreshToken.js.map