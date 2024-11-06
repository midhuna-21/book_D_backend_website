import { Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { UserService } from "../services/user/userService";
import { generateUserTokens } from "../utils/jwt/userGenerateToken";
import config from "../config/config";
import { UserRepository } from "../respository/user/userRepository";

const userRepository = new UserRepository();
const userService = new UserService(userRepository);

const userRefreshToken = async (req: Request, res: Response) => {
    try {
        const role = req.body.role;
        const cookieName = "userrefreshToken";
        const cookieToken = req.cookies[cookieName];
        if (!cookieToken) {
            return res.status(401).json({
                message: "No token, authorization denied or token mismatch",
            });
        }
        let decoded: JwtPayload;
        try {
            decoded = jwt.verify(
                cookieToken,
                config.JWT_SECRET || ""
            ) as JwtPayload;
        } catch (err) {
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
        } else {
            return res.status(401).json({ message: "Invalid user role" });
        }

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const userId = (user._id as unknown as string).toString();
        const tokens = generateUserTokens(res, { userId, role });
        return res.status(200).json({
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken,
        });
    } catch (error) {
        console.error("Error in refreshTokenController", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export { userRefreshToken };
