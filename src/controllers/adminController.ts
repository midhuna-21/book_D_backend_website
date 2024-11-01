import { Request, Response } from "express";
import { comparePassword } from "../utils/ReuseFunctions/passwordValidation";
import { IGenre } from "../model/genresModel";
import { IUser } from "../model/userModel";
import { Types } from "mongoose";
import { adminGenerateTokens } from "../utils/jwt/adminGenerateToken";
import { adminService } from "../services/index";
import { walletService } from "../services/index";

interface CustomMulterFile extends Express.Multer.File {
    location: string;
}

const addGenre = async (req: Request, res: Response) => {
    try {
        const { genreName } = req.body;
        const existGenre = await adminService.getGenreName(genreName);
        if (existGenre) {
            return res.status(400).json({ message: "Genre is already exist" });
        }
        if (!genreName) {
            return res
                .status(400)
                .json({ message: "Please provide a genre name" });
        }
        const file = req.file as CustomMulterFile;
        if (!file) {
            return res.status(400).json({ message: "Please provide image" });
        }
        const image = file.location;
        const data: Partial<IGenre> = { genreName, image };
        const genre: IGenre | null = await adminService.getCreateGenre(data);
        return res.status(200).json({ genre });
    } catch (error: any) {
        console.error("Error adding genre:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

const adminLogin = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        let admin = await adminService.getAdminByEmail(email);
        if (!admin || !admin.password) {
            return res
                .status(400)
                .json({ message: "Invalid email or password" });
        }
        const isPasswordValid = await comparePassword(password, admin.password);
        if (!isPasswordValid) {
            return res
                .status(401)
                .json({ message: "Invalid email or password" });
        }
        const adminId: string = (admin._id as Types.ObjectId).toString();
        const { accessToken, refreshToken } = adminGenerateTokens(res, {
            adminId,
            role: "admin",
        });

        const wallet = await walletService.getCreateWalletAdmin(adminId);

        return res.status(200).json({ admin, accessToken, refreshToken });
    } catch (error: any) {
        console.log(error.message);
        return res.status(500).json({ message: "Internal server error" });
    }
};

const getUsersList = async (req: Request, res: Response) => {
    try {
        const users = await adminService.getAllUsers();
        return res.status(200).json(users);
    } catch (error: any) {
        console.log(error.message);
        return res.status(500).json({ message: "Internal server error" });
    }
};

const walletTransactions = async (req: Request, res: Response) => {
    try {
        const wallet = await adminService.getWalletTransactionsAdmin();
        return res.status(200).json(wallet);
    } catch (error: any) {
        console.log(error.message);
        return res.status(500).json({ message: "Internal server error" });
    }
};

const totalRentedBooks = async (req: Request, res: Response) => {
    try {
        const users = await adminService.getAllTotalRentedBooks();
        return res.status(200).json(users);
    } catch (error: any) {
        console.log(error.message);
        return res.status(500).json({ message: "Internal server error" });
    }
};
const totalBooks = async (req: Request, res: Response) => {
    try {
        const users = await adminService.getAllTotalBooks();
        return res.status(200).json(users);
    } catch (error: any) {
        console.log(error.message);
        return res.status(500).json({ message: "Internal server error" });
    }
};
const blockUser = async (req: Request, res: Response) => {
    try {
        const { _id } = req.body;
        const user: IUser | null = await adminService.getBlockUser(_id);
        return res.status(200).json({ user });
    } catch (error: any) {
        console.log(error.message);
        return res.status(400).json({ message: "Internal server error" });
    }
};

const unBlockUser = async (req: Request, res: Response) => {
    try {
        const { _id } = req.body;
        const user: IUser | null = await adminService.getUnblockUser(_id);
        return res.status(200).json({ user });
    } catch (error: any) {
        console.log(error.message);
        return res.status(400).json({ message: "Internal server error" });
    }
};
const allOrders = async (req: Request, res: Response) => {
    try {
        const orders = await adminService.getAllOrders();
        return res.status(200).json(orders);
    } catch (error: any) {
        console.log(error.message);
        return res.status(500).json({ message: "Internal server error" });
    }
};

const orderDetail = async (req: Request, res: Response) => {
    try {
        const { orderId } = req.params;
        if (!orderId) {
            return res.status(500).json({ message: "orderId is not found" });
        }
        const order = await adminService.getOrderDetail(orderId);
        return res.status(200).json(order);
    } catch (error: any) {
        console.log(error.message);
        return res.status(500).json({ message: "Internal server error" });
    }
};

const genresList = async (req: Request, res: Response) => {
    try {
        const genres = await adminService.getAllGenres();
        return res.status(200).json(genres);
    } catch (error: any) {
        console.log(error.message);
        return res.status(500).json({ message: "Internal server error" });
    }
};
const genre = async (req: Request, res: Response) => {
    try {
        const genreId = req.params.genreId;
        const genre = await adminService.getGenre(genreId);
        return res.status(200).json(genre);
    } catch (error: any) {
        console.log(error.message);
        return res.status(500).json({ message: "Internal server error" });
    }
};

const updateGenre = async (req: Request, res: Response) => {
    try {
        const genreId = req.params.genreId;
        const { genreName, exisitingImage } = req.body;
        let image;
        if (req.file) {
            const file = req.file as CustomMulterFile;
            image = file.location;
        } else if (exisitingImage) {
            image = exisitingImage;
        } else {
            return res.status(400).json({ message: "Please provide image" });
        }
        const data = {
            genreName,
            image,
        };
        const genre = await adminService.getUpdateGenre(data, genreId);
        return res.status(200).json(genre);
    } catch (error: any) {
        console.log(error.message);
        return res.status(400).json({ message: "Internal server error" });
    }
};

const deleteGenre = async (req: Request, res: Response) => {
    try {
        const { genreId } = req.body;
        const genre = await adminService.getDeleteGenre(genreId);
        return res.status(200).json({ genre });
    } catch (error: any) {
        console.log(error.message);
        return res.status(400).json({ message: "Internal server error" });
    }
};
export {
    adminLogin,
    addGenre,
    genre,
    getUsersList,
    genresList,
    updateGenre,
    blockUser,
    walletTransactions,
    unBlockUser,
    totalRentedBooks,
    totalBooks,
    allOrders,
    orderDetail,
    deleteGenre,
};
