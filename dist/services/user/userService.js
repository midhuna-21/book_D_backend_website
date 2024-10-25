"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
class UserService {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    async getCreateUser(data) {
        try {
            return await this.userRepository.findCreateUser(data);
        }
        catch (error) {
            console.log("Error getUserByGmail:", error);
            throw error;
        }
    }
    async getDeleteUserImage(userId) {
        try {
            const user = await this.userRepository.findDeleteUserImage(userId);
            return user;
        }
        catch (error) {
            console.log("Error getDeleteUserImage:", error);
            throw error;
        }
    }
    async getUserByEmail(email) {
        try {
            return await this.userRepository.findUserByEmail(email);
        }
        catch (error) {
            console.log("Error getUserByEmail:", error);
            throw error;
        }
    }
    async getUserByPhone(phone) {
        try {
            return await this.userRepository.findUserByPhone(phone);
        }
        catch (error) {
            console.log("Error getUserByPhone:", error);
            throw error;
        }
    }
    async getUserByGmail(email) {
        try {
            return await this.userRepository.findByGmail(email);
        }
        catch (error) {
            console.log("Error getUserByGmail:", error);
            throw error;
        }
    }
    async getUpdateIsGoogleTrue(email) {
        try {
            return await this.userRepository.findUpdateIsGoogleTrue(email);
        }
        catch (error) {
            console.log("Error getUpdateIsGoogleTrue:", error);
            throw error;
        }
    }
    async getUserByName(name) {
        try {
            return await this.userRepository.findByUserName(name);
        }
        catch (error) {
            console.log("Error getUserByName:", error);
            throw error;
        }
    }
    async getCreateUserByGoogle(data) {
        try {
            return await this.userRepository.findCreateUserByGoogle(data);
        }
        catch (error) {
            console.log("Error getCreateUserByGoogle:", error);
            throw error;
        }
    }
    async getUpdatePassword(data) {
        try {
            return await this.userRepository.findUpdatePassword(data);
        }
        catch (error) {
            console.log("Error getUpdatePassword:", error);
            throw error;
        }
    }
    async getUserById(lenderId) {
        try {
            return await this.userRepository.findUserById(lenderId);
        }
        catch (error) {
            console.log("Error getUserById:", error);
            throw error;
        }
    }
    async getUpdateUser(userId, filteredUser) {
        try {
            console.log(filteredUser, "filterd user at service ");
            return await this.userRepository.findUpdateUser(userId, filteredUser);
        }
        catch (error) {
            console.log("Error getUpdateUser:", error);
            throw error;
        }
    }
    async getActiveUsers() {
        try {
            return await this.userRepository.findActiveUsers();
        }
        catch (error) {
            console.log("Error getAllUsers:", error);
            throw error;
        }
    }
    async getUpdateProfileImage(userId, imageUrl) {
        try {
            return await this.userRepository.findUpdateProfileImage(userId, imageUrl);
        }
        catch (error) {
            console.log("Error getUpdateProfileImage:", error);
            throw error;
        }
    }
    async getSaveToken(userId, resetToken, resetTokenExpiration) {
        try {
            const result = await this.userRepository.findSaveToken(userId, resetToken, resetTokenExpiration);
            return result || null;
        }
        catch (error) {
            console.log("Error saveToken:", error);
            return null;
        }
    }
    async getUpdateIsGoogle(gmail, resetToken, resetTokenExpiration) {
        try {
            return await this.userRepository.findUpdateIsGoogle(gmail, resetToken, resetTokenExpiration);
        }
        catch (error) {
            console.log("Error getUpdateIsGoogle:", error);
            throw error;
        }
    }
}
exports.UserService = UserService;
//# sourceMappingURL=userService.js.map