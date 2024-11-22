import { NextFunction, Request, Response } from "express";
import { UserRepository } from "../../respository/user/userRepository";
import { UserService } from "../../services/user/userService";
import { AuthenticatedRequest } from "./userAuthMiddleware";

const userRepository = new UserRepository();
const userService = new UserService(userRepository);

export const checkBlocked = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
) => {
    const userId = req.userId;
    const user = await userService.getUserById(userId!);

    if (user && user.isBlocked) {
        return res
            .status(403)
            .json({ message: "Your account has been blocked." });
    }

    next();
};
