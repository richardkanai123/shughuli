import { nextCookies } from "better-auth/next-js"
import { createAuthClient } from "better-auth/react"
import { customSessionClient } from "better-auth/client/plugins";
import { auth } from "./auth";
 const authClient = createAuthClient({
    baseURL: process.env.BASE_URL,
    plugins: [
        customSessionClient<typeof auth>(),
        nextCookies(),
    ]
 })


export const { useSession, signIn, signOut,signUp,updateUser,sendVerificationEmail,resetPassword, getSession, deleteUser, verifyEmail } = authClient