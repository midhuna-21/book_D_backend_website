import { IUser } from "../../model/userModel";
import { User } from "../../interfaces/data";

export interface IUserRepository {
    findCreateUser(data: User): Promise<IUser | null>;
    findDeleteUserImage(userID: string): Promise<IUser | null>;
    findUserByEmail(email: string): Promise<IUser | null>;
    findByGmail(email: string): Promise<IUser | null>;
    findUpdateIsGoogleTrue(email: string): Promise<IUser | null>;
    findUpdateIsGoogle(
        gmail: string,
        resetToken: string,
        resetTokenExpiration: number
    ): Promise<IUser | null>;
    findCreateUserByGoogle(data: User): Promise<IUser | null>;
    findUpdatePassword(data: User): Promise<IUser | null>;
    findUpdateProfilePassword(
        userId: string,
        password: string
    ): Promise<IUser | null>;
    findUserById(userId: string): Promise<IUser | null>;
    findUpdateUser(userId: string, filteredUser: User): Promise<IUser | null>;
    findActiveUsers(): Promise<IUser[]>;
    findUpdateProfileImage(
        userId: string,
        imageUrl: string
    ): Promise<IUser | null>;
    findSaveToken(
        userId: string,
        resetToken: string,
        resetTokenExpiration: number
    ): Promise<IUser | null>;
    findUserNotVerified(userId: string): Promise<IUser | null>;
    findUserIsVerified(email: string): Promise<IUser | null>;
    findUpdateUserIsVerified(userId: string): Promise<IUser | null>;
    findUpdateUserOtp(userId: string, otp: number): Promise<IUser | null>;
}
