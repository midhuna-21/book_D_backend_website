"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminService = void 0;
const adminRespository_1 = require("../respository/adminRespository");
const adminRepository = new adminRespository_1.AdminRepository();
class AdminService {
    async getAdminByEmail(email) {
        try {
            return await adminRepository.findAdminByEmail(email);
        }
        catch (error) {
            console.log("Error getAdminByEmail:", error);
            throw error;
        }
    }
    async getGenreName(genreName) {
        try {
            return await adminRepository.findGenreByName(genreName);
        }
        catch (error) {
            console.log("Error getGenreName:", error);
            throw error;
        }
    }
    async getCreateGenre(data) {
        try {
            return await adminRepository.createGenre(data);
        }
        catch (error) {
            console.log("Error getGenreName:", error);
            throw error;
        }
    }
    // async getCreateCustomGenre(genreName:Partial<Genre>):Promise<IGenre | null>{
    //    try{
    //       return await adminRepository.createCustomGenre(genreName)
    //    }catch(error){
    //       console.log("Error getGenreName:",error);
    //       throw error
    // }
    // }
    async getAllUsers() {
        try {
            return await adminRepository.findAllUsers();
        }
        catch (error) {
            console.log("Error getAllUsers:", error);
            throw error;
        }
    }
    async getWalletTransactions() {
        try {
            return await adminRepository.findWalletTransactions();
        }
        catch (error) {
            console.log("Error getWalletTransactions:", error);
            throw error;
        }
    }
    async getAllTotalRentedBooks() {
        try {
            return await adminRepository.findAllTotalRentedBooks();
        }
        catch (error) {
            console.log("Error getAllTotalRentedBooks:", error);
            throw error;
        }
    }
    async getAllTotalSoldBooks() {
        try {
            return await adminRepository.findAllTotalSoldBooks();
        }
        catch (error) {
            console.log("Error getAllTotalSoldBooks:", error);
            throw error;
        }
    }
    async getAllTotalBooks() {
        try {
            return await adminRepository.findAllTotalBooks();
        }
        catch (error) {
            console.log("Error getAllTotalBooks:", error);
            throw error;
        }
    }
    async getBlockUser(_id) {
        try {
            return await adminRepository.blockUser(_id);
        }
        catch (error) {
            console.log("Error getBlockUser:", error);
            throw error;
        }
    }
    async getUnblockUser(_id) {
        try {
            return await adminRepository.unBlockUser(_id);
        }
        catch (error) {
            console.log("Error getAllUsers:", error);
            throw error;
        }
    }
    async getAdminById(_id) {
        try {
            return await adminRepository.findAdminById(_id);
        }
        catch (error) {
            console.log("Error getAdminById:", error);
            throw error;
        }
    }
    async getAllOrders() {
        try {
            return await adminRepository.findAllOrders();
        }
        catch (error) {
            console.log("Error getAllOrders:", error);
            throw error;
        }
    }
    async getOrderDetail(orderId) {
        try {
            return await adminRepository.findOrderDetail(orderId);
        }
        catch (error) {
            console.log("Error getOrderDetail:", error);
            throw error;
        }
    }
}
exports.AdminService = AdminService;
// const getUnBlockUser =async(_id:string)=>{
//    return await adminRepository.findUnBlockUser(_id)
// }
// const getBlockUser =async(_id:string)=>{
//    return await adminRepository.findBlockUser(_id)
// }
// const getAllUsers =async()=>{
//    return await adminRepository.findAllUsers()
// }
// const getAddGenre = async(genreName:string, image:string)=>{
//    return await adminRepository.addGenre(genreName,image)
// }
// const getGenreName = async(genreName:string)=>{
//    return await adminRepository.findGenreName(genreName)
// }
//# sourceMappingURL=adminService.js.map