import mongoose,{Schema, Document} from "mongoose";

 export interface Message extends Document{
    content: string;
    createdAt: Date;
};



const MessageSchema:Schema<Message> = new Schema({
    content: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now
    }


},
{
    timestamps: true
});

export interface User extends Document{
    username: string;
    email: string;
    password: string;
    verifyCode: string;
    verifyCodeExpiry: Date;
    isVerified: boolean;
    isAcceptingMessages: boolean;
    messages: Message[];
}


const UserSchema: Schema<User> = new Schema({
    username: {
        type: String,
        required: [true, 'Username is required'],
        trim: true,
        minlength: [3, 'Username must be at least 2 characters long'],
        unique: true
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        match: [/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, 'Please fill a valid email address'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
    },
    verifyCode: {
        type: String,
        required: [true, 'VerifyCode code is required'],
    },
    verifyCodeExpiry: {
        type: Date,
        required: [true, 'VerifyCode expiry is required'],
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    isAcceptingMessages: {
        type: Boolean,
        default: true
    },
    messages: [MessageSchema]
},
{
    timestamps: true
});

const UserModel = (mongoose.models.User as mongoose.Model<User>)|| mongoose.model<User>('User', UserSchema);

export default UserModel;