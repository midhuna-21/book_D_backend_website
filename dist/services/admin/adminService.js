"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminService = void 0;
class AdminService {
    constructor(adminRepository) {
        this.adminRepository = adminRepository;
    }
    async getAdminByEmail(email) {
        try {
            return await this.adminRepository.findAdminByEmail(email);
        }
        catch (error) {
            console.log("Error getAdminByEmail:", error);
            throw error;
        }
    }
    async getGenreName(genreName) {
        try {
            return await this.adminRepository.findGenreByName(genreName);
        }
        catch (error) {
            console.log("Error getGenreName:", error);
            throw error;
        }
    }
    async getCreateGenre(data) {
        try {
            return await this.adminRepository.findCreateGenre(data);
        }
        catch (error) {
            console.log("Error getGenreName:", error);
            throw error;
        }
    }
    async getGenre(genreId) {
        try {
            return await this.adminRepository.findGenre(genreId);
        }
        catch (error) {
            console.log("Error getGenre:", error);
            throw error;
        }
    }
    async getAllUsers() {
        try {
            return await this.adminRepository.findAllUsers();
        }
        catch (error) {
            console.log("Error getAllUsers:", error);
            throw error;
        }
    }
    async getWalletTransactionsAdmin() {
        try {
            return await this.adminRepository.findWalletTransactionsAdmin();
        }
        catch (error) {
            console.log("Error getWalletTransactionsAdmin:", error);
            throw error;
        }
    }
    async getAllTotalRentedBooks() {
        try {
            return await this.adminRepository.findAllTotalRentedBooks();
        }
        catch (error) {
            console.log("Error getAllTotalRentedBooks:", error);
            throw error;
        }
    }
    async getAllTotalBooks() {
        try {
            return await this.adminRepository.findAllTotalBooks();
        }
        catch (error) {
            console.log("Error getAllTotalBooks:", error);
            throw error;
        }
    }
    async getAllTotalOrders() {
        try {
            const orders = await this.adminRepository.findAllTotalOrders();
            return orders;
        }
        catch (error) {
            console.log("Error getAllTotalOrders:", error);
            throw error;
        }
    }
    async getBlockUser(_id) {
        try {
            return await this.adminRepository.findBlockUser(_id);
        }
        catch (error) {
            console.log("Error getBlockUser:", error);
            throw error;
        }
    }
    async getUnblockUser(_id) {
        try {
            return await this.adminRepository.findUnBlockUser(_id);
        }
        catch (error) {
            console.log("Error getAllUsers:", error);
            throw error;
        }
    }
    async getAdminById(_id) {
        try {
            return await this.adminRepository.findAdminById(_id);
        }
        catch (error) {
            console.log("Error getAdminById:", error);
            throw error;
        }
    }
    async getAllOrders() {
        try {
            return await this.adminRepository.findAllOrders();
        }
        catch (error) {
            console.log("Error getAllOrders:", error);
            throw error;
        }
    }
    async getOrderDetail(orderId) {
        try {
            return await this.adminRepository.findOrderDetail(orderId);
        }
        catch (error) {
            console.log("Error getOrderDetail:", error);
            throw error;
        }
    }
    async getAllGenres() {
        try {
            return await this.adminRepository.findAllGenres();
        }
        catch (error) {
            console.log("Error getAllGenres:", error);
            throw error;
        }
    }
    async getUpdateGenre(data, genreId) {
        try {
            return await this.adminRepository.findUpdateGenre(data, genreId);
        }
        catch (error) {
            console.log("Error getUpdateGenre:", error);
            throw error;
        }
    }
    async getDeleteGenre(genreId) {
        try {
            return await this.adminRepository.findDeleteGenre(genreId);
        }
        catch (error) {
            console.log("Error getDeleteGenre:", error);
            throw error;
        }
    }
}
exports.AdminService = AdminService;
//# sourceMappingURL=adminService.js.map