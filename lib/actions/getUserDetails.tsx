// gets user details
import { UserDetails } from "@/lib/CustomTypes";
const BASEURL = process.env.BASE_URL;
interface UserDetailsProps {
    user: UserDetails | null;
    error: string | null;
}
export const getUserDetails = async (id: string): Promise<UserDetailsProps> => {
    try {
        const res = await fetch(`${BASEURL}/api/users/getDetails/${id}`);
        if (res.status !== 200) {
            return { error: "Something went wrong", user: null };
        }
        const data: UserDetails = await res.json();
        return { user: data, error: null };
    } catch (error) {
        if (error instanceof Error) return { error: error.message, user: null };
        return { error: "Something went wrong", user: null };
    }
};
