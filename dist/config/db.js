"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const config_1 = __importDefault(require("./config"));
const dbConnect = async () => {
    try {
        const mongoURI = config_1.default.MONGODB_URI;
        await mongoose_1.default.connect(mongoURI);
        console.log("DB Connected");
    }
    catch (error) {
        console.error("MongoDB Connection Error:", error);
    }
};
exports.default = dbConnect;
//# sourceMappingURL=db.js.map