import { bookDWallet , IWalletTransaction} from "../model/bookDWallet";
import { cart } from "../model/cartModel";
import { wallet } from "../model/walletModel";
import { BookDWallet } from "../utils/ReuseFunctions/interface/data";


   export class WalletRepository {
      
      async createWalletForWebsite(cartId:string) {
         console.log('hi')
         try {
            const cartData = await cart.findById({_id:cartId})
             let existWallet = await bookDWallet.findOne()
             if(!existWallet){
               existWallet = new bookDWallet();
               await existWallet.save();
             }

         const balance = cartData?.totalAmount!

         existWallet.balance = (existWallet.balance || 0) + balance
        existWallet.transactions.push({
         total_amount: cartData?.totalAmount,
                 rental_amount: cartData?.totalRentalPrice,
                 deposit_amount: cartData?.total_deposit_amount,
                 userId: cartData?.userId,
                 lenderId: cartData?.ownerId,
                 source: 'Payment received', 
                 status: 'credit', 
        })
        await existWallet.save()
           return existWallet;
         } catch (error) {
           console.log('Error createWallet:', error);
           throw error;
         }
       }
       
   }
