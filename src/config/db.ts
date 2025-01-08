import mongoose from "mongoose";
import config from "./config";

const dbConnect = async (): Promise<void> => {
    try {

        console.log(config.MONGODB_URI,'mongourl')
        const mongoURI: any = 'mongodb+srv://krishnamidhuna850:midhunard@cluster0.cajmhf6.mongodb.net/';
        await mongoose.connect(mongoURI);
        console.log("DB Connected");
    } catch (error) {
        console.error("MongoDB Connection Error:", error);
    }
};

export default dbConnect;
