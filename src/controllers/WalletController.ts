import { Request, Response } from "express";
import { AuthenticatedRequest } from "../utils/middleware/userAuthMiddleware";
import { bookService, cartService, walletService } from "../services/index";
import Stripe from "stripe";
import crypto from "crypto";
import config from "../config/config";
import { wallet } from "../model/walletModel";
import { bookDWallet } from "../model/bookDWallet";

const fetchWalletTransactions = async (
    req: AuthenticatedRequest,
    res: Response
) => {
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

const checkWalletStatus = async (req: AuthenticatedRequest, res: Response) => {
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
        console.error("Error checkWalletStatus :", error);

        res.status(500).json({ error: error.message });
    }
};

const generateRandomCode = () => crypto.randomBytes(4).toString("hex");
const createRentalOrderByWallet = async (req: Request, res: Response) => {
    try {
        const { userId, bookId, cartId } = req.body;
        if (!userId || !bookId) {
            return res
                .status(400)
                .json({ message: "user or book id is missing" });
        }

        const existOrder = await cartService.getIsOrderExistByCart(cartId);
        if (existOrder?.isPaid == true) {
            return res.status(200).json({ order: existOrder });
        }
        const cartData = await cartService.getCartById(cartId);
        if (!cartData) {
            console.log("cart is not found");
        } else {
            const pickupCode = generateRandomCode();
            const returnCode = generateRandomCode();
            const orderData = {
                cartId: cartId,
                userId:
                    typeof cartData?.userId === "string" ? cartData.userId : "",
                lenderId:
                    typeof cartData?.ownerId === "string"
                        ? cartData.ownerId
                        : "",
                bookId:
                    typeof cartData?.bookId === "string" ? cartData.bookId : "",
                returnCode,
                pickupCode,
            };

            const order = await bookService.getCreateOrder(orderData);
            if (order) {
                const objectOrderId = order._id!;
                const orderId = objectOrderId.toString();
                const cart = await cartService.getUpdateIsPaid(cartId);
                const totalAmount = Number(cart?.totalAmount);
                const lenderWallet = await processWalletPayment(
                    totalAmount,
                    userId,
                    orderId
                );
                const wallet = await walletService.getUpdateBookWallet(
                    orderData.lenderId,
                    totalAmount,
                    userId
                );
                console.log(lenderWallet, "lenderWallet");
            }

            return res.status(200).json({ order });
        }
    } catch (error) {
        console.error("Error createOrder:", error);
        res.status(500).json({
            error: "An error occurred while create Order.",
        });
    }
};

const processWalletPayment = async (
    totalAmount: number,
    userId: string,
    orderId: string
) => {
    try {
        let isWalletExist = await walletService.getWalletTransactions(userId);

        if (!isWalletExist) {
            isWalletExist = new wallet({
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
        const adminWallet = await bookDWallet.findOne({});

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
    } catch (error: any) {
        console.error("Error processWalletPayment :", error);
        throw new Error(error.message || "Failed to process wallet payment");
    }
};

export {
    fetchWalletTransactions,
    createRentalOrderByWallet,
    processWalletPayment,
    checkWalletStatus,
};
