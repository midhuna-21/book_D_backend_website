import mongoose, { Document, Schema,Types } from 'mongoose';
import {ICart} from './cartModel'

interface IOrder extends Document {
    cartId:ICart | string;
    bookId: string;
    userId: string;
    lenderId: string;
    isPaid?: boolean;
    bookStatus:string
    isMoneyTransactionStatus?: 'sent_to_website' | 'sent_to_lender' | 'completed';
    isTransaction?: ('pending' | 'completed')[];
    isSuccessfull?:boolean;
    reachedAtUserDate?: Date;
}

const orderSchema = new Schema<IOrder>({
    cartId:{type:String,ref:'cart'},
    bookId: { type: String, ref: 'books' },
    userId: { type: String, ref: 'user' }, 
    lenderId: { type: String, ref: 'user' }, 
    isPaid: { type: Boolean,default:false},
    isSuccessfull:{
        type:Boolean,
        default:false
    },
    isMoneyTransactionStatus: {
        type: String,
        enum: ['sent_to_website', 'sent_to_lender', 'completed'],
        
    },
    isTransaction: {
        type: [String],
        enum: ['pending', 'completed'],
       
    },
    bookStatus: {
        type: String,
        enum: ['not_reached', 'not_returned', 'completed','cancelled','overdue'],
        default: 'not_reached',
      },
      reachedAtUserDate: { type: Date } ,

}, { timestamps: true });

const orders = mongoose.model<IOrder>('orders', orderSchema);
export { orders, IOrder };
