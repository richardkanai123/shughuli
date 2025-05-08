import InviteToTeam from '@/components/Public_Components/Forms/InviteToTeam'
import { GetUserTeams } from '@/lib/actions/team/getUserTeams'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Users, Plus, AlertCircle } from 'lucide-react'
import ErrorAlert from '@/components/Public_Components/ErrorAlert'
import TeamCard from '@/components/Public_Components/TeamCard'


interface Team {
    id: string
    name: string
    members?: { id: string }[]
    ownerId: string
}

const AddTeamMember = async () => {
    const { Teams: data, error } = await GetUserTeams()

    if (error) {
        return (
            <ErrorAlert ErrorMessage={error} />
        )
    }

    if (!data || data.length === 0) {
        return (
            <div className="container max-w-md mx-auto py-10 px-4">
                <Card>
                    <CardHeader>
                        <CardTitle>No Teams Found</CardTitle>
                        <CardDescription>You haven't created any teams yet.</CardDescription>
                    </CardHeader>
                    <CardContent className="flex justify-center">
                        <Button asChild>
                            <Link href="/create-team" className="flex items-center gap-2">
                                <Plus className="w-4 h-4" />
                                Create Your First Team
                            </Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="container max-w-6xl mx-auto py-10 px-4">
            < div className="grid gap-8 md:grid-cols-[1fr,300px]" >
                {/* Teams List Section */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Users className="w-5 h-5" />
                            Your Teams
                        </CardTitle>
                        <CardDescription>
                            Here are your teams, you can invite others to join your team
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {data.map((team: Team) => (
                                <TeamCard team={team} key={team.id} />
                            ))}
                        </div>
                    </CardContent>
                </Card >
                {/* Invite Form Section */}
                < InviteToTeam teams={data} />
            </div >

        </div >
    )
}

export default AddTeamMember