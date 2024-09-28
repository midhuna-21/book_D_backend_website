"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifySignUp = void 0;
// import { findEmail } from "../../respository/userRepository"
const verifySignUp = async (data) => {
    try {
        const { name, email, phone } = data;
        // let existUser=await findEmail(email)
        // if(existUser){
        //    return 'User already exist'
        // }
        return "Signup scuccessful";
    }
    catch (error) {
        console.log(error.message);
    }
};
exports.verifySignUp = verifySignUp;
//# sourceMappingURL=signUpValidation.js.map