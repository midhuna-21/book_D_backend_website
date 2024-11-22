import { User } from "../../interfaces/data";
import { IUser } from "../../model/userModel";
import { IUserService } from "./userServiceInterface";
import { IUserRepository } from "../../respository/user/userRepositoryInterface";

export class UserService implements IUserService {
    private userRepository: IUserRepository;

    constructor(userRepository: IUserRepository) {
        this.userRepository = userRepository;
    }

    async getCreateUser(data: Partial<User>): Promise<IUser | null> {
        try {
            return await this.userRepository.findCreateUser(data);
        } catch (error) {
            console.log("Error getCreateUser:", error);
            throw error;
        }
    }

    async getUserNotVerified(userId: string): Promise<IUser | null> {
        try {
            return await this.userRepository.findUserNotVerified(userId);
        } catch (error) {
            console.log("Error getCreateUser:", error);
            throw error;
        }
    }
    async getUserIsVerified(email: string): Promise<IUser | null> {
        try {
            return await this.userRepository.findUserIsVerified(email);
        } catch (error) {
            console.log("Error getUserIsVerified:", error);
            throw error;
        }
    }
    async getUpdateUserIsVerified(userId: string): Promise<IUser | null> {
        try {
            return await this.userRepository.findUpdateUserIsVerified(userId);
        } catch (error) {
            console.log("Error getUpdateUserIsVerified:", error);
            throw error;
        }
    }

    async getUpdateUserOtp(userId: string, otp: number): Promise<IUser | null> {
        try {
            return await this.userRepository.findUpdateUserOtp(userId, otp);
        } catch (error) {
            console.log("Error getUpdateUserOtp:", error);
            throw error;
        }
    }
    async getDeleteUserImage(userId: string): Promise<IUser | null> {
        try {
            const user = await this.userRepository.findDeleteUserImage(userId);
            return user;
        } catch (error) {
            console.log("Error getDeleteUserImage:", error);
            throw error;
        }
    }

    async getUserByEmail(email: string): Promise<IUser | null> {
        try {
            return await this.userRepository.findUserByEmail(email);
        } catch (error) {
            console.log("Error getUserByEmail:", error);
            throw error;
        }
    }

    async getUserByGmail(email: string): Promise<IUser | null> {
        try {
            return await this.userRepository.findByGmail(email);
        } catch (error) {
            console.log("Error getUserByGmail:", error);
            throw error;
        }
    }

    async getUpdateIsGoogleTrue(email: string) {
        try {
            return await this.userRepository.findUpdateIsGoogleTrue(email);
        } catch (error: any) {
            console.log("Error getUpdateIsGoogleTrue:", error);
            throw error;
        }
    }

    async getCreateUserByGoogle(data: User): Promise<IUser | null> {
        try {
            return await this.userRepository.findCreateUserByGoogle(data);
        } catch (error) {
            console.log("Error getCreateUserByGoogle:", error);
            throw error;
        }
    }

    async getUpdatePassword(data: User): Promise<IUser | null> {
        try {
            return await this.userRepository.findUpdatePassword(data);
        } catch (error) {
            console.log("Error getUpdatePassword:", error);
            throw error;
        }
    }

    async getUserById(userId: string): Promise<IUser | null> {
        try {
            return await this.userRepository.findUserById(userId);
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
            return await this.userRepository.findUpdateUser(
                userId,
                filteredUser
            );
        } catch (error) {
            console.log("Error getUpdateUser:", error);
            throw error;
        }
    }

    async getActiveUsers(): Promise<IUser[]> {
        try {
            return await this.userRepository.findActiveUsers();
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
            return await this.userRepository.findUpdateProfileImage(
                userId,
                imageUrl
            );
        } catch (error) {
            console.log("Error getUpdateProfileImage:", error);
            throw error;
        }
    }

    async getSaveToken(
        userId: string,
        resetToken: string,
        resetTokenExpiration: number
    ): Promise<IUser | null> {
        try {
            const result = await this.userRepository.findSaveToken(
                userId,
                resetToken,
                resetTokenExpiration
            );
            return result || null;
        } catch (error) {
            console.log("Error saveToken:", error);
            return null;
        }
    }

    async getUpdateIsGoogle(
        gmail: string,
        resetToken: string,
        resetTokenExpiration: number
    ) {
        try {
            return await this.userRepository.findUpdateIsGoogle(
                gmail,
                resetToken,
                resetTokenExpiration
            );
        } catch (error) {
            console.log("Error getUpdateIsGoogle:", error);
            throw error;
        }
    }

    async getUpdateProfilePassword(
        userId: string,
        password: string
    ): Promise<IUser | null> {
        try {
            return await this.userRepository.findUpdateProfilePassword(
                userId,
                password
            );
        } catch (error) {
            console.log("Error getUpdateIsGoogle:", error);
            throw error;
        }
    }
}
