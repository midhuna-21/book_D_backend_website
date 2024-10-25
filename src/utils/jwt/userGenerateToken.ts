import jwt, { SignOptions } from "jsonwebtoken";
import { Response } from "express";
import config from "../../config/config";

interface UserTokenPayload {
    userId?: string;
    role: string;
}

const userGenerateTokens = (
    res: Response,
    payload: UserTokenPayload
): { accessToken: string; refreshToken: string } => {
    const accessToken = jwt.sign(
        { userId: payload.userId, role: payload.role },
        config.JWT_SECRET as string,
        {
            expiresIn: "1h",
        } as SignOptions
    );

    const refreshToken = jwt.sign(
        { userId: payload.userId, role: payload.role },
        config.JWT_SECRET as string,
        {
            expiresIn: "30d",
        } as SignOptions
    );

    const cookieName = "userrefreshToken";

    res.cookie(cookieName, refreshToken, {
        httpOnly: true,
        sameSite: "none",
        secure: true,
        maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    return { accessToken, refreshToken };
};

export { userGenerateTokens };
