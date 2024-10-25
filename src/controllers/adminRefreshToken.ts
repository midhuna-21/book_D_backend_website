import { Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { adminGenerateTokens } from "../utils/jwt/adminGenerateToken";
import config from "../config/config";
import { adminService } from "../services";


const adminRefreshTokenController = async (req: Request, res: Response) => {
    try {
        const role = req.body.role;
        const cookieName = "adminrefreshToken";
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

        let admin;
        if (role) {
            admin = await adminService.getAdminById(decoded.adminId);
        } else {
            return res.status(401).json({ message: "Invalid user role" });
        }

        if (!admin) {
            return res.status(404).json({ message: "User not found" });
        }

        const adminId = (admin._id as unknown as string).toString();
        const tokens = adminGenerateTokens(res, { adminId, role });

        return res.status(200).json({
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken,
        });
    } catch (error) {
        console.error("Error in refreshTokenController", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export { adminRefreshTokenController };
