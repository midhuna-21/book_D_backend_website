import { IBookWalletTransaction } from "../../model/bookDWallet";
import { IWallet } from "../../model/walletModel";

export interface IWalletRepository {
    findWalletTransactions(userId: string): Promise<IWallet | null>;
    findWalletPaymentTransfer(orderId: string): Promise<IBookWalletTransaction | null>;
    findWalletByAdminId(adminId: string): Promise<IBookWalletTransaction[]>;
    findCreateWalletAdmin(adminId: string):Promise<IBookWalletTransaction | null>;
    findUpdateBookWallet(
        lenderId: string,
        totalAmount: number,
        userId: string
    ): Promise<any>;
}