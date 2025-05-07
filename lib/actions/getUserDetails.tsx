// gets user details
import { UserDetails } from "@/lib/CustomTypes";
import { headers } from "next/headers";
import { auth } from "../auth";
const BASEURL = process.env.BASE_URL;
interface UserDetailsProps {
    user: UserDetails | null;
    error: string | null;
}
export const getCurrentUserDetails = async (id: string): Promise<UserDetailsProps> => {
    try {
        const session = await auth.api.getSession({
            headers: await headers()
        })


        // check if user is logged in and if the id of the user is the same as the id of the user who is logged in
        if (!session || id !== session.userId) {
            return { error: "Unauthorized", user: null };
        }

        const res = await fetch(`${BASEURL}/api/users/getDetails/${session.userId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            next: {
                tags: ["users", session.userId],
            }


        });
        const data = await res.json();
        if (res.status !== 200) {
            return { error: data.message as string || "Something went wrong", user: null };
        }
        return { user: data, error: null };
    } catch (error) {
        if (error instanceof Error) return { error: error.message, user: null };
        return { error: "Something went wrong", user: null };
    }
};
