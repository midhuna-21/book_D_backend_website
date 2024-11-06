import { IWallet } from "../../model/walletModel";

export interface IWalletService {
    getWalletTransactions(userId: string): Promise<IWallet | null>;
    getWalletByAdminId(adminId: string): Promise<any>;
    getCreateWalletAdmin(adminId: string): Promise<IWallet | null>;
    getUpdateBookWallet(
        lenderId: string,
        totalAmount: number,
        userId: string
    ): Promise<IWallet | null>;
}
