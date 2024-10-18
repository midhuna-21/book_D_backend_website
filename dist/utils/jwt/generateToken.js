"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateTokens = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("../../config/config"));
const generateTokens = (res, payload) => {
    const accessToken = jsonwebtoken_1.default.sign({ userId: payload.userId, userRole: payload.userRole }, config_1.default.JWT_SECRET, {
        expiresIn: '1m'
    });
    const refreshToken = jsonwebtoken_1.default.sign({ userId: payload.userId, userRole: payload.userRole }, config_1.default.JWT_SECRET, {
        expiresIn: '30d'
    });
    const cookieName = payload.userRole === 'admin' ? 'adminrefreshToken' : 'userrefreshToken';
    res.cookie(cookieName, refreshToken, {
        httpOnly: true,
        sameSite: 'none',
        secure: true,
        maxAge: 30 * 24 * 60 * 60 * 1000,
    });
    return { accessToken, refreshToken };
};
exports.generateTokens = generateTokens;
//# sourceMappingURL=generateToken.js.map