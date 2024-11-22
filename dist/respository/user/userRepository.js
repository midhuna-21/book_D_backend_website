"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepository = void 0;
const userModel_1 = require("../../model/userModel");
class UserRepository {
    async findUserNotVerified(userId) {
        try {
            return await userModel_1.user.findById({ _id: userId, isEmailVerified: false });
        }
        catch (error) {
            console.log("Error findUserNotVerified:", error);
            throw error;
        }
    }
    async findUserIsVerified(email) {
        try {
            return await userModel_1.user.findOne({ email: email, isEmailVerified: true });
        }
        catch (error) {
            console.log("Error findUserNotVerified:", error);
            throw error;
        }
    }
    async findUpdateUserIsVerified(userId) {
        try {
            return await userModel_1.user.findByIdAndUpdate({ _id: userId }, { isEmailVerified: true });
        }
        catch (error) {
            console.log("Error findUpdateUserIsVerified:", error);
            throw error;
        }
    }
    async findUpdateUserOtp(userId, otp) {
        try {
            return await userModel_1.user.findByIdAndUpdate({ _id: userId }, { otp: otp });
        }
        catch (error) {
            console.log("Error findUpdateUserOtp:", error);
            throw error;
        }
    }
    async findUserByEmail(email) {
        try {
            return await userModel_1.user.findOne({ email, isEmailVerified: true });
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
    async findCreateUser(data) {
        try {
            return new userModel_1.user({
                name: data.name,
                email: data.email,
                phone: data.phone,
                password: data.password,
                otp: data.otp,
            }).save();
        }
        catch (error) {
            console.log("Error createUser:", error);
            throw error;
        }
    }
    async findCreateUserByGoogle(data) {
        try {
            return new userModel_1.user({
                name: data.name,
                email: data.email,
                image: data.image,
                isGoogle: true,
                isEmailVerified: true,
            }).save();
        }
        catch (error) {
            console.log("Error createUserByGoogle:", error);
            throw error;
        }
    }
    async findUpdatePassword(data) {
        try {
            return await userModel_1.user.findOneAndUpdate({ email: data.email }, {
                $set: {
                    password: data.password,
                    resetToken: undefined,
                    resetTokenExpiration: undefined,
                },
            });
        }
        catch (error) {
            console.log("Error updatePassword:", error);
            throw error;
        }
    }
    async findUpdateProfilePassword(userId, password) {
        try {
            return await userModel_1.user.findOneAndUpdate({ _id: userId }, {
                $set: {
                    password: password,
                },
            });
        }
        catch (error) {
            console.log("Error updatePassword:", error);
            throw error;
        }
    }
    async findUserById(_id) {
        try {
            return await userModel_1.user.findById(_id);
        }
        catch (error) {
            console.log("Error findUserById:", error);
            throw error;
        }
    }
    async findUpdateUser(userId, filteredUser) {
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
                        street: filteredUser.address?.street ||
                            userToUpdate.address?.street,
                        city: filteredUser.address?.city ||
                            userToUpdate.address?.city,
                        district: filteredUser.address?.district ||
                            userToUpdate.address?.district,
                        state: filteredUser.address?.state ||
                            userToUpdate.address?.state,
                        pincode: filteredUser.address?.pincode ||
                            userToUpdate.address?.pincode,
                    },
                };
                const updatedUser = await userModel_1.user.findByIdAndUpdate(userId, updateFields, { new: true });
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
    async findActiveUsers() {
        try {
            const users = await userModel_1.user.find({
                isBlocked: false,
                isEmailVerified: true,
            });
            return users;
        }
        catch (error) {
            console.log("Error getActiveUsers:", error);
            throw error;
        }
    }
    async findUpdateProfileImage(userId, imageUrl) {
        try {
            return await userModel_1.user.findByIdAndUpdate(userId, { image: imageUrl }, { new: true });
        }
        catch (error) {
            console.log("Error updateProfileImage:", error);
            throw error;
        }
    }
    async findDeleteUserImage(userId) {
        try {
            return await userModel_1.user.findByIdAndUpdate(userId, { $unset: { image: "" } }, { new: true });
        }
        catch (error) {
            console.log("Error findDeleteUserImage:", error);
            throw error;
        }
    }
    async findSaveToken(userId, resetToken, resetTokenExpiration) {
        try {
            return await userModel_1.user.findByIdAndUpdate(userId, { resetToken, resetTokenExpiration }, { new: true });
        }
        catch (error) {
            console.log("Error saveToken:", error);
            throw error;
        }
    }
    async findUpdateIsGoogle(gmail, resetToken, resetTokenExpiration) {
        try {
            const update = await userModel_1.user.findOneAndUpdate({ email: gmail }, {
                isGoogle: false,
                resetToken: null,
                resetTokenExpiration: null,
            }, { new: true });
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