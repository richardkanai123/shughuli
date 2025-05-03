import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export const signInUser = async () => {
   await auth.api.signInEmail({
        body: {
            email: "testmail@mail.com",
            password: "Password1",
        }
   })
    redirect("/")
}