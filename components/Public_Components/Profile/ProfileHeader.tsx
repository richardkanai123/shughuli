import Image from "next/image"

interface ProfileHeaderProps {
    user: {
        image: string | null
        name: string
    }
    username: string
}

export function ProfileHeader({ user, username }: ProfileHeaderProps) {
    return (
        <>
            <div className="h-32 bg-gradient-to-r from-blue-600 to-purple-600">
            </div>
            <div className="absolute top-16 left-6">
                <div className="h-32 w-32 rounded-full border-4 border-white dark:border-gray-800 overflow-hidden bg-gray-100">
                    {user.image ? (
                        <Image
                            src={user.image}
                            alt={username || "Profile picture"}
                            width={128}
                            height={128}
                            className="object-cover"
                        />
                    ) : (
                        <Image
                            src={"https://ui-avatars.com/api/?name=" + username}
                            alt={username || "Profile picture"}
                            width={128}
                            height={128}
                            className="object-cover"
                        />
                    )}
                </div>
            </div>
        </>
    )
}