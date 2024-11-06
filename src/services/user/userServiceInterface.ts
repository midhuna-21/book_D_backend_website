import { IUser } from "../../model/userModel";
import { User } from "../../interfaces/data";

export interface IUserService {
    getCreateUser(data: User): Promise<IUser | null>;
    getDeleteUserImage(userID: string): Promise<IUser | null>;
    getUserByEmail(email: string): Promise<IUser | null>;
    getUserByPhone(phone: string): Promise<IUser | null>;
    getUserByGmail(email: string): Promise<IUser | null>;
    getUpdateIsGoogleTrue(email: string): Promise<IUser | null>;
    getCreateUserByGoogle(data: User): Promise<IUser | null>;
    getUpdatePassword(data: User): Promise<IUser | null>;
    getUserById(lenderId: string): Promise<IUser | null>;
    getUpdateUser(userId: string, filteredUser: User): Promise<IUser | null>;
    getActiveUsers(): Promise<IUser[]>;
    getUpdateProfileImage(
        userId: string,
        imageUrl: string
    ): Promise<IUser | null>;
    getSaveToken(
        userId: string,
        resetToken: string,
        resetTokenExpiration: number
    ): Promise<IUser | null>;
    getUserByPhone(phone: string): Promise<IUser | null>;
    getUserByPhone(phone: string): Promise<IUser | null>;
}
