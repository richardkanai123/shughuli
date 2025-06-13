// gets user details
import { UserDetails } from "@/lib/CustomTypes";
import { headers } from "next/headers";
import { auth } from "../auth";
import prisma from "../prisma";
interface UserDetailsProps {
    user: UserDetails | null;
    error: string | null;
}
export const getCurrentUserDetails = async (id: string): Promise<UserDetailsProps> => {
    try {

        if (!id) return { error: "User not found", user: null };

        // Check if the user is authenticated
        const session = await auth.api.getSession({
            headers: await headers(),
        })

        if (!session) {
            return { error: "Unauthorized", user: null };
        }

 
        const user = await prisma.user.findUnique({
            where: {
                id: id,
            },
            select: {
                id: true,
                email: true,
                name: true,
                username: true,
                role: true,
                createdAt: true,
                updatedAt: true,
                image: true,
                emailVerified: true,
            }
        });

        if (!user) return { error: "User not found", user: null };

        const data: UserDetails = {
            id: user.id,
            email: user.email,
            name: user.name,
            username: user.username,
            role: user.role,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
            image: user.image,
            emailVerified: user.emailVerified,
        };


        return { user: data, error: null };
    } catch (error) {
        if (error instanceof Error) return { error: error.message, user: null };
        return { error: "Something went wrong", user: null };
    }
};
