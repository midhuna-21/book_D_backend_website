import { WalletRepository } from "../respository/walletRepository";

const walletRepository = new WalletRepository();

export class WalletService {
    async getWalletTransactions(userId: string) {
        try {
            return await walletRepository.findWalletTransactions(userId);
        } catch (error) {
            console.error("Error getWalletTransactions:", error);
            throw error;
        }
    }

    async getWalletByAdminId(adminId: string) {
        try {
            return await walletRepository.findWalletByAdminId(adminId);
        } catch (error) {
            console.error("Error getWalletByAdminId:", error);
            throw error;
        }
    }

    async getCreateWalletAdmin(adminId: string) {
        try {
            return await walletRepository.findCreateWalletAdmin(adminId);
        } catch (error) {
            console.error("Error createWallet:", error);
            throw error;
        }
    }

    async updateBookWallet(lenderId:string,totalAmount:number,userId:string) {
        try {
            return await walletRepository.findUpdateBookWallet(lenderId,totalAmount,userId);
        } catch (error) {
            console.error("Error createWallet:", error);
            throw error;
        }
    }
}
