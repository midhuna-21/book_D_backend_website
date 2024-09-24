import mongoose from 'mongoose';

interface IWalletTransaction extends Document {
   source:string,
   userId:string,
   lenderId:string,
   status:string,
   total_amount:number,
   rental_amount:number,
   deposit_amount:number,
   createdAt:Date,
}
const transactionSchema = new mongoose.Schema(
  {
   total_amount: {
      type: Number,
    },
    rental_amount: {
      type: Number,
    },
    deposit_amount: {
      type: Number,
    },
    source: {
        type: String,
       
        enum: [
            'Payment received',
            'refund_to_user' , 
            'payment_to_lender',
            'deposit_fee_to_user'  ,
            'deposit_fee_to_lender' 
          ], 
      },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',  
     
    },
    lenderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',    
    },
    status: {
      type: String,
      enum: ['credit','debit'],
      default: 'credit',
    },
  },
  {
    timestamps: true,
  }
);


const bookDWalletSchema = new mongoose.Schema(
  {
    balance: {
      type: Number,
      default: 0,
    },
    transactions: [transactionSchema],
  },
  {
    timestamps: true,
  }
);

const bookDWallet = mongoose.model('bookDWallet', bookDWalletSchema);

export { bookDWallet,IWalletTransaction };