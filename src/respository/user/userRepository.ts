import { user, IUser } from "../../model/userModel";
import { User } from "../../interfaces/data";
import { IUserRepository } from "./userRepositoryInterface";

export class UserRepository implements IUserRepository {
    async findUserNotVerified(userId: string): Promise<IUser | null> {
        try {
            return await user.findById({ _id: userId, isEmailVerified: false });
        } catch (error) {
            console.log("Error findUserNotVerified:", error);
            throw error;
        }
    }
    async findUserIsVerified(email: string): Promise<IUser | null> {
        try {
            return await user.findOne({ email: email, isEmailVerified: true });
        } catch (error) {
            console.log("Error findUserNotVerified:", error);
            throw error;
        }
    }
    async findUpdateUserIsVerified(userId: string): Promise<IUser | null> {
        try {
            return await user.findByIdAndUpdate(
                { _id: userId },
                { isEmailVerified: true }
            );
        } catch (error) {
            console.log("Error findUpdateUserIsVerified:", error);
            throw error;
        }
    }

    async findUpdateUserOtp(
        userId: string,
        otp: number
    ): Promise<IUser | null> {
        try {
            return await user.findByIdAndUpdate({ _id: userId }, { otp: otp });
        } catch (error) {
            console.log("Error findUpdateUserOtp:", error);
            throw error;
        }
    }
    async findUserByEmail(email: string): Promise<IUser | null> {
        try {
            return await user.findOne({ email, isEmailVerified: true });
        } catch (error) {
            console.log("Error findUserByEmail:", error);
            throw error;
        }
    }

    async findByGmail(email: string): Promise<IUser | null> {
        try {
            return await user.findOne({ email, isGoogle: true });
        } catch (error) {
            console.log("Error findByGmail:", error);
            throw error;
        }
    }

    async findUpdateIsGoogleTrue(email: string) {
        try {
            return await user.findOneAndUpdate(
                { email: email },
                { isGoogle: true, password: null },
                { new: true }
            );
        } catch (error: any) {
            console.log("Error findUpdateIsGoogleTrue:", error);
            throw error;
        }
    }

    async findCreateUser(data: Partial<User>): Promise<IUser | null> {
        try {
            return new user({
                name: data.name,
                email: data.email,
                phone: data.phone,
                password: data.password,
                otp: data.otp,
            }).save();
        } catch (error) {
            console.log("Error createUser:", error);
            throw error;
        }
    }

    async findCreateUserByGoogle(data: User): Promise<IUser | null> {
        try {
            return new user({
                name: data.name,
                email: data.email,
                image: data.image,
                isGoogle: true,
                isEmailVerified: true,
            }).save();
        } catch (error) {
            console.log("Error createUserByGoogle:", error);
            throw error;
        }
    }

    async findUpdatePassword(data: User): Promise<IUser | null> {
        try {
            return await user.findOneAndUpdate(
                { email: data.email },
                {
                    $set: {
                        password: data.password,
                        resetToken: undefined,
                        resetTokenExpiration: undefined,
                    },
                }
            );
        } catch (error) {
            console.log("Error updatePassword:", error);
            throw error;
        }
    }
    async findUpdateProfilePassword(
        userId: string,
        password: string
    ): Promise<IUser | null> {
        try {
            return await user.findOneAndUpdate(
                { _id: userId },
                {
                    $set: {
                        password: password,
                    },
                }
            );
        } catch (error) {
            console.log("Error updatePassword:", error);
            throw error;
        }
    }

    async findUserById(_id: string): Promise<IUser | null> {
        try {
            return await user.findById(_id);
        } catch (error) {
            console.log("Error findUserById:", error);
            throw error;
        }
    }

    async findUpdateUser(
        userId: string,
        filteredUser: User
    ): Promise<IUser | null> {
        try {
            const userToUpdate: IUser | null = await this.findUserById(userId);

            if (!userToUpdate) {
                console.log("Error finding the user to update:");
                return null;
            } else {
                const updateFields: Partial<IUser> = {
                    name: filteredUser.name || userToUpdate.name,
                    email: filteredUser.email || userToUpdate.email,
                    phone: filteredUser.phone || userToUpdate.phone,

                    address: {
                        street:
                            filteredUser.address?.street ||
                            userToUpdate.address?.street,
                        city:
                            filteredUser.address?.city ||
                            userToUpdate.address?.city,
                        district:
                            filteredUser.address?.district ||
                            userToUpdate.address?.district,
                        state:
                            filteredUser.address?.state ||
                            userToUpdate.address?.state,
                        pincode:
                            filteredUser.address?.pincode ||
                            userToUpdate.address?.pincode,
                    },
                };

                const updatedUser = await user.findByIdAndUpdate(
                    userId,
                    updateFields,
                    { new: true }
                );
                if (!updatedUser) {
                    console.log("Error updating the user:");
                    return null;
                }
                return updatedUser;
            }
        } catch (error) {
            console.log("Error findAllGenres:", error);
            throw error;
        }
    }

    async findActiveUsers(): Promise<IUser[]> {
        try {
            const users = await user.find({
                isBlocked: false,
                isEmailVerified: true,
            });
            return users;
        } catch (error: any) {
            console.log("Error getActiveUsers:", error);
            throw error;
        }
    }

    async findUpdateProfileImage(
        userId: string,
        imageUrl: string
    ): Promise<IUser | null> {
        try {
            return await user.findByIdAndUpdate(
                userId,
                { image: imageUrl },
                { new: true }
            );
        } catch (error) {
            console.log("Error updateProfileImage:", error);
            throw error;
        }
    }

    async findDeleteUserImage(userId: string): Promise<IUser | null> {
        try {
            return await user.findByIdAndUpdate(
                userId,
                { $unset: { image: "" } },
                { new: true }
            );
        } catch (error) {
            console.log("Error findDeleteUserImage:", error);
            throw error;
        }
    }

    async findSaveToken(
        userId: string,
        resetToken: string,
        resetTokenExpiration: number
    ) {
        try {
            return await user.findByIdAndUpdate(
                userId,
                { resetToken, resetTokenExpiration },
                { new: true }
            );
        } catch (error) {
            console.log("Error saveToken:", error);
            throw error;
        }
    }

    async findUpdateIsGoogle(
        gmail: string,
        resetToken: string,
        resetTokenExpiration: number
    ) {
        try {
            const update = await user.findOneAndUpdate(
                { email: gmail },
                {
                    isGoogle: false,
                    resetToken: null,
                    resetTokenExpiration: null,
                },
                { new: true }
            );
            return update;
        } catch (error) {
            console.log("Error updateIsGoogle:", error);
            throw error;
        }
    }
}
