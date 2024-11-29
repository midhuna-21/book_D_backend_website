import { IWallet } from "../../model/walletModel";
import { IWalletService } from "./walletServiceInterface";
import { IWalletRepository } from "../../respository/wallet/walletRepositoryInterface";
import { IBookWalletTransaction } from "../../model/bookDWallet";

export class WalletService implements IWalletService {
    private walletRepository: IWalletRepository;

    constructor(walletRepository: IWalletRepository) {
        this.walletRepository = walletRepository;
    }
    async getWalletTransactions(userId: string): Promise<IWallet | null> {
        try {
            return await this.walletRepository.findWalletTransactions(userId);
        } catch (error) {
            console.error("Error getWalletTransactions:", error);
            throw error;
        }
    }

    async getWalletByAdminId(adminId: string): Promise<IBookWalletTransaction[]> {
        try {
            const w= await this.walletRepository.findWalletByAdminId(adminId);
            return w
        } catch (error) {
            console.error("Error getWalletByAdminId:", error);
            throw error;
        }
    }

    async getCreateWalletAdmin(adminId: string): Promise<IBookWalletTransaction | null> {
        try {
            return await this.walletRepository.findCreateWalletAdmin(adminId);
        } catch (error) {
            console.error("Error createWallet:", error);
            throw error;
        }
    }

    async getUpdateBookWallet(
        lenderId: string,
        totalAmount: number,
        userId: string
    ): Promise<IWallet | null> {
        try {
            return await this.walletRepository.findUpdateBookWallet(
                lenderId,
                totalAmount,
                userId
            );
        } catch (error) {
            console.error("Error createWallet:", error);
            throw error;
        }
    }
}
