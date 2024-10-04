"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WalletRepository = void 0;
const bookDWallet_1 = require("../model/bookDWallet");
const cartModel_1 = require("../model/cartModel");
class WalletRepository {
    async createWalletForWebsite(cartId) {
        try {
            const cartData = await cartModel_1.cart.findById({ _id: cartId });
            let existWallet = await bookDWallet_1.bookDWallet.findOne();
            if (!existWallet) {
                existWallet = new bookDWallet_1.bookDWallet();
                await existWallet.save();
            }
            const balance = cartData?.totalAmount;
            existWallet.balance = (existWallet.balance || 0) + balance;
            existWallet.transactions.push({
                total_amount: cartData?.totalAmount,
                rental_amount: cartData?.totalRentalPrice,
                deposit_amount: cartData?.total_deposit_amount,
                userId: cartData?.userId,
                lenderId: cartData?.ownerId,
                source: 'Payment received',
                status: 'credit',
            });
            await existWallet.save();
            return existWallet;
        }
        catch (error) {
            console.log('Error createWallet:', error);
            throw error;
        }
    }
}
exports.WalletRepository = WalletRepository;
//# sourceMappingURL=walletRepository.js.map