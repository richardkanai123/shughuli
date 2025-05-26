'use client'
import { FileText } from "lucide-react"
import { motion } from "framer-motion"

const ProjectDescription = ({ description }: { description?: string | null }) => {
    return (
        <motion.div
            className="space-y-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.3 }}
        >
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <FileText className="h-4 w-4" />
                Description
            </div>
            <p className="text-sm leading-relaxed">
                {description || "No description provided."}
            </p>
        </motion.div>
    )
}

export default ProjectDescription