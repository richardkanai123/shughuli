// gets user details
import { UserDetails } from "@/lib/CustomTypes";
import { WithAuth } from "./AuthProtection";
const BASEURL = process.env.BASE_URL

export const getUserDetails = async (id: string): Promise<UserDetails> => {
    try {
        await WithAuth()
        const res = await fetch(`${BASEURL}/api/users/getDetails/${id}`);
        if (res.status !== 200) {
            throw new Error("Failed to fetch user details");
        }
        const data: UserDetails = await res.json();
        return data;
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(error.message);
        }
        throw new Error("Failed to fetch user details");
    }
};