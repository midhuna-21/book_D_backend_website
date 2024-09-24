import mongoose, { Document, Types } from "mongoose";

interface ICart extends Document {
  userId: string;
  ownerId: string;
  bookId: string;
  types: string;
  totalAmount:number;
  totalRentalPrice: number; 
  quantity: number; 
  totalDays: number; 
  timeStamp: Date; 
  total_deposit_amount:number;
  isPaid:boolean;
}
const cartSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      ref: "user",
      required: true,
    },
    ownerId: {
      type: String,
      ref: "user",
      required: true,
    },
    bookId: {
      type: String,
      ref: "books",
      required: true,
    },
    types: {
      type: String,
      enum: ["requested", "rejected", "accepted"],
      required: true,
    },
    totalAmount:{
      type:Number,
      required:true
    },
    totalRentalPrice: {
      type: Number,
      required: true, 
    },
    total_deposit_amount:{
      type:Number,
      required:true
    },
    quantity: {
      type: Number,
      required: true, 
    },
    totalDays: {
      type: Number,
      required: true, 
    },
    timeStamp: {
      type: Date,
      default: Date.now, 
    },
    isPaid:{
      type:Boolean,
      default:false
    }
  },
  { timestamps: true }
);

const cart = mongoose.model<ICart>("cart", cartSchema);

export { cart, ICart };
