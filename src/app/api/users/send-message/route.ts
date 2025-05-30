import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User.model";
import { Message } from "@/models/User.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request:NextRequest){
    await dbConnect();
   const {username, content} =  await request.json();
   try {
   const user =  await UserModel.findOne({username});
    if(!user){
         return NextResponse.json({success:false, error:'User not found'}, {status:404});
    }
    // is User Accepting Messages
    if(!user.isAcceptingMessages){
        return NextResponse.json({success:false, error:'User is not accepting messages'}, {status:403});
    }
    // Create a new message
    const newMessage = {
        content,
        createdAt: new Date()
    }
    user.messages.push(newMessage as Message);
    await user.save();
    return NextResponse.json({success:true, message:'Message sent successfully'}, {status:200});
    
   } catch (error) {
         console.error('Error sending message:', error);
         return NextResponse.json({success:false, error:'Internal Server Error'}, {status:500});
    
   }
}