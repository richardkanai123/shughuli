import { auth } from "@/lib/auth";
import { Team } from "@/lib/generated/prisma";
import prisma from "@/lib/prisma";
import { headers } from "next/headers";

interface UserTeamProps {
    Teams: Team[] | null,
    error: string | null,
}

export const GetUserTeams = async (): Promise<UserTeamProps> => { 
    try {
        const session = await auth.api.getSession({
            headers: await headers()
         })
    if (!session) {
        return { error: "Unauthorized", Teams: null }
    }

    const teams = await prisma.team.findMany({
        where: {
            ownerId: session.userId
        }
    })

    if(!teams) {
        return { error: "No teams found", Teams: null }
    }

    return { Teams: teams, error: null }
    
    } catch (error) {
        if(error instanceof Error) {
            return { error: error.message, Teams: null }
        }
        return { error: "Internal Server Error", Teams: null }
    }
}