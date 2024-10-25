import { Request, Response } from "express";
import { AuthenticatedRequest } from "../utils/middleware/userAuthMiddleware";
import { walletService } from "../services/index";
import Stripe from "stripe";
import config from "../config/config";
import { wallet } from "../model/walletModel";


const walletTransactions = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const userId = req.userId;
        if (!userId) {
            return res.status(400).json({ message: "user id is missing" });
        }
        const wallet = await walletService.getWalletTransactions(userId);
        res.status(200).json({ wallet });
    } catch (error) {
        console.error("Error updating order status:", error);
        res.status(500).json({
            error: "An error occurred updating the order status.",
        });
    }
};

const stripeKey = config.STRIPE_KEY!;
const stripe = new Stripe(stripeKey, { apiVersion: "2024-06-20" });

const checkWallet = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const userId = req.userId!;
        let isWalletExist = await walletService.getWalletTransactions(userId);

        if (!isWalletExist) {
            isWalletExist = new wallet({
                userId: userId,
                balance: 0,
                transactions: [],
            });
            await isWalletExist.save();
        }
        res.status(200).json({ isWalletExist });
    } catch (error: any) {
        console.error("Error withdrawAmount :", error);

        res.status(500).json({ error: error.message });
    }
};

const paymentWallet = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const { amount } = req.body;
        const userId = req.userId!;
        let isWalletExist = await walletService.getWalletTransactions(userId);

        if (!isWalletExist) {
            isWalletExist = new wallet({
                userId: userId,
                balance: 0,
                transactions: [],
            });
            await isWalletExist.save();
        }

        isWalletExist.balance -= amount;

        const transaction = {
            total_amount: amount,
            source: "payment_to_lender",
            type: "debit",
            createdAt: new Date(),
        };
        isWalletExist.transactions.push(transaction);

        await isWalletExist.save();

        res.status(200).json({ message: "Payment successful", wallet });
    } catch (error: any) {
        console.error("Error withdrawAmount :", error);

        res.status(500).json({ error: error.message });
    }
};

export { walletTransactions, paymentWallet, checkWallet };
