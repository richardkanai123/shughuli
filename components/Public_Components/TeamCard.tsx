import React from 'react'
import { Button } from '../ui/button'
import Link from 'next/link'



interface Team {
    id: string
    name: string
    members?: { id: string }[]
    ownerId: string
    lead: string | null
}


const TeamCard = ({ team }: { team: Team }) => {
    return (
        <div
            className="flex flex-col justify-between p-4 gap-3 rounded-lg border bg-card hover:bg-opacity-50 transition-all ease-in hover:shadow-2xl">
            <div>
                <h3 className="font-medium">{team.name}</h3>
                <p className="text-sm text-muted-foreground">
                    {team.members?.length || 0} members
                </p>

                <p>lead: {team.lead || 'No lead'}</p>
            </div>
            <Button size="sm" asChild>
                <Link href={`/dashboard/teams/${team.id}`}>
                    View Team
                </Link>
            </Button>
        </div>
    )
}

export default TeamCard