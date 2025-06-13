import React from 'react'
import { getCurrentUserDetails } from '@/lib/actions/getUserDetails'
import { Button } from "@/components/ui/button"
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
    SheetClose
} from "@/components/ui/sheet"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { format } from 'date-fns'
import { MailOpenIcon, VerifiedIcon, CalendarIcon, UserIcon, MessageSquareIcon, ClockIcon, ShieldIcon } from 'lucide-react'
import Link from 'next/link'

const UserSheet = async ({ userid }: { userid: string }) => {
    const { error, user } = await getCurrentUserDetails(userid)

    // Error state
    if (error || !user) {
        return (
            <Sheet>
                <SheetTrigger asChild>
                    <Button variant="outline" size="sm">
                        <UserIcon className="h-4 w-4 mr-2" />
                        View User
                    </Button>
                </SheetTrigger>
                <SheetContent>
                    <div className="flex flex-col items-center justify-center h-full">
                        <div className="rounded-full bg-muted w-12 h-12 flex items-center justify-center mb-4">
                            <UserIcon className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <h3 className="text-lg font-medium mb-2">User Not Available</h3>
                        <p className="text-muted-foreground text-center mb-4">
                            {error || "This user profile couldn't be loaded"}
                        </p>
                        <SheetClose asChild>
                            <Button variant="outline">Close</Button>
                        </SheetClose>
                    </div>
                </SheetContent>
            </Sheet>
        )
    }

    const { name, username, email, image, id, emailVerified, createdAt, updatedAt, role } = user
    const isCurrentUser = userid === id
    const formattedJoinDate = createdAt ? format(new Date(createdAt), 'MMMM dd, yyyy') : 'Unknown'
    const initials = name ? name.split(' ').map(n => n[0]).join('').toUpperCase() : username?.substring(0, 2).toUpperCase()

    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant="outline" size="sm">
                    {isCurrentUser ? "Your Profile" : username}
                </Button>
            </SheetTrigger>
            <SheetContent className="w-full px-4">
                <SheetHeader className="text-center pb-4">
                    <div className="mx-auto mb-4">
                        <Avatar className="h-20 w-20">
                            <AvatarImage src={image || `https://ui-avatars.com/api/?name=${encodeURIComponent(username || 'User')}`} alt={name || username} />
                            <AvatarFallback className="text-lg">{initials}</AvatarFallback>
                        </Avatar>
                    </div>

                    <SheetTitle className="text-xl flex items-center justify-center gap-2">
                        {name || username}
                        {isCurrentUser && (
                            <Badge variant="outline" className="ml-2 bg-primary/10 text-primary border-primary/20">
                                You
                            </Badge>
                        )}
                    </SheetTitle>

                    <div className="flex items-center justify-center gap-1 text-muted-foreground text-sm">
                        @{username}
                    </div>

                    {role && (
                        <Badge className="mt-2" variant="secondary">
                            {role}
                        </Badge>
                    )}
                </SheetHeader>

                <Separator className="my-4" />

                <div className="space-y-4">
                    {/* Email */}
                    <div className="flex items-center">
                        <MailOpenIcon className="h-4 w-4 text-muted-foreground mr-3" />
                        <div className="flex-1">
                            <p className="text-sm font-medium">{email}</p>
                            <p className="text-xs text-muted-foreground">Email</p>
                        </div>
                        {emailVerified && (
                            <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-200">
                                <VerifiedIcon className="h-3 w-3 mr-1" />
                                Verified
                            </Badge>
                        )}
                    </div>

                    {/* Join Date */}
                    <div className="flex items-center">
                        <CalendarIcon className="h-4 w-4 text-muted-foreground mr-3" />
                        <div>
                            <p className="text-sm font-medium">{formattedJoinDate}</p>
                            <p className="text-xs text-muted-foreground">Joined</p>
                        </div>
                    </div>
                </div>

                <Separator className="my-4" />

                {/* Account Status */}
                <div className="bg-muted p-3 rounded-md">
                    <div className="flex items-center">
                        <ShieldIcon className="h-4 w-4 mr-2 text-primary" />
                        <p className="text-sm">
                            {emailVerified ?
                                "Account is verified and secure." :
                                "Account is not verified."
                            }
                        </p>
                    </div>
                </div>

                <SheetFooter className="flex-col sm:flex-row gap-2 pt-4 mt-4">
                    <SheetClose asChild>
                        <Button variant="outline" size="sm" className="w-full sm:w-auto">
                            Close
                        </Button>
                    </SheetClose>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    )
}

export default UserSheet