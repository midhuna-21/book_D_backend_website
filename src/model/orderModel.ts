import mongoose, { Document, Schema,Types } from 'mongoose';

interface IOrder extends Document {
    sessionId:string;
    bookId: string;
    userId: string;
    totalPrice: number;
    lenderId: string;
    quantity: number;
    depositAmount: number;
    isReturned: boolean;
    bookStatus:"reached_at_user" | "reached_at_lender";
    isMoneyTransactionStatus: 'sent_to_website' | 'sent_to_lender' | 'completed';
    isTransaction: ('pending' | 'completed')[];
    isSuccessfull:boolean;
   
}

const orderSchema = new Schema<IOrder>({
    sessionId: { type: String},
    bookId: { type: String, ref: 'books' },
    userId: { type: String, ref: 'user' }, 
    totalPrice: { type: Number },
    lenderId: { type: String, ref: 'user' }, 
    quantity: { type: Number },
    depositAmount: { type: Number },
    isReturned: { type: Boolean},
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
        enum: ['reached_at_user', 'reached_at_lender'], 
      },
}, { timestamps: true });

const orders = mongoose.model<IOrder>('orders', orderSchema);
export { orders, IOrder };
