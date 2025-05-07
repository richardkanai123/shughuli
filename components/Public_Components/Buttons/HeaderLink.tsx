'use client'
import { Button } from '@/components/ui/button'
import { useSession } from '@/lib/auth-client'
import Link from 'next/link'
const HeaderLink = () => {
    const { data } = useSession()
    if (!data) {
        return null

    }

    return (
        <Button size='sm' variant='link'>
            <Link href="/dashboard">Dashboard</Link>
        </Button>
    )
}

export default HeaderLink