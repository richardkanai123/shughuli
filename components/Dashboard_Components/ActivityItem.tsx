'use client';
import { format } from 'date-fns';
import { ClockIcon, MessageSquare, Edit, Trash, Users, CheckCircle2, FileText, GitBranch } from 'lucide-react';
import Link from 'next/link';
import { Separator } from '../ui/separator';
import { Badge } from '../ui/badge';
import { motion } from 'framer-motion';
import { Activity, ActivityType } from '@/lib/generated/prisma';



// Activity type icons mapping
const ACTIVITY_ICONS = {
    CREATE: <FileText className="h-4 w-4" />,
    UPDATE: <Edit className="h-4 w-4" />,
    DELETE: <Trash className="h-4 w-4" />,
    COMMENT: <MessageSquare className="h-4 w-4" />,
    INVITE: <Users className="h-4 w-4" />,
    COMPLETE: <CheckCircle2 className="h-4 w-4" />,
    BRANCH: <GitBranch className="h-4 w-4" />,
    DEFAULT: <ClockIcon className="h-4 w-4" />
};

// Client component for the activity items with animations
const ActivityItem = ({ activity, index }: { activity: Activity, index: number }) => {
    const getActivityIcon = (content: string | string[]) => {
        if (content.includes('created')) return ACTIVITY_ICONS.CREATE;
        if (content.includes('updated') || content.includes('edited')) return ACTIVITY_ICONS.UPDATE;
        if (content.includes('deleted')) return ACTIVITY_ICONS.DELETE;
        if (content.includes('commented')) return ACTIVITY_ICONS.COMMENT;
        if (content.includes('invited') || content.includes('joined')) return ACTIVITY_ICONS.INVITE;
        if (content.includes('completed') || content.includes('finished')) return ACTIVITY_ICONS.COMPLETE;
        if (content.includes('branched') || content.includes('forked')) return ACTIVITY_ICONS.BRANCH;
        return ACTIVITY_ICONS.DEFAULT;
    };


    const getTimeAgo = (date: Date) => {
        const now = new Date();
        const activityDate = new Date(date);
        const diffInSeconds = Math.floor((now.getTime() - activityDate.getTime()) / 1000);

        if (diffInSeconds < 60) return `${diffInSeconds}s ago`;
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
        if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
        return format(activityDate, 'MMM dd, yyyy');
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className="w-full relative pl-8 py-3 group"
        >
            <div className="absolute left-0 top-0 bottom-0 w-px bg-border mt-6 mb-0 ml-3"></div>

            <motion.div
                className="absolute left-0 top-0 w-6 h-6 rounded-full mt-1 flex items-center justify-center z-10"
                whileHover={{ scale: 1.2 }}
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 400, damping: 10 }}
            >
                {getActivityIcon(activity.content)}
            </motion.div>

            <Link
                href={activity.link}
                className="block group-hover:bg-muted p-2 rounded-lg transition-colors"
            >
                <div className="flex items-start justify-between">
                    <div className="flex-1">
                        <p className="text-sm text-primary font-medium mb-1 line-clamp-2">
                            {activity.content}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Badge variant="outline" className="text-xs">
                                {activity.type || 'Activity'}
                            </Badge>
                            <span>{getTimeAgo(activity.createdAt)}</span>
                        </div>
                    </div>
                </div>
            </Link>
            <Separator className="mt-2" />
        </motion.div>
    );
};

export default ActivityItem