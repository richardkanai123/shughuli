'use client'
import { FileText } from "lucide-react"

const ProjectDescription = ({ description }: { description?: string | null }) => {
    return (
        <div className="space-y-2">
            {description ? (
                <div className="p-4 bg-muted/30 rounded-lg border border-muted/50">
                    <p className="text-sm leading-relaxed text-foreground">
                        {description}
                    </p>
                </div>
            ) : (
                <div className="p-4 bg-muted/20 rounded-lg border border-muted/30 border-dashed">
                    <p className="text-sm text-muted-foreground italic">
                        No description provided for this project.
                    </p>
                </div>
            )}
        </div>
    )
}

export default ProjectDescription