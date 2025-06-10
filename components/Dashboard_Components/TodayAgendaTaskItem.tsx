"use client";

import { Task } from "@/lib/generated/prisma";
import { motion } from "framer-motion";
import { Badge } from "../ui/badge";
import { ClockIcon } from "lucide-react";
import { format } from "date-fns";
import Link from "next/link";
const AgendaTaskItem = ({ task }: { task: Task }) => (
    <motion.li
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, height: 0 }}
        transition={{ duration: 0.2 }}
        key={task.id}
        className="flex items-start space-x-3 group animate-in fade-in-50">
        <div className="flex-1 space-y-1">
            <Link
                href={`/dashboard/tasks/${task.id}`}
                className="font-medium leading-none group-hover:text-green-600 transition-colors">
                {task.title}
            </Link>
            <div className="flex items-center text-xs text-muted-foreground">
                <ClockIcon className="h-3 w-3 mr-1" />
                {task.dueDate && format(new Date(task.dueDate), "h:mm a")}
                {task.priority && (
                    <Badge
                        variant="outline"
                        className={`ml-2 ${task.priority === "HIGH"
                                ? "text-red-500 border-red-200"
                                : task.priority === "MEDIUM"
                                    ? "text-amber-500 border-amber-200"
                                    : "text-blue-500 border-blue-200"
                            }`}>
                        {task.priority.toLowerCase()}
                    </Badge>
                )}
            </div>
        </div>
    </motion.li>
);

export default AgendaTaskItem;
