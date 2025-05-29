import { Message } from "@/models/User.model";
export interface ApiResponse{
    success: boolean;
    message: string;
    isAccesptingMessages?: boolean;
    data?: any; // Optional field to hold any data returned by the API
    messages?:Array<Message>;
}