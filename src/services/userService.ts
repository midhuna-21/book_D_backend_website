import { UserRepository } from "../respository/userRepository";
import { User } from "../interfaces/data";
import { IUser } from "../model/userModel";

const userRepository = new UserRepository();

export class UserService {
    async getCreateUser(data: Partial<User>): Promise<IUser | null> {
        try {
            return await userRepository.createUser(data);
        } catch (error) {
            console.log("Error getUserByGmail:", error);
            throw error;
        }
    }

    async getDeleteUserImage(userId: string): Promise<IUser | null> {
        try {
            const user = await userRepository.deleteUserImage(userId);
            return user;
        } catch (error) {
            console.log("Error getDeleteUserImage:", error);
            throw error;
        }
    }

    async getUserByEmail(email: string): Promise<IUser | null> {
        try {
            return await userRepository.findUserByEmail(email);
        } catch (error) {
            console.log("Error getUserByEmail:", error);
            throw error;
        }
    }
    async getUserByPhone(phone: string): Promise<IUser | null> {
        try {
            return await userRepository.findUserByPhone(phone);
        } catch (error) {
            console.log("Error getUserByPhone:", error);
            throw error;
        }
    }

    async getUserByGmail(email: string): Promise<IUser | null> {
        try {
            return await userRepository.findByGmail(email);
        } catch (error) {
            console.log("Error getUserByGmail:", error);
            throw error;
        }
    }

    async getUpdateIsGoogleTrue(email: string) {
        try {
            return await userRepository.findUpdateIsGoogleTrue(email);
        } catch (error: any) {
            console.log("Error getUpdateIsGoogleTrue:", error);
            throw error;
        }
    }

    async getUserByName(name: string): Promise<IUser | null> {
        try {
            return await userRepository.findByUserName(name);
        } catch (error) {
            console.log("Error getUserByName:", error);
            throw error;
        }
    }

    async getCreateUserByGoogle(data: User): Promise<IUser | null> {
        try {
            return await userRepository.createUserByGoogle(data);
        } catch (error) {
            console.log("Error getCreateUserByGoogle:", error);
            throw error;
        }
    }

    async getUpdatePassword(data: User): Promise<IUser | null> {
        try {
            return await userRepository.updatePassword(data);
        } catch (error) {
            console.log("Error getUpdatePassword:", error);
            throw error;
        }
    }

    async getUserById(lenderId: string): Promise<IUser | null> {
        try {
            return await userRepository.findUserById(lenderId);
        } catch (error) {
            console.log("Error getUserById:", error);
            throw error;
        }
    }

    async getUpdateUser(
        userId: string,
        filteredUser: User
    ): Promise<IUser | null> {
        try {
            console.log(filteredUser, "filterd user at service ");
            return await userRepository.updateUser(userId, filteredUser);
        } catch (error) {
            console.log("Error getUpdateUser:", error);
            throw error;
        }
    }

    async getActiveUsers() {
        try {
            return await userRepository.activeUsers();
        } catch (error) {
            console.log("Error getAllUsers:", error);
            throw error;
        }
    }

    async getUpdateProfileImage(
        userId: string,
        imageUrl: string
    ): Promise<IUser | null> {
        try {
            return await userRepository.updateProfileImage(userId, imageUrl);
        } catch (error) {
            console.log("Error getUpdateProfileImage:", error);
            throw error;
        }
    }

    async getSaveToken(
        userId: string,
        resetToken: string,
        resetTokenExpiration: number
    ) {
        try {
            return await userRepository.saveToken(
                userId,
                resetToken,
                resetTokenExpiration
            );
        } catch (error) {
            console.log("Error saveToken:", error);
        }
    }

    async getUpdateIsGoogle(
        gmail: string,
        resetToken: string,
        resetTokenExpiration: number
    ) {
        try {
            return await userRepository.updateIsGoogle(
                gmail,
                resetToken,
                resetTokenExpiration
            );
        } catch (error) {
            console.log("Error getUpdateIsGoogle:", error);
            throw error;
        }
    }
}
