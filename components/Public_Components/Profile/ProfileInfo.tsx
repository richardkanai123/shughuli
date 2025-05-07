import { User, AtSign, Mail, CheckCircle2, MailWarning } from "lucide-react";
import VerifyEmailBtn from "@/components/Public_Components/Buttons/VerifyEmailButton";
import { UserDetails } from "@/lib/CustomTypes";

interface ProfileInfoProps {
    user: UserDetails;
    username: string;
}
export function ProfileInfo({ user, username }: ProfileInfoProps) {
    return (
        <div className="flex justify-between items-start">
            <div className="space-y-3">
                <div className="flex items-center gap-2">
                    <User className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                        {user.name}
                    </h1>
                </div>
                <div className="flex items-center gap-2">
                    <AtSign className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                    <p className="text-gray-500 dark:text-gray-400">{username}</p>
                </div>
                <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                    <p className="text-gray-600 dark:text-gray-300">
                        {user.email}
                        {user.emailVerified ? (
                            <CheckCircle2 className="inline-block w-4 h-4 ml-1 text-green-500" />
                        ) : (
                            <MailWarning className="w-4 h-4 inline-block ml-1 text-yellow-300" />
                        )}
                    </p>
                    {!user.emailVerified && <VerifyEmailBtn email={user.email} />}
                </div>
            </div>
        </div>
    );
}
