import { AdminRepository } from "../respository/adminRespository";
import { IGenre } from "../model/genresModel";
import { IUser } from "../model/userModel";
import { Genre } from "../interfaces/data";
import { IAdmin } from "../model/adminModel";

const adminRepository = new AdminRepository();

export class AdminService {
    async getAdminByEmail(email: string): Promise<IUser | null> {
        try {
            return await adminRepository.findAdminByEmail(email);
        } catch (error) {
            console.log("Error getAdminByEmail:", error);
            throw error;
        }
    }
    async getGenreName(genreName: string): Promise<IGenre | null> {
        try {
            return await adminRepository.findGenreByName(genreName);
        } catch (error) {
            console.log("Error getGenreName:", error);
            throw error;
        }
    }
    async getCreateGenre(data: Partial<Genre>): Promise<IGenre | null> {
        try {
            return await adminRepository.createGenre(data);
        } catch (error) {
            console.log("Error getGenreName:", error);
            throw error;
        }
    }
    async getGenre(genreId: string) {
        try {
            return await adminRepository.findGenre(genreId);
        } catch (error) {
            console.log("Error getGenre:", error);
            throw error;
        }
    }

    async getAllUsers() {
        try {
            return await adminRepository.findAllUsers();
        } catch (error) {
            console.log("Error getAllUsers:", error);
            throw error;
        }
    }

    async getWalletTransactionsAdmin() {
        try {
            return await adminRepository.findWalletTransactionsAdmin();
        } catch (error) {
            console.log("Error getWalletTransactionsAdmin:", error);
            throw error;
        }
    }

    async getAllTotalRentedBooks() {
        try {
            return await adminRepository.findAllTotalRentedBooks();
        } catch (error) {
            console.log("Error getAllTotalRentedBooks:", error);
            throw error;
        }
    }
    async getAllTotalSoldBooks() {
        try {
            return await adminRepository.findAllTotalSoldBooks();
        } catch (error) {
            console.log("Error getAllTotalSoldBooks:", error);
            throw error;
        }
    }
    async getAllTotalBooks() {
        try {
            return await adminRepository.findAllTotalBooks();
        } catch (error) {
            console.log("Error getAllTotalBooks:", error);
            throw error;
        }
    }
    async getBlockUser(_id: string): Promise<IUser | null> {
        try {
            return await adminRepository.blockUser(_id);
        } catch (error) {
            console.log("Error getBlockUser:", error);
            throw error;
        }
    }
    async getUnblockUser(_id: string): Promise<IUser | null> {
        try {
            return await adminRepository.unBlockUser(_id);
        } catch (error) {
            console.log("Error getAllUsers:", error);
            throw error;
        }
    }
    async getAdminById(_id: string): Promise<IAdmin | null> {
        try {
            return await adminRepository.findAdminById(_id);
        } catch (error) {
            console.log("Error getAdminById:", error);
            throw error;
        }
    }
    async getAllOrders() {
        try {
            return await adminRepository.findAllOrders();
        } catch (error) {
            console.log("Error getAllOrders:", error);
            throw error;
        }
    }
    async getOrderDetail(orderId: string) {
        try {
            return await adminRepository.findOrderDetail(orderId);
        } catch (error) {
            console.log("Error getOrderDetail:", error);
            throw error;
        }
    }

    async getAllGenres() {
        try {
            return await adminRepository.findAllGenres();
        } catch (error) {
            console.log("Error getAllGenres:", error);
            throw error;
        }
    }

    async getUpdateGenre(data: Genre, genreId: string) {
        try {
            return await adminRepository.findUpdateGenre(data, genreId);
        } catch (error) {
            console.log("Error getUpdateGenre:", error);
            throw error;
        }
    }
}
