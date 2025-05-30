import {z} from 'zod';
import dbConnect from '@/lib/dbConnect';
import UserModel from '@/models/User.model';
import { NextRequest,NextResponse } from 'next/server';
import { usernameValidation } from '@/schemas/signUpSchema';


const UsernameQuerySchema = z.object({
    username: usernameValidation
});

export async function GET(request:NextRequest){
    await dbConnect();
    try {
        const {searchParams} = new URL(request.url);
        const queryParam = {
            username: searchParams.get('username')
        }
        // Validate the query parameters with zod
       const result = UsernameQuerySchema.safeParse(queryParam);
    //    console.log('Query Result:', result);
        if (!result.success) {
            const usernameErrors = result.error.format().username?._errors || [];
            return NextResponse.json({success: false, error: usernameErrors?.length>0?usernameErrors.join(', '): 'Invalid query parameters' }, { status: 400 });
        }

        const { username } = result.data;

        // Check if the username exists in the database
        const existingVerifiedUser = await UserModel.findOne({ username, isVerified: true });

        if (existingVerifiedUser) {
            return NextResponse.json({ message: 'Username is already taken' }, { status: 200 });
        } else {
            return NextResponse.json({message: 'Username is available to use'}, { status: 200 });
        }
        
    } catch (error) {
        console.log('Error Checking Username:', error);
        return NextResponse.json({ error: 'Error Checking Username ' }, { status: 500 });
        
    }
}