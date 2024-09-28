"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WalletService = void 0;
const walletRepository_1 = require("../respository/walletRepository");
const walletRepository = new walletRepository_1.WalletRepository();
class WalletService {
    async getCreateWalletForWebsite(cartId) {
        try {
            return await walletRepository.createWalletForWebsite(cartId);
        }
        catch (error) {
            console.error("Error getCreateWallet:", error);
            throw error;
        }
    }
}
exports.WalletService = WalletService;
//# sourceMappingURL=walletService.js.map