import { ColumnDef } from "@tanstack/react-table"
import { Task } from "@/lib/generated/prisma"
import { format } from "date-fns"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowUpDown, ChevronDown, ChevronUp } from "lucide-react"

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