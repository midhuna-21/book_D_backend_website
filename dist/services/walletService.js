"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WalletService = void 0;
const walletRepository_1 = require("../respository/walletRepository");
const walletRepository = new walletRepository_1.WalletRepository();
class WalletService {
    async getWalletTransactions(userId) {
        try {
            return await walletRepository.findWalletTransactions(userId);
        }
        catch (error) {
            console.error("Error getWalletTransactions:", error);
            throw error;
        }
    }
    async getWalletByAdminId(adminId) {
        try {
            return await walletRepository.findWalletByAdminId(adminId);
        }
        catch (error) {
            console.error("Error getWalletByAdminId:", error);
            throw error;
        }
    }
    async getCreateWalletAdmin(adminId) {
        try {
            return await walletRepository.findCreateWalletAdmin(adminId);
        }
        catch (error) {
            console.error("Error createWallet:", error);
            throw error;
        }
    }
    async updateBookWallet(lenderId, totalAmount, userId) {
        try {
            return await walletRepository.findUpdateBookWallet(lenderId, totalAmount, userId);
        }
        catch (error) {
            console.error("Error createWallet:", error);
            throw error;
        }
    }
}
exports.WalletService = WalletService;
//# sourceMappingURL=walletService.js.map