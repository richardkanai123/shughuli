// protection
import 'server-only'
import { auth } from '../auth'
import { headers } from 'next/headers'
import next from 'next'

export const WithAuth = async () => {
    const session = await auth.api.getSession({
        headers:await headers()
    })
    if (!session) {
        throw new Error("Unauthorized")
    }
    return next({ turbopack: true })
    
}