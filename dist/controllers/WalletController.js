"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkWallet = exports.paymentWallet = exports.walletTransactions = void 0;
const index_1 = require("../services/index");
const stripe_1 = __importDefault(require("stripe"));
const config_1 = __importDefault(require("../config/config"));
const walletModel_1 = require("../model/walletModel");
const walletTransactions = async (req, res) => {
    try {
        const userId = req.userId;
        if (!userId) {
            return res.status(400).json({ message: "user id is missing" });
        }
        const wallet = await index_1.walletService.getWalletTransactions(userId);
        res.status(200).json({ wallet });
    }
    catch (error) {
        console.error("Error updating order status:", error);
        res.status(500).json({
            error: "An error occurred updating the order status.",
        });
    }
};
exports.walletTransactions = walletTransactions;
const stripeKey = config_1.default.STRIPE_KEY;
const stripe = new stripe_1.default(stripeKey, { apiVersion: "2024-06-20" });
const checkWallet = async (req, res) => {
    try {
        const userId = req.userId;
        let isWalletExist = await index_1.walletService.getWalletTransactions(userId);
        if (!isWalletExist) {
            isWalletExist = new walletModel_1.wallet({
                userId: userId,
                balance: 0,
                transactions: [],
            });
            await isWalletExist.save();
        }
        res.status(200).json({ isWalletExist });
    }
    catch (error) {
        console.error("Error withdrawAmount :", error);
        res.status(500).json({ error: error.message });
    }
};
exports.checkWallet = checkWallet;
const paymentWallet = async (req, res) => {
    try {
        const { amount } = req.body;
        const userId = req.userId;
        let isWalletExist = await index_1.walletService.getWalletTransactions(userId);
        if (!isWalletExist) {
            isWalletExist = new walletModel_1.wallet({
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
        res.status(200).json({ message: "Payment successful", wallet: walletModel_1.wallet });
    }
    catch (error) {
        console.error("Error withdrawAmount :", error);
        res.status(500).json({ error: error.message });
    }
};
exports.paymentWallet = paymentWallet;
//# sourceMappingURL=WalletController.js.map