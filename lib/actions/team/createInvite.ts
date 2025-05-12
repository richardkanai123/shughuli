'use server'

import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"
import {  revalidateTag } from "next/cache"
import { headers } from "next/headers"

export async function createInvite(teamId: string, email: string) {
    try {
        // Get session
        const session = await auth.api.getSession({
            headers: await headers()
        })
        if (!session) {
            return { error: "Unauthorized", success: false }
        }

        const team = await prisma.team.findUnique({
            where: {
                id: teamId
            },
            include: {
                members: {
                    select: {
                        id: true
                    }
                }
            }
        })

        if (!team) {
            return { error: "Team not found", success: false }
        }

        if (team.ownerId !== session.userId && team.lead !== session.userId) {
            return { error: "You are not authorized to invite users into this team", success: false }
        }

        const user = await prisma.user.findUnique({
            where: {
                email
            },
            include: {
                teams: {
                    select: {
                        id: true
                    }
                }
            }
        })

        if (!user) {
            return { error: "User not found", success: false }
        }

        if (team.members.some((member) => member.id === user.id) || user.teams.some((team) => team.id === teamId)) {
            return { error: `${user.username} is already a member of this team`, success: false }
        }

        // if (!user.emailVerified) {
        //     return { error: "User email is not verified", success: false }
        // }

        // check for pending invite

        const pendingInvite = await prisma.teamInvitation.findFirst({
            where: {
                teamId,
                email,
                accepted: false
            }
        })

        if (pendingInvite) {
            return { error: "User already has a pending invite", success: false }
        }

         await prisma.teamInvitation.create({
            data: {
                teamId,
                email,
                invitedById: session.userId,
                role: "MEMBER",
                accepted: false,
                token: crypto.randomUUID()
            },
         })
        
        // create notification
        await prisma.notification.create({
            data: {
                title: "You have been invited to a team",
                message: `You have been invited to ${team.name} by ${session.username}.`,
                userId: user.id,
                link: `/teams/${team.slug}`,
                isRead: false
            }
        })
        
        revalidateTag('teamInvitations')

        return { success: true, error: null }
    } catch (error) {
        if(error instanceof Error) {
            return { success: false, error: error.message }
        }
        return { success: false, error: "Something went wrong, please try again." }
    }

}