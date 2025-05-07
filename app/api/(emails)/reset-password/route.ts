import ResetPasswordEmail from "@/components/emails/ResetPasswordEmail";
import { NextRequest } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        // get email from body
        const { email, username, url } = body

        if (!email) {
            return Response.json({ message: 'Invalid email, could not sent verification request' }, { status: 500 });
        }

        const { error} = await resend.emails.send({
            from: "Shuguli <onboarding@resend.dev>",
            to: email as string,
            subject: "Reset your Shuguli password",
            react: ResetPasswordEmail({
                username: username as string || email as string,
                resetUrl: url as string,
            })
        });

        if (error) {
            return Response.json({ error, message: error.message }, { status: 500 });
        }

        return Response.json({ status: 200 });
    } catch (error) {
        if (error instanceof Error) {
            return Response.json({ error, message: error.message }, { status: 500 });
        }
        return Response.json({ status: 500, body: { message: "Internal Server Error" } });
    }
}