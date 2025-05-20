'use client';

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ProjectStatProps {
    icon: React.ReactNode
    label: string
    value: number
    className?: string
}

export default function ProjectStat({ icon, label, value, className }: ProjectStatProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={cn(
                "p-4 rounded-lg space-y-2 hover:shadow-lg transition-all duration-200 ",
                className
            )}
        >
            <motion.div
                className="flex items-center gap-2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
            >
                <motion.div
                    whileHover={{ rotate: 10 }}
                    transition={{ type: "spring", stiffness: 200 }}
                >
                    {icon}
                </motion.div>
                <motion.span
                    className="text-sm font-medium"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    {label}
                </motion.span>
            </motion.div>
            <motion.p
                className="text-2xl font-bold"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                    type: "spring",
                    stiffness: 200,
                    delay: 0.3
                }}
            >
                {value}
            </motion.p>
        </motion.div>
    );
}