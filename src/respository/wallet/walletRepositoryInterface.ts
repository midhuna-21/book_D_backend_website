import { IWallet } from '../../model/walletModel';

export interface IWalletRepository {
   findWalletTransactions(userId: string):Promise<IWallet | null>
   findWalletPaymentTransfer(orderId: string):Promise<any>
   findWalletByAdminId(adminId: string):Promise<any> 
   findCreateWalletAdmin(adminId: string):Promise<any> 
   findUpdateBookWallet(lenderId: string,totalAmount: number,userId: string):Promise<any>
}
