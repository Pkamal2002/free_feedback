import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User.model";
import { User } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";



export async function GET(request: NextRequest) {
    await dbConnect();

    const session = await getServerSession(authOptions)
    const user: User = session?.user as User;
    if (!session || !user) {
        return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }
    const userId = new mongoose.Types.ObjectId(user._id);

    try {
        const user = await UserModel.aggregate([
            { $match: { _id: userId } },
            {
                $unwind: '$messages'
            },
            {
                $sort: { 'messages.createdAt': -1 }
            },
            { $group: { _id: '$_id', messages: { $push: '$messages' } } }
        ]);
        if (!user || user.length === 0) {
            return NextResponse.json({ success: false, message: 'No messages found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, message: user[0].messages }, { status: 200 });

    } catch (error) {
        console.error('An unexpected error occured:', error);
        return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });

    }
}