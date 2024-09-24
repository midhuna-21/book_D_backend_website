
import {IUser} from '../model/userModel'
import { WalletRepository } from '../respository/walletRepository';

const walletRepository = new WalletRepository()

export class WalletService{
 

   async getCreateWalletForWebsite (cartId:string){
      try{
         return await walletRepository.createWalletForWebsite(cartId)
      }catch(error){
         console.error("Error getCreateWallet:",error)
         throw error
      }
   }

}




