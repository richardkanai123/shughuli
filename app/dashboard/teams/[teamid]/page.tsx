import prisma from '@/lib/prisma'
import React from 'react'

const TeamPage = async ({ params }: { params: Promise<{ teamid: string }> }) => {

    const { teamid } = await params
    const Team = await prisma.team.findUnique({ where: { id: teamid } })

    if (!Team) {
        return (
            <div>Team not found</div>
        )
    }
    return (
        <div>
            <h1>{Team.name}</h1>
            <p>{Team.description}</p>

        </div>
    )
}

export default TeamPage