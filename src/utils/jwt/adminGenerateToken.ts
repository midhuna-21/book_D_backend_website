import jwt, { SignOptions } from "jsonwebtoken";
import { Response } from "express";
import config from "../../config/config";

interface AdminTokenPayload {
    adminId?: string;
    role: string;
}

const generateAdminTokens = (
    res: Response,
    payload: AdminTokenPayload
): { accessToken: string; refreshToken: string } => {
    const accessToken = jwt.sign(
        { adminId: payload.adminId, role: payload.role },
        config.JWT_SECRET as string,
        {
            expiresIn: "1h",
        } as SignOptions
    );

    const refreshToken = jwt.sign(
        { adminId: payload.adminId, role: payload.role },
        config.JWT_SECRET as string,
        {
            expiresIn: "30d",
        } as SignOptions
    );

    const cookieName = "adminrefreshToken";

    res.cookie(cookieName, refreshToken, {
        httpOnly: true,
        sameSite: "none",
        secure: true,
        maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    return { accessToken, refreshToken };
};

export { generateAdminTokens };
