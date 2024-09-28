"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepository = void 0;
const userModel_1 = require("../model/userModel");
class UserRepository {
    async findUserByPhone(phone) {
        try {
            const phoneNumber = await userModel_1.user.findOne({ phone: phone });
            return phoneNumber;
        }
        catch (error) {
            console.log("Error findUserByPhone:", error);
            throw error;
        }
    }
    async findUserByEmail(email) {
        try {
            return await userModel_1.user.findOne({ email });
        }
        catch (error) {
            console.log("Error findUserByEmail:", error);
            throw error;
        }
    }
    async findByGmail(email) {
        try {
            return await userModel_1.user.findOne({ email, isGoogle: true });
        }
        catch (error) {
            console.log("Error findByGmail:", error);
            throw error;
        }
    }
    async findUpdateIsGoogleTrue(email) {
        try {
            return await userModel_1.user.findOneAndUpdate({ email: email }, { isGoogle: true, password: null }, { new: true });
        }
        catch (error) {
            console.log("Error findUpdateIsGoogleTrue:", error);
            throw error;
        }
    }
    async createUser(data) {
        try {
            return new userModel_1.user({
                name: data.name,
                email: data.email,
                phone: data.phone,
                password: data.password,
            }).save();
        }
        catch (error) {
            console.log("Error createUser:", error);
            throw error;
        }
    }
    async findByUserName(name) {
        try {
            return userModel_1.user.findOne({ name });
        }
        catch (error) {
            console.log("Error findByUserName:", error);
            throw error;
        }
    }
    async createUserByGoogle(data) {
        try {
            return new userModel_1.user({
                name: data.name,
                email: data.email,
                image: data.image,
                isGoogle: true,
            }).save();
        }
        catch (error) {
            console.log("Error createUserByGoogle:", error);
            throw error;
        }
    }
    async updatePassword(data) {
        try {
            return await userModel_1.user.findOneAndUpdate({ email: data.email }, { $set: { password: data.password, resetToken: undefined, resetTokenExpiration: undefined } });
        }
        catch (error) {
            console.log("Error updatePassword:", error);
            throw error;
        }
    }
    async findUserById(_id) {
        try {
            const lender = await userModel_1.user.findById(_id);
            return lender;
        }
        catch (error) {
            console.log("Error findUserById:", error);
            throw error;
        }
    }
    async updateUser(userId, filteredUser) {
        try {
            const userToUpdate = await this.findUserById(userId);
            if (!userToUpdate) {
                console.log("Error finding the user to update:");
                return null;
            }
            else {
                const updateFields = {
                    name: filteredUser.name || userToUpdate.name,
                    email: filteredUser.email || userToUpdate.email,
                    phone: filteredUser.phone || userToUpdate.phone,
                    address: {
                        street: filteredUser.address?.street || userToUpdate.address?.street,
                        city: filteredUser.address?.city || userToUpdate.address?.city,
                        district: filteredUser.address?.district || userToUpdate.address?.district,
                        state: filteredUser.address?.state || userToUpdate.address?.state,
                        pincode: filteredUser.address?.pincode || userToUpdate.address?.pincode,
                    }
                };
                const updatedUser = await userModel_1.user.findByIdAndUpdate(userId, updateFields, { new: true });
                console.log(updatedUser, 'updatedUser');
                if (!updatedUser) {
                    console.log("Error updating the user:");
                    return null;
                }
                return updatedUser;
            }
        }
        catch (error) {
            console.log("Error findAllGenres:", error);
            throw error;
        }
    }
    async activeUsers() {
        try {
            const users = await userModel_1.user.find({ isBlocked: false });
            return users;
        }
        catch (error) {
            console.log("Error getActiveUsers:", error);
            throw error;
        }
    }
    ;
    async updateProfileImage(userId, imageUrl) {
        try {
            return await userModel_1.user.findByIdAndUpdate(userId, { image: imageUrl }, { new: true });
        }
        catch (error) {
            console.log("Error updateProfileImage:", error);
            throw error;
        }
    }
    async deleteUserImage(userId) {
        try {
            return await userModel_1.user.findByIdAndUpdate(userId, { $unset: { image: "" } }, { new: true });
        }
        catch (error) {
            console.log("Error deleteUserImage:", error);
            throw error;
        }
    }
    async saveToken(userId, resetToken, resetTokenExpiration) {
        try {
            return await userModel_1.user.findByIdAndUpdate(userId, { resetToken, resetTokenExpiration }, { new: true });
        }
        catch (error) {
            console.log('Error saveToken:', error);
            throw error;
        }
    }
    async updateIsGoogle(gmail, resetToken, resetTokenExpiration) {
        try {
            const update = await userModel_1.user.findOneAndUpdate({ email: gmail }, { isGoogle: false, resetToken: null, resetTokenExpiration: null }, { new: true });
            console.log(update, 'update');
            return update;
        }
        catch (error) {
            console.log("Error updateIsGoogle:", error);
            throw error;
        }
    }
}
exports.UserRepository = UserRepository;
//# sourceMappingURL=userRepository.js.map