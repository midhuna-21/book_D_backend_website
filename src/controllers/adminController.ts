import { Request, Response } from "express";
import { comparePassword } from "../utils/ReuseFunctions/passwordValidation";
import { IGenre } from "../model/genresModel";
import { IUser } from "../model/userModel";
import { Types } from "mongoose";
import { generateAdminTokens } from "../utils/jwt/adminGenerateToken";
import { adminService } from "../services/index";
import { walletService } from "../services/index";

interface CustomMulterFile extends Express.Multer.File {
    location: string;
}

const authenticateAdmin = async (req: Request, res: Response) => {
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
        const { accessToken, refreshToken } = generateAdminTokens(res, {
            adminId,
            role: "admin",
        });

        await walletService.getCreateWalletAdmin(adminId);
        return res.status(200).json({ admin, accessToken, refreshToken });
    } catch (error: any) {
        console.log(error.message);
        return res.status(500).json({ message: "Internal server error" });
    }
};
const createGenre = async (req: Request, res: Response) => {
    try {
        const { genreName } = req.body;
        const existGenre = await adminService.getGenreName(genreName);
        if (existGenre) {
            return res
                .status(200)
                .json({ success: false, message: "Genre is already exist" });
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

const fetchUsers = async (req: Request, res: Response) => {
    try {
        const users = await adminService.getAllUsers();
        return res.status(200).json(users);
    } catch (error: any) {
        console.log(error.message);
        return res.status(500).json({ message: "Internal server error" });
    }
};

const fetchWalletTransactions = async (req: Request, res: Response) => {
    try {
        const wallet = await adminService.getWalletTransactionsAdmin();
        return res.status(200).json(wallet);
    } catch (error: any) {
        console.log(error.message);
        return res.status(500).json({ message: "Internal server error" });
    }
};

const fetchLentBooks = async (req: Request, res: Response) => {
    try {
        const users = await adminService.getAllTotalRentedBooks();
        return res.status(200).json(users);
    } catch (error: any) {
        console.log(error.message);
        return res.status(500).json({ message: "Internal server error" });
    }
};

const fetchOrders = async (req: Request, res: Response) => {
    try {
        const users = await adminService.getAllTotalOrders();
        return res.status(200).json(users);
    } catch (error: any) {
        console.log(error.message);
        return res.status(500).json({ message: "Internal server error" });
    }
};

const fetchBooks = async (req: Request, res: Response) => {
    try {
        const users = await adminService.getAllTotalBooks();
        return res.status(200).json(users);
    } catch (error: any) {
        console.log(error.message);
        return res.status(500).json({ message: "Internal server error" });
    }
};

const blockUserAccount = async (req: Request, res: Response) => {
    try {
        const { _id } = req.body;
        const user: IUser | null = await adminService.getBlockUser(_id);
        return res.status(200).json({ user });
    } catch (error: any) {
        console.log(error.message);
        return res.status(400).json({ message: "Internal server error" });
    }
};

const unblockUserAccount = async (req: Request, res: Response) => {
    try {
        const { _id } = req.body;
        const user: IUser | null = await adminService.getUnblockUser(_id);
        return res.status(200).json({ user });
    } catch (error: any) {
        console.log(error.message);
        return res.status(400).json({ message: "Internal server error" });
    }
};
const fetchRentalOrders = async (req: Request, res: Response) => {
    try {
        const orders = await adminService.getAllOrders();
        return res.status(200).json(orders);
    } catch (error: any) {
        console.log(error.message);
        return res.status(500).json({ message: "Internal server error" });
    }
};

const fetchRentalOrderDetails = async (req: Request, res: Response) => {
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

const fetchGenres = async (req: Request, res: Response) => {
    try {
        const genres = await adminService.getAllGenres();
        return res.status(200).json(genres);
    } catch (error: any) {
        console.log(error.message);
        return res.status(500).json({ message: "Internal server error" });
    }
};
const fetchGenreById = async (req: Request, res: Response) => {
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

const removeGenre = async (req: Request, res: Response) => {
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
    authenticateAdmin,
    createGenre,
    fetchGenreById,
    fetchUsers,
    fetchGenres,
    updateGenre,
    blockUserAccount,
    unblockUserAccount,
    fetchWalletTransactions,
    fetchLentBooks,
    fetchBooks,
    fetchOrders,
    fetchRentalOrders,
    fetchRentalOrderDetails,
    removeGenre,
};
