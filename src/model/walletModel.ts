import mongoose, { Document, Schema,Types } from 'mongoose';

interface IWallet extends Document {
    cartId:string;
    bookId: string;
    userId: string;
    lenderId: string;
    orderId:string;
    totalAmount:number;
    creditAmount:number;
    debitAmount:number;
}

const walletSchema = new Schema<IWallet>({
    cartId:{type:String,ref:'cart'},
    bookId: { type: String, ref: 'books' },
    userId: { type: String, ref: 'user' }, 
    lenderId: { type: String, ref: 'user' }, 
    orderId: { type: String, ref: 'orders' }, 
    totalAmount :{type:Number},
    creditAmount:{type:Number},
    debitAmount:{type:Number},

}, { timestamps: true });

const wallet = mongoose.model<IWallet>('wallet', walletSchema);
export { wallet, IWallet };
