import 'next-auth';
import { de } from 'zod/v4/locales';

declare module 'next-auth' {
    interface User{
        _id?: string;
        username?: string;
        // email?: string;
        isVerified?: boolean;
        isAcceptingMessages?: boolean;
    }
    interface Session {
        user: {
            _id?: string;
            username?: string;
            // email?: string;
            isVerified?: boolean;
            isAcceptingMessages?: boolean;
        } & DefaultSession['user'];
    }
}

declare module 'next-auth/jwt' {
    interface JWT {
        _id?: string;
        username?: string;
        // email?: string;
        isVerified?: boolean;
        isAcceptingMessages?: boolean;
    }
}