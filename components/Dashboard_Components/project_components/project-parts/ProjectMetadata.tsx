'use client'
import { Clock, Users } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { motion } from "framer-motion"

interface ProjectMetadataProps {
    updatedAt?: Date | string | null
    memberCount: number
}

const ProjectMetadata = ({ updatedAt, memberCount }: ProjectMetadataProps) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="space-y-4"
        >
            <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Last Updated</span>
                </div>
                <p className="text-sm font-medium">
                    {updatedAt
                        ? formatDistanceToNow(new Date(updatedAt), { addSuffix: true })
                        : 'Not available'}
                </p>
            </div>

            <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Team Members</span>
                </div>
                <p className="text-sm font-medium">
                    {memberCount} member{memberCount !== 1 ? 's' : ''}
                </p>
            </div>
        </motion.div>
    )
}

export default ProjectMetadata