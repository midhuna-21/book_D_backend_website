import dotenv from 'dotenv';
dotenv.config()

console.log(process.env.MONGODB_URI,'mogno db uri')
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
   API_URL:process.env.API_URL,
   STRIPE_KEY:process.env.STRIPE_KEY,
   REDIS_PORT:process.env.REDIS_PORT,
   REDIS_HOST:process.env.REDIS_HOST
}  