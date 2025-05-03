import SignInBtn from '@/components/Public_Components/Buttons/sign-inBtn'
import SignOutBtn from '@/components/Public_Components/Buttons/SignOutBtn'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'

const Dashboard = async () => {
    const session = await auth.api.getSession({
        headers: await headers() // you need to pass the headers object.
    })


    return (
        <div>
            <p>Dashboard</p>
            {session ? <SignOutBtn /> : <SignInBtn />}
            <pre>{JSON.stringify(session, null, 2)}</pre>
        </div>
    )
}

export default Dashboard