'use client'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, X } from "lucide-react"
import { motion } from "framer-motion"

interface TasksTableSearchProps {
    value: string
    onChange: (value: string) => void
}

export function TasksTableSearch({ value, onChange }: TasksTableSearchProps) {
    return (
        <div className="relative">
            <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="Search tasks by title, description, or status..."
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="pl-10 pr-10 h-10 bg-background border-muted/50 focus:border-primary/50"
                />
                {value && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.2 }}
                    >
                        <Button
                            variant="ghost"
                            size="sm"
                            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-muted/50"
                            onClick={() => onChange("")}
                        >
                            <X className="h-3.5 w-3.5" />
                        </Button>
                    </motion.div>
                )}
            </div>
        </div>
    )
}