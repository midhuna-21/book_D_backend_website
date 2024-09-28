"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.comparePassword = exports.hashPassword = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const hashPassword = async (password) => {
    let securePassword = await bcryptjs_1.default.hash(password, 10);
    return securePassword;
};
exports.hashPassword = hashPassword;
const comparePassword = async (password, hashPassword) => {
    return await bcryptjs_1.default.compare(password, hashPassword);
};
exports.comparePassword = comparePassword;
//# sourceMappingURL=passwordValidation.js.map