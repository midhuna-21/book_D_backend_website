import { Request, Response } from "express";
import {Requests} from "../interfaces/data";
import { RequestService } from "../services/requestService";

const requestService = new RequestService();

const checkAccept = async (req: Request, res: Response) => {
    try {
        const { userId, bookId } = req.params;
        if (!userId || !bookId) {
            return res
                .status(400)
                .json({ message: "User ID or Book ID not found in request" });
        }

        const isAccepted = await requestService.getCheckAccepted(userId, bookId);
        
        return res.status(200).json({ isAccepted });
    } catch (error: any) {
        console.log("Error checkUserSent:", error);
        return res
            .status(500)
            .json({ message: "Internal server error at checkUserSent" });
    }
};

const checkUserSent = async (req: Request, res: Response) => {
    try {
        const { userId, bookId } = req.params;
        if (!userId || !bookId) {
            return res
                .status(400)
                .json({ message: "User ID or Book ID not found in request" });
        }

        const isRequested = await requestService.getCheckRequest(userId, bookId);

        return res.status(200).json({ isRequested });
    } catch (error: any) {
        console.log("Error checkUserSent:", error);
        return res
            .status(500)
            .json({ message: "Internal server error at checkUserSent" });
    }
};

const saveRequest = async (req: Request, res: Response) => {
    try {

        const { senderId,receiverId,bookId,types, totalDays,
            quantity,
            totalRentalPrice} = req.body;
        
        if(!senderId || !receiverId || !bookId){
            return res.status(500).json({message:"id is missing"})
        }
        const data:Requests | null  = { senderId,receiverId,bookId,types,totalDays,
            quantity,
            totalRentalPrice}
      const request = await requestService.getSaveRequest(data)
     
      return res.status(200).json({request})
    } catch (error: any) {
        console.log("Error saveRequest:", error);
        return res
            .status(500)
            .json({ message: "Internal server error at saveRequest" });
    }
};

const updateRequest = async (req: Request, res: Response) => {
    try {
        const {senderId,
            bookId,
            receiverId,
            types,
            requestId} = req.body;

            const reqId = requestId._id;
           
        if(!senderId || !bookId || !receiverId){
            return res.status(500).json({message:"id is missing"})
        }
        const findRequest = await requestService.getRequestById(reqId);
     
        if(!findRequest){
            return res.status(500).json({message:"request is not found"})
        }


      const request = await requestService.getAcceptRequest(reqId,types)
     console.log(request)
      return res.status(200).json({request})
    } catch (error: any) {
        console.log("Error saveRequest:", error);
        return res
            .status(500)
            .json({ message: "Internal server error at saveRequest" });
    }
};


const checkRequestAcceptOrNot = async (req: Request, res: Response) => {
    try {
        const { userId, bookId } = req.params;
    } catch (error: any) {
        console.log("Error checkUserSent:", error);
        return res
            .status(500)
            .json({ message: "Internal server error at checkUserSent" });
    }
};


export {
    checkUserSent,
    checkAccept,
    saveRequest,
    checkRequestAcceptOrNot,
    updateRequest,
    
};
