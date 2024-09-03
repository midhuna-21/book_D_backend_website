
import {ObjectId} from 'mongoose';

export interface User {
   userId?:string;
   name?:string;
   email?:string;
   image?:string;
   phone?:string;
   password?:string;
   isBlocked?:boolean;
   address?: {
      street?: string;
      city?: string;
      district?: string;
      state?: string;
      pincode?: string;
  };
   isReported?:boolean;
   isGoogle?:boolean;
   resetToken?:string;
   resetTokenExpiration?:number;

}

export interface Books{
   bookTitle:string;
   description:string;
   images:string[];
   author:string;
   genre:string;
   publisher:string;
   publishedYear:string
   rentalFee?:number;
   extraFee?:number;
   quantity:number;
   price?:number;
   address?: {
      street: string;
      city: string;
      district: string;
      state: string;
      pincode: string;
  };
   isRented?:boolean;
   isSell?:boolean;
   lenderId:string;
   maxDistance?:number;
   maxDays?:number;
   minDays?:number;
   latitude:number;
   longitude:number;

}

export interface Admin {
   email:string;
   password:string;
   isAdmin:boolean;
}

export interface Genre{
   genreName: string;
   image?: string
}

export type Notification = {
   senderId?: string;
   receiverId?: string;
   bookId?:string;
   type:string;
   content?: string;
   isReject?:boolean;
   isAccepted?:boolean;
   requestId?:string
}

export type ChatRoom = {
   senderId?:ObjectId;
   receiverId?: string;
   isRead?:boolean
   
}

export type Requests = {
   senderId:string;
   receiverId:string;
   bookId:string;
   types:string;
   totalDays?:number;
   totalRentalPrice?:number;
   quantity?:number;
}

export type Order = {
   sessionId:string;
   bookId: string;
   userId: string;
   totalPrice?: number;
   lenderId: string;
   quantity?: number;
   depositAmount?: number;
   isReturned?: boolean;
   isMoneyTransactionStatus?:string;
   isTransaction?: string;
   isSuccessfull?:boolean;
}