import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User.model";
import { NextRequest, NextResponse } from "next/server";
import { decode } from "punycode";



export async function POST(request:NextRequest){
    await dbConnect();
    try {
        const {username, code} = await request.json();
        if (!username || !code) {
            return NextResponse.json({ error: 'Username and code are required' }, { status: 400 });
        }
        const decodedUsername = decodeURIComponent(username);
        // Find the user by username
        const user =  await UserModel.findOne({username:decodedUsername})
        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }
        // Check if the code matches
        const isCodeValid = user.verifyCode === code;
        const isCodeNotExpired = new Date(user.verifyCodeExpiry)> new Date();
        if(isCodeValid && isCodeNotExpired){
            // Update the user's verification status
            user.isVerified = true;
            await user.save();
            return NextResponse.json({success: true, message: 'User verified successfully' }, { status: 200 });
        }
        else if(!isCodeNotExpired){
            return NextResponse.json({ success: false, messsage: 'Verification code has expired' }, { status: 400 });
        }
        else {
            return NextResponse.json({ success: false, messsage: 'Invalid verification code' }, { status: 400 });
        }

        
    } catch (error) {
        console.log('Error in verify code:', error);
        return NextResponse.json({ message: 'Error in verify code' }, { status: 500 });
        
    }
}