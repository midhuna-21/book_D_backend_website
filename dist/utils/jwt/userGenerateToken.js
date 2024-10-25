"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userGenerateTokens = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("../../config/config"));
const userGenerateTokens = (res, payload) => {
    const accessToken = jsonwebtoken_1.default.sign({ userId: payload.userId, role: payload.role }, config_1.default.JWT_SECRET, {
        expiresIn: "1h",
    });
    const refreshToken = jsonwebtoken_1.default.sign({ userId: payload.userId, role: payload.role }, config_1.default.JWT_SECRET, {
        expiresIn: "30d",
    });
    const cookieName = "userrefreshToken";
    res.cookie(cookieName, refreshToken, {
        httpOnly: true,
        sameSite: "none",
        secure: true,
        maxAge: 30 * 24 * 60 * 60 * 1000,
    });
    return { accessToken, refreshToken };
};
exports.userGenerateTokens = userGenerateTokens;
//# sourceMappingURL=userGenerateToken.js.map