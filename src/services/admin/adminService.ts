import { IGenre } from "../../model/genresModel";
import { IUser } from "../../model/userModel";
import { Genre } from "../../interfaces/data";
import { IAdmin } from "../../model/adminModel";
import { IBooks } from "../../model/bookModel";
import { IOrder } from "../../model/orderModel";
import { IAdminService } from "./adminServiceInterface";
import { IAdminRepository } from "../../respository/admin/adminRepositoryInterface";

export class AdminService implements IAdminService {
    private adminRepository: IAdminRepository;

    constructor(adminRepository: IAdminRepository) {
        this.adminRepository = adminRepository;
    }

    async getAdminByEmail(email: string): Promise<IAdmin | null> {
        try {
            return await this.adminRepository.findAdminByEmail(email);
        } catch (error) {
            console.log("Error getAdminByEmail:", error);
            throw error;
        }
    }
    async getGenreName(genreName: string): Promise<IGenre | null> {
        try {
            return await this.adminRepository.findGenreByName(genreName);
        } catch (error) {
            console.log("Error getGenreName:", error);
            throw error;
        }
    }
    async getCreateGenre(data: Partial<Genre>): Promise<IGenre | null> {
        try {
            return await this.adminRepository.findCreateGenre(data);
        } catch (error) {
            console.log("Error getGenreName:", error);
            throw error;
        }
    }

    async getGenre(genreId: string): Promise<IGenre | null> {
        try {
            return await this.adminRepository.findGenre(genreId);
        } catch (error) {
            console.log("Error getGenre:", error);
            throw error;
        }
    }

    async getAllUsers(): Promise<IUser[]> {
        try {
            return await this.adminRepository.findAllUsers();
        } catch (error) {
            console.log("Error getAllUsers:", error);
            throw error;
        }
    }

    async getWalletTransactionsAdmin() {
        try {
            return await this.adminRepository.findWalletTransactionsAdmin();
        } catch (error) {
            console.log("Error getWalletTransactionsAdmin:", error);
            throw error;
        }
    }

    async getAllTotalRentedBooks(): Promise<IBooks[]> {
        try {
            return await this.adminRepository.findAllTotalRentedBooks();
        } catch (error) {
            console.log("Error getAllTotalRentedBooks:", error);
            throw error;
        }
    }
    async getAllTotalBooks(): Promise<IBooks[]> {
        try {
            return await this.adminRepository.findAllTotalBooks();
        } catch (error) {
            console.log("Error getAllTotalBooks:", error);
            throw error;
        }
    }

    async getAllTotalOrders(): Promise<IOrder[]> {
        try {
            const orders = await this.adminRepository.findAllTotalOrders();
            return orders;
        } catch (error) {
            console.log("Error getAllTotalOrders:", error);
            throw error;
        }
    }

    async getBlockUser(_id: string): Promise<IUser | null> {
        try {
            return await this.adminRepository.findBlockUser(_id);
        } catch (error) {
            console.log("Error getBlockUser:", error);
            throw error;
        }
    }
    async getUnblockUser(_id: string): Promise<IUser | null> {
        try {
            return await this.adminRepository.findUnBlockUser(_id);
        } catch (error) {
            console.log("Error getAllUsers:", error);
            throw error;
        }
    }
    async getAdminById(_id: string): Promise<IAdmin | null> {
        try {
            return await this.adminRepository.findAdminById(_id);
        } catch (error) {
            console.log("Error getAdminById:", error);
            throw error;
        }
    }
    async getAllOrders(): Promise<IOrder[]> {
        try {
            return await this.adminRepository.findAllOrders();
        } catch (error) {
            console.log("Error getAllOrders:", error);
            throw error;
        }
    }
    async getOrderDetail(orderId: string) {
        try {
            return await this.adminRepository.findOrderDetail(orderId);
        } catch (error) {
            console.log("Error getOrderDetail:", error);
            throw error;
        }
    }

    async getAllGenres(): Promise<IGenre[]> {
        try {
            return await this.adminRepository.findAllGenres();
        } catch (error) {
            console.log("Error getAllGenres:", error);
            throw error;
        }
    }

    async getUpdateGenre(data: Genre, genreId: string): Promise<IGenre | null> {
        try {
            return await this.adminRepository.findUpdateGenre(data, genreId);
        } catch (error) {
            console.log("Error getUpdateGenre:", error);
            throw error;
        }
    }

    async getDeleteGenre(genreId: string): Promise<IGenre | null> {
        try {
            return await this.adminRepository.findDeleteGenre(genreId);
        } catch (error) {
            console.log("Error getDeleteGenre:", error);
            throw error;
        }
    }
}
