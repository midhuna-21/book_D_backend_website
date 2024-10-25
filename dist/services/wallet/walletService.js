"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WalletService = void 0;
class WalletService {
    constructor(walletRepository) {
        this.walletRepository = walletRepository;
    }
    async getWalletTransactions(userId) {
        try {
            return await this.walletRepository.findWalletTransactions(userId);
        }
        catch (error) {
            console.error("Error getWalletTransactions:", error);
            throw error;
        }
    }
    async getWalletByAdminId(adminId) {
        try {
            return await this.walletRepository.findWalletByAdminId(adminId);
        }
        catch (error) {
            console.error("Error getWalletByAdminId:", error);
            throw error;
        }
    }
    async getCreateWalletAdmin(adminId) {
        try {
            return await this.walletRepository.findCreateWalletAdmin(adminId);
        }
        catch (error) {
            console.error("Error createWallet:", error);
            throw error;
        }
    }
    async getUpdateBookWallet(lenderId, totalAmount, userId) {
        try {
            return await this.walletRepository.findUpdateBookWallet(lenderId, totalAmount, userId);
        }
        catch (error) {
            console.error("Error createWallet:", error);
            throw error;
        }
    }
}
exports.WalletService = WalletService;
//# sourceMappingURL=walletService.js.map