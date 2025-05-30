import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User.model";
import { User } from "next-auth";
import { NextRequest, NextResponse } from "next/server";




export async function POST(request: NextRequest) {
    await dbConnect();

    const session = await getServerSession(authOptions)
    const user: User = session?.user as User;
    if (!session || !user) {
        return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }
    const userId = user._id;
    const { acceptMessages } = await request.json();

    try {
        const updatedUser = await UserModel.findByIdAndUpdate(userId, { isAcceptingMessages: acceptMessages }, { new: true });
        if (!updatedUser) {
            return NextResponse.json({ success: false, message: "Failed to update user status to accept message" }, { status: 401 })
        }
        else {
            return NextResponse.json({ success: true, message: "Message acceptance status updated successfully", user: updatedUser }, { status: 200 })
        }

    } catch (error) {
        console.log("failed to update user status to accept messages", error);
        return NextResponse.json({ success: false, error: 'Failed to update user status to accept message' }, { status: 500 })

    }



};


export async function GET(request: NextResponse) {
    await dbConnect();

    const session = await getServerSession(authOptions)
    const user: User = session?.user as User;
    if (!session || !user) {
        return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }
    const userId = user._id;
    try {

        const foundUser = await UserModel.findById(userId)

        if (!foundUser) {
            return NextResponse.json({ success: false, message: "User not found" }, { status: 404 })
        }

        return NextResponse.json({ success: true, isAcceptingMessages: foundUser.isAcceptingMessages }, { status: 200 });
    } catch (error) {
        console.log("failed to get user status to accept messages", error);
        return NextResponse.json({ success: false, error: 'Failed to get user status to accept message' }, { status: 500 });

    }

}