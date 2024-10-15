import mongoose, { Document, Schema,Types } from 'mongoose';
import {ICart} from './cartModel'

interface IOrder extends Document {
    cartId:ICart | string;
    bookId: string;
    userId: string;
    lenderId: string;
    isPaid?: boolean;
    bookStatusFromRenter:string;
    bookStatusFromLender:string;
    statusUpdateLenderDate?: Date;
    statusUpdateRenterDate?: Date;
}

const orderSchema = new Schema<IOrder>({
    cartId:{type:String,ref:'cart'},
    bookId: { type: String, ref: 'books' },
    userId: { type: String, ref: 'user' }, 
    lenderId: { type: String, ref: 'user' }, 
    isPaid: { type: Boolean,default:false},
    bookStatusFromLender: {
        type: String,
        enum: ['not_reached', 'not_returned', 'completed','cancelled','overdue'],
        default: 'not_reached',
      },
      

    bookStatusFromRenter: {
        type: String,
        enum: ['not_reached', 'not_returned', 'completed','cancelled','overdue'],
        default: 'not_reached',
      },
      statusUpdateLenderDate: { type: Date } ,
      statusUpdateRenterDate: { type:Schema.Types.Date } ,

}, { timestamps: true });

const orders = mongoose.model<IOrder>('orders', orderSchema);
export { orders, IOrder };
