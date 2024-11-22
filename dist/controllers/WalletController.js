"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkWalletStatus = exports.processWalletPayment = exports.createRentalOrderByWallet = exports.fetchWalletTransactions = void 0;
const index_1 = require("../services/index");
const stripe_1 = __importDefault(require("stripe"));
const crypto_1 = __importDefault(require("crypto"));
const config_1 = __importDefault(require("../config/config"));
const walletModel_1 = require("../model/walletModel");
const bookDWallet_1 = require("../model/bookDWallet");
const fetchWalletTransactions = async (req, res) => {
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
exports.fetchWalletTransactions = fetchWalletTransactions;
const stripeKey = config_1.default.STRIPE_KEY;
const stripe = new stripe_1.default(stripeKey, { apiVersion: "2024-06-20" });
const checkWalletStatus = async (req, res) => {
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
        console.error("Error checkWalletStatus :", error);
        res.status(500).json({ error: error.message });
    }
};
exports.checkWalletStatus = checkWalletStatus;
const generateRandomCode = () => crypto_1.default.randomBytes(4).toString("hex");
const createRentalOrderByWallet = async (req, res) => {
    try {
        const { userId, bookId, cartId } = req.body;
        if (!userId || !bookId) {
            return res
                .status(400)
                .json({ message: "user or book id is missing" });
        }
        const existOrder = await index_1.cartService.getIsOrderExistByCart(cartId);
        console.log(existOrder, "ordeerr");
        if (existOrder?.isPaid == true) {
            return res.status(200).json({ order: existOrder });
        }
        const cartData = await index_1.cartService.getCartById(cartId);
        if (!cartData) {
            console.log("cart is not found");
        }
        else {
            const pickupCode = generateRandomCode();
            const returnCode = generateRandomCode();
            const orderData = {
                cartId: cartId,
                userId: typeof cartData?.userId === "string" ? cartData.userId : "",
                lenderId: typeof cartData?.ownerId === "string"
                    ? cartData.ownerId
                    : "",
                bookId: typeof cartData?.bookId === "string" ? cartData.bookId : "",
                returnCode,
                pickupCode,
            };
            const order = await index_1.bookService.getCreateOrder(orderData);
            if (order) {
                const objectOrderId = order._id;
                const orderId = objectOrderId.toString();
                const cart = await index_1.cartService.getUpdateIsPaid(cartId);
                const totalAmount = Number(cart?.totalAmount);
                const lenderWallet = await processWalletPayment(totalAmount, userId, orderId);
                const wallet = await index_1.walletService.getUpdateBookWallet(orderData.lenderId, totalAmount, userId);
                console.log(lenderWallet, "lenderWallet");
            }
            return res.status(200).json({ order });
        }
    }
    catch (error) {
        console.error("Error createOrder:", error);
        res.status(500).json({
            error: "An error occurred while create Order.",
        });
    }
};
exports.createRentalOrderByWallet = createRentalOrderByWallet;
const processWalletPayment = async (totalAmount, userId, orderId) => {
    try {
        let isWalletExist = await index_1.walletService.getWalletTransactions(userId);
        if (!isWalletExist) {
            isWalletExist = new walletModel_1.wallet({
                userId: userId,
                balance: 0,
                transactions: [],
            });
            await isWalletExist.save();
        }
        isWalletExist.balance -= totalAmount;
        const transaction = {
            total_amount: totalAmount,
            source: "payment_to_lender",
            orderId: orderId,
            type: "debit",
            createdAt: new Date(),
        };
        isWalletExist.transactions.push(transaction);
        await isWalletExist.save();
        const adminWallet = await bookDWallet_1.bookDWallet.findOne({});
        if (adminWallet) {
            adminWallet.balance += totalAmount;
            adminWallet.transactions.push({
                source: "Payment received",
                status: "credit",
                total_amount: totalAmount,
            });
            await adminWallet.save();
        }
        console.log("adminWallet", adminWallet);
        return isWalletExist;
    }
    catch (error) {
        console.error("Error processWalletPayment :", error);
        throw new Error(error.message || "Failed to process wallet payment");
    }
};
exports.processWalletPayment = processWalletPayment;
//# sourceMappingURL=WalletController.js.map