import { Requests } from "../interfaces/data";
import { IRequests } from "../model/requests";
import { RequestRepository } from "../respository/requestRepository";


const requestRepository =new RequestRepository()


export class RequestService{

     async getCheckRequest(userId:string,bookId:string): Promise<Boolean>{
        try{
            return await requestRepository.findCheckRequest(userId,bookId)
        }catch(error){
            console.log("Error getCheckRequest:",error)
            throw error
        }
     }
     async getSaveRequest(data:Requests):Promise<IRequests | null>{
      try{
          return await requestRepository.addSaveRequest(data)
      }catch(error){
          console.log("Error getSaveRequest:",error)
          throw error;
      }
  }
     
     async getCheckAccepted(userId:string,bookId:string): Promise<Boolean>{
        try{
            return await requestRepository.findCheckAccept(userId,bookId)
        }catch(error){
            console.log("Error getUpdateProfileImage:",error)
            throw error
        }
     }

     async getRequestById(requestId:string){
        try{
            console.log(requestId,'requestId')
            return await requestRepository.findRequestById(requestId)
        }catch(error){
            console.log("Error getRequestById:",error)
            throw error
        }
    }

    async getAcceptRequest(requestId:string,types:string){
        try{
            return await requestRepository.findAcceptRequest(requestId,types)
        }catch(error){
            console.log("Error getAcceptRequest:",error)
            throw error
        }
    }

    async getRequestDetails(requestId:string){
        try{
            return await requestRepository.findRequestDetails(requestId)
        }catch(error){
            console.log("Error getRequestDetails:",error)
            throw error
        }
    }

    async getUpdateRequest(requestId:string){
        try{
            return await requestRepository.findUpdateRequest(requestId)
        }catch(error){
            console.log("Error getUpdateRequest:",error)
            throw error
        }
    }
}
