"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkBlocked = void 0;
const userRepository_1 = require("../../respository/user/userRepository");
const userService_1 = require("../../services/user/userService");
const userRepository = new userRepository_1.UserRepository();
const userService = new userService_1.UserService(userRepository);
const checkBlocked = async (req, res, next) => {
    const userId = req.userId;
    const user = await userService.getUserById(userId);
    if (user && user.isBlocked) {
        return res
            .status(403)
            .json({ message: "Your account has been blocked." });
    }
    next();
};
exports.checkBlocked = checkBlocked;
//# sourceMappingURL=checkUserBlock.js.map