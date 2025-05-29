import {z} from 'zod';


export const signInShema = z.object({
    identifier: z.string(),
    password: z.string()
})