"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const userRepository_1 = require("../respository/userRepository");
const userRepository = new userRepository_1.UserRepository();
class UserService {
    async getCreateUser(data) {
        try {
            return await userRepository.createUser(data);
        }
        catch (error) {
            console.log("Error getUserByGmail:", error);
            throw error;
        }
    }
    async getDeleteUserImage(userId) {
        try {
            const user = await userRepository.deleteUserImage(userId);
            return user;
        }
        catch (error) {
            console.log("Error getDeleteUserImage:", error);
            throw error;
        }
    }
    async getUserByEmail(email) {
        try {
            return await userRepository.findUserByEmail(email);
        }
        catch (error) {
            console.log("Error getUserByEmail:", error);
            throw error;
        }
    }
    async getUserByPhone(phone) {
        try {
            return await userRepository.findUserByPhone(phone);
        }
        catch (error) {
            console.log("Error getUserByPhone:", error);
            throw error;
        }
    }
    async getUserByGmail(email) {
        try {
            return await userRepository.findByGmail(email);
        }
        catch (error) {
            console.log("Error getUserByGmail:", error);
            throw error;
        }
    }
    async getUpdateIsGoogleTrue(email) {
        try {
            return await userRepository.findUpdateIsGoogleTrue(email);
        }
        catch (error) {
            console.log("Error getUpdateIsGoogleTrue:", error);
            throw error;
        }
    }
    async getUserByName(name) {
        try {
            return await userRepository.findByUserName(name);
        }
        catch (error) {
            console.log("Error getUserByName:", error);
            throw error;
        }
    }
    async getCreateUserByGoogle(data) {
        try {
            return await userRepository.createUserByGoogle(data);
        }
        catch (error) {
            console.log("Error getCreateUserByGoogle:", error);
            throw error;
        }
    }
    async getUpdatePassword(data) {
        try {
            return await userRepository.updatePassword(data);
        }
        catch (error) {
            console.log("Error getUpdatePassword:", error);
            throw error;
        }
    }
    async getUserById(lenderId) {
        try {
            return await userRepository.findUserById(lenderId);
        }
        catch (error) {
            console.log("Error getUserById:", error);
            throw error;
        }
    }
    async getUpdateUser(userId, filteredUser) {
        try {
            console.log(filteredUser, "filterd user at service ");
            return await userRepository.updateUser(userId, filteredUser);
        }
        catch (error) {
            console.log("Error getUpdateUser:", error);
            throw error;
        }
    }
    async getActiveUsers() {
        try {
            return await userRepository.activeUsers();
        }
        catch (error) {
            console.log("Error getAllUsers:", error);
            throw error;
        }
    }
    async getUpdateProfileImage(userId, imageUrl) {
        try {
            return await userRepository.updateProfileImage(userId, imageUrl);
        }
        catch (error) {
            console.log("Error getUpdateProfileImage:", error);
            throw error;
        }
    }
    async getSaveToken(userId, resetToken, resetTokenExpiration) {
        try {
            return await userRepository.saveToken(userId, resetToken, resetTokenExpiration);
        }
        catch (error) {
            console.log("Error saveToken:", error);
        }
    }
    async getUpdateIsGoogle(gmail, resetToken, resetTokenExpiration) {
        try {
            return await userRepository.updateIsGoogle(gmail, resetToken, resetTokenExpiration);
        }
        catch (error) {
            console.log("Error getUpdateIsGoogle:", error);
            throw error;
        }
    }
}
exports.UserService = UserService;
//# sourceMappingURL=userService.js.map