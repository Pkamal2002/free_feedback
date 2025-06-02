import { Message } from "@/models/User.model";
export interface ApiResponse{
    success: boolean;
    message: string;
    isAcceptingMessages?: boolean;
    data?: any; // Optional field to hold any data returned by the API
    messages?:Array<Message>;
}