import dotenv from 'dotenv';
dotenv.config()

export default {
   PORT:process.env.PORT,
   MONGODB_URI:process.env.MONGODB_URI,
   EMAIL:process.env.EMAIL, 
   APP_PASSWORD:process.env.APP_PASSWORD,
   BUCKET_NAME: process.env.BUCKET_NAME ,
   BUCKET_REGION: process.env.BUCKET_REGION ,
   ACCESS_KEY: process.env.ACCESS_KEY ,
   SECRET_ACCESS_KEY: process.env.SECRET_ACCESS_KEY,
   JWT_SECRET: process.env.JWT_SECRET,
   JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
   API:process.env.API,
   STRIPE_KEY:process.env.STRIPE_KEY,
   TWILIO_ACCOUNT_SID:process.env.TWILIO_ACCOUNT_SID,
   TWILIO_AUTH_TOKEN:process.env.TWILIO_AUTH_TOKEN,
   TWILIO_SERVICE_ID:process.env.TWILIO_SERVICE_ID,
   TWILIO_PHONE_NUMBER:process.env.TWILIO_PHONE_NUMBER
}  