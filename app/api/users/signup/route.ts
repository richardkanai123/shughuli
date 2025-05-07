import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { APIError } from "better-auth/api";
import { BetterAuthError } from "better-auth";
import { signUpSchema } from "@/lib/validation/schemas";


export async function POST(req: NextRequest) {
    try {
        const data = await req.json()
        if(!data) {
            return Response.json({ success: false, message: "No user data provided", user: null }, { status: 406 })
        }

        const isValid = await signUpSchema.safeParseAsync(data)
        console.log(isValid.success, isValid.error)
        if (!isValid.success) {
           return Response.json({ success: false, message: isValid.error.message, user:null}, { status: 406 })
        }
        const { email, name, password, username } = isValid.data
        // create user
        const newUserCreate = await auth.api.signUpEmail({
            body: {
                email,
                name,
                password,
                role: 'MEMBER',
                username
            },
            headers: {
                'Content-Type': 'application/json',
            }

        })
        
        return Response.json({ success: true, message: "User created successfully", user: newUserCreate.user.email }, { status: 201 })

    } catch (error) {
        console.log(error)
        if (error instanceof APIError || error instanceof BetterAuthError) {
            return Response.json({ success: false, message: error.message, user: null }, { status: 500 })
        }

        return Response.json({ success: false, message: "Something went wrong", user: null }, { status: 500 })
    }
}