import {z} from 'zod'

export const signUpSchema = z.object({
    name: z.string().min(3),
    email: z.string().email(),
    password: z.string().min(6),
    username: z.string().min(3).max(20)
})

export const signInSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6)
})


// types
export type SignUpSchemaType = z.infer<typeof signUpSchema>
export type SignInSchemaType = z.infer<typeof signInSchema>