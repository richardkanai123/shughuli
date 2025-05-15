import prisma from '@/lib/prisma'
import React from 'react'

const TeamPage = async ({ params }: { params: { teamid: string } }) => {
    const Team = await prisma.team.findUnique({ where: { id: params.teamid } })

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