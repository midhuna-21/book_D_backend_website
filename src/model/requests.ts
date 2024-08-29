import mongoose, { Document, Types } from "mongoose";

interface IRequests extends Document {
  senderId: string;
  receiverId: string;
  bookId: string;
  types: "requested" | "rejected" | "approved"[];
  totalRentalPrice: number; 
  quantity: number; 
  totalDays: number; 
  timeStamp: Date; 
  isPaid:boolean;
}
const requestsSchema = new mongoose.Schema(
  {
    senderId: {
      type: String,
      ref: "user",
      required: true,
    },
    receiverId: {
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
      type: [String],
      enum: ["requested", "rejected", "approved"],
      required: true,
    },
    totalRentalPrice: {
      type: Number,
      required: true, 
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

const requests = mongoose.model<IRequests>("requests", requestsSchema);

export { requests, IRequests };
