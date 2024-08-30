import { Requests } from "../interfaces/data";
import { notification } from "../model/notificationModel";
import { requests, IRequests } from "../model/requests";

export class RequestRepository {
    async addSaveRequest(data: Requests): Promise<IRequests | null> {
        try {
            return await new requests({
                senderId: data.senderId,
                receiverId: data.receiverId,
                bookId: data.bookId,
                types: data.types,
                totalDays: data.totalDays,
                quantity: data.quantity,
                totalRentalPrice: data.totalRentalPrice,
            }).save();
        } catch (error) {
            console.log("Error addSaveRequest:", error);
            throw error;
        }
    }

    async findCheckRequest(userId: string, bookId: string): Promise<boolean> {
        try {
            // console.log(userId,'usreId',bookId,'bookid')
            const existingRequest = await requests.findOne({
                senderId: userId,
                bookId: bookId,
                types: "requested",
            });
            //    console.log(existingRequest,'existingRequest')

            return !!existingRequest;
        } catch (error) {
            console.log("Error getCheckRequest:", error);
            throw error;
        }
    }

    async findCheckAccept(userId: string, bookId: string): Promise<boolean> {
        try {
            const existingAccepted = await notification.find({
                userId: userId,
                bookId: bookId,
                type: "Accepted",
            });
            return existingAccepted.length > 0;
        } catch (error) {
            console.log("Error getCheckRequest:", error);
            throw error;
        }
    }
    async findRequestById(requestId: string) {
        try {
            const request = await requests.findById({ _id: requestId });
            console.log(request, "request");
            return request;
        } catch (error) {
            console.log("Error findRequestById:", error);
            throw error;
        }
    }

    async findAcceptRequest(requestId: string, types: string) {
        try {
            const request = await requests.findByIdAndUpdate(
                { _id: requestId },
                { types: types },
                { new: true }
            );
            return request;
        } catch (error) {
            console.log("Error findAcceptRequest:", error);
            throw error;
        }
    }
    async findRequestDetails(requestId: string) {
        try {
            const details = await requests
                .findById({ _id: requestId })
                .populate("bookId")
                .populate("receiverId");
            return details;
        } catch (error) {
            console.log("Error findRequestDetails:", error);
            throw error;
        }
    }

    async findUpdateRequest(requestId: string) {
        try {
            const update = await requests.findByIdAndUpdate(
                { _id: requestId },
                { isPaid: true },
                { new: true }
            );
            return update;
        } catch (error) {
            console.log("Error findUpdateRequest:", error);
            throw error;
        }
    }
}
