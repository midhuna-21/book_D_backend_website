import { IBookWalletTransaction } from "../../model/bookDWallet";
import { IWallet } from "../../model/walletModel";

export interface IWalletService {
    getWalletTransactions(userId: string): Promise<IWallet | null>;
    getWalletByAdminId(adminId: string):  Promise<IBookWalletTransaction[]>;
    getCreateWalletAdmin(adminId: string): Promise<IBookWalletTransaction | null>;
    getUpdateBookWallet(
        lenderId: string,
        totalAmount: number,
        userId: string
    ): Promise<IWallet | null>;
}
