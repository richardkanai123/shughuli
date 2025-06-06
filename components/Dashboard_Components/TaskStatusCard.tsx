"use client";
import { TaskStatus } from "@/lib/generated/prisma";
import { getStatusStyles } from "@/lib/TaskStatusStyle";
import { motion } from "framer-motion";
import React from "react";

interface TaskStatusCardProps {
    label: string;
    count: number;
    status: TaskStatus;
}

// Animation variants
const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            type: "spring",
            stiffness: 300,
            damping: 20,
        },
    },
    hover: {
        y: -5,
        transition: {
            type: "spring",
            stiffness: 400,
            damping: 10,
        },
    },
};

const TaskStatusCard = ({ label, count, status }: TaskStatusCardProps) => {
    const styles = getStatusStyles(status);

    return (
        <motion.div
            variants={cardVariants}
            whileHover="hover"
            className={`group rounded-lg border bg-card text-card-foreground shadow-sm p-3 transition-colors cursor-pointer ${styles}`}>
            <div
                className={`text-sm font-medium text-muted-foreground transition-colors`}>
                {label}
            </div>
            <motion.div
                className="text-2xl font-bold"
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring" }}>
                {count}
            </motion.div>
        </motion.div>
    );
};

export default TaskStatusCard;
