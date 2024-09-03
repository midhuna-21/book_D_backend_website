import mongoose, {Document,Types,Schema} from "mongoose";
  
interface IUser extends Document {
    _id: Types.ObjectId;
    name:string;
    email:string;
    image?:string;
    phone?:string;
    password:string;
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
const userSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    email: {
        type: String,
        unique: true,
    },
    image: {
        type: String,
    },
    phone: {
        type: String,
    },
    password: {
        type: String,
    },
    isBlocked: {
        type: Boolean,
        default: false,
    },
    
    isReported: { 
       type: Boolean,
       default: false 
   },
    isGoogle: {  
      type: Boolean,  
      default: false 
    },
    address: {
        street: { type: String  },
        city: { type: String},
        district: { type: String },
        state: { type: String },
        pincode: { type: String }
    },
    resetToken:{
        type:String
    },
    resetTokenExpiration:{
        type:Number
    },
    
},{timestamps:true});

const user = mongoose.model<IUser>("user", userSchema);
export { user,IUser };
