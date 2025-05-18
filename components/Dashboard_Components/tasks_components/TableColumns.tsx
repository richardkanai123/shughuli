import { ColumnDef } from "@tanstack/react-table"
import { Task } from "@/lib/generated/prisma"
import { format } from "date-fns"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowUpDown, ChevronDown, ChevronUp, ExternalLink } from "lucide-react"
import Link from "next/link"

export const getTaskColumns = (): ColumnDef<Task>[] => [
    {
        accessorKey: "title",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    className="hover:bg-muted p-0 h-8 font-medium">
                    Title
                    {column.getIsSorted() === "asc" ? (
                        <ChevronUp className="ml-2 h-4 w-4" />
                    ) : column.getIsSorted() === "desc" ? (
                        <ChevronDown className="ml-2 h-4 w-4" />
                    ) : (
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    )}
                </Button>
            );
        },
        cell: ({ row }) => {
            const taskId = row.original.id;
            const title = row.getValue("title") as string;

            return (
                <Link
                    href={`/dashboard/tasks/${taskId}`}
                    className="flex items-center text-primary hover:underline hover:text-primary/80 transition-colors group"
                >
                    <span className="truncate">{title}</span>
                    <ExternalLink className="ml-2 h-3 w-3 opacity-0 group-hover:opacity-50 transition-opacity" />
                </Link>
            );
        }
    },
    {
        accessorKey: "status",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    className="hover:bg-muted p-0 h-8 font-medium">
                    Status
                    {column.getIsSorted() === "asc" ? (
                        <ChevronUp className="ml-2 h-4 w-4" />
                    ) : column.getIsSorted() === "desc" ? (
                        <ChevronDown className="ml-2 h-4 w-4" />
                    ) : (
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    )}
                </Button>
            );
        },
        cell: ({ row }) => {
            const status = row.getValue("status") as string;
            return (
                <Badge
                    variant="secondary"
                    className={
                        status === "DONE"
                            ? "bg-green-500/10 text-green-500"
                            : status === "IN_PROGRESS"
                                ? "bg-orange-500/10 text-orange-500"
                                : "bg-blue-500/10 text-blue-500"
                    }>
                    {status}
                </Badge>
            );
        },
    },
    {
        accessorKey: "priority",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    className="hover:bg-muted p-0 h-8 font-medium">
                    Priority
                    {column.getIsSorted() === "asc" ? (
                        <ChevronUp className="ml-2 h-4 w-4" />
                    ) : column.getIsSorted() === "desc" ? (
                        <ChevronDown className="ml-2 h-4 w-4" />
                    ) : (
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    )}
                </Button>
            );
        },
        cell: ({ row }) => (
            <Badge variant="outline">{row.getValue("priority")}</Badge>
        ),
    },
    {
        accessorKey: "dueDate",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    className="hover:bg-muted p-0 h-8 font-medium">
                    Due Date
                    {column.getIsSorted() === "asc" ? (
                        <ChevronUp className="ml-2 h-4 w-4" />
                    ) : column.getIsSorted() === "desc" ? (
                        <ChevronDown className="ml-2 h-4 w-4" />
                    ) : (
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    )}
                </Button>
            );
        },
        cell: ({ row }) => format(new Date(row.getValue("dueDate")), "PP"),
    },
];