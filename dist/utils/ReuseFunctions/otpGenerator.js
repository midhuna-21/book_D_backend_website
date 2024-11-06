"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateOtp = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const config_1 = __importDefault(require("../../config/config"));
const generateOtp = async (email) => {
    let otp = Math.floor(1000 + Math.random() * 9000);
    try {
        const transporter = nodemailer_1.default.createTransport({
            service: "gmail",
            host: "smtp.gmail.com",
            port: 587,
            secure: false,
            auth: {
                user: config_1.default.EMAIL,
                pass: config_1.default.APP_PASSWORD,
            },
        });
        const info = await transporter.sendMail({
            from: '"Book.D" <krishnamidhuna850@gmail.com>',
            to: email,
            subject: "Your OTP for sign up",
            text: `Your OTP for sign up is ${otp}`,
            html: `<h2> OTP for sign up </h2>
      <p>Your OTP for sign up Book.D <strong>${otp}</strong></p>`,
        });
    }
    catch (error) {
        console.error("Failed to send OTP email:", error.message);
    }
    return otp;
};
exports.generateOtp = generateOtp;
//# sourceMappingURL=otpGenerator.js.map