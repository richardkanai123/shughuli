"use client";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Task } from "@/lib/generated/prisma";
import {
    flexRender,
    getCoreRowModel,
    getSortedRowModel,
    getFilteredRowModel,
    SortingState,
    useReactTable,
    getPaginationRowModel,
    PaginationState,
} from "@tanstack/react-table";
import { useState, useMemo } from "react";
import { getTaskColumns } from "./TableColumns";
import { useDebounce, fuzzyFilter } from "./TableUtils";
import { TasksTableSearch } from "./TasksTableSearch";
import { TasksTableSkeleton } from "./TasksTableSkeleton";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Table as TableIcon, AlertCircle } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface TasksTableProps {
    tasks: Task[];
    isLoading?: boolean;
    error?: Error;
}

export function TasksTable({ tasks, isLoading, error }: TasksTableProps) {
    if (error) {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
            >
                <Card className="border-destructive/50 bg-destructive/5">
                    <CardContent className="p-6">
                        <div className="flex items-center gap-3 text-destructive">
                            <div className="p-2 rounded-lg bg-destructive/10">
                                <AlertCircle className="h-5 w-5" />
                            </div>
                            <div>
                                <h3 className="font-semibold mb-1">Error Loading Tasks</h3>
                                <p className="text-sm">{error.message}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
        );
    }

    if (isLoading) {
        return <TasksTableSkeleton />;
    }

    // State management
    const [sorting, setSorting] = useState<SortingState>([]);
    const [globalFilter, setGlobalFilter] = useState("");
    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: 10,
    });

    const debouncedFilter = useDebounce(globalFilter, 300);

    // Memoized columns definition
    const columns = useMemo(() => getTaskColumns(), []);

    // Table instance
    const table = useReactTable({
        data: tasks,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onSortingChange: setSorting,
        onPaginationChange: setPagination,
        filterFns: {
            fuzzy: fuzzyFilter,
        },
        state: {
            sorting,
            globalFilter: debouncedFilter,
            pagination,
        },
        globalFilterFn: fuzzyFilter,
    });

    const totalRows = table.getFilteredRowModel().rows.length;
    const currentPage = table.getState().pagination.pageIndex + 1;
    const totalPages = table.getPageCount();
    const startRow = table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1;
    const endRow = Math.min(startRow + table.getState().pagination.pageSize - 1, totalRows);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
        >
            {/* Enhanced Header */}
            <Card className="bg-gradient-to-r from-muted/30 to-muted/10 border-muted/50">
                <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-primary/10">
                                <TableIcon className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                                <CardTitle className="text-lg font-semibold">Tasks Table</CardTitle>
                                <p className="text-sm text-muted-foreground">
                                    Manage and organize your tasks efficiently
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">
                                {totalRows} task{totalRows !== 1 ? 's' : ''}
                            </Badge>
                            {globalFilter && (
                                <Badge variant="secondary" className="text-xs">
                                    Filtered
                                </Badge>
                            )}
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="pt-0">
                    <TasksTableSearch
                        value={globalFilter}
                        onChange={setGlobalFilter}
                    />
                </CardContent>
            </Card>

            {/* Enhanced Table Container */}
            <Card className="shadow-sm border-0 bg-card overflow-hidden">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1, duration: 0.3 }}
                >
                    <div className="rounded-lg border border-muted/50 overflow-hidden">
                        <Table>
                            <TableHeader className="bg-muted/30">
                                {table.getHeaderGroups().map((headerGroup) => (
                                    <TableRow key={headerGroup.id} className="hover:bg-transparent border-muted/50">
                                        {headerGroup.headers.map((header) => (
                                            <TableHead
                                                key={header.id}
                                                className="font-semibold text-foreground/80 h-12"
                                            >
                                                {header.isPlaceholder
                                                    ? null
                                                    : flexRender(
                                                        header.column.columnDef.header,
                                                        header.getContext()
                                                    )}
                                            </TableHead>
                                        ))}
                                    </TableRow>
                                ))}
                            </TableHeader>
                            <TableBody>
                                <AnimatePresence mode="wait">
                                    {table.getRowModel().rows?.length ? (
                                        table.getRowModel().rows.map((row, index) => (
                                            <motion.tr
                                                key={row.id}
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{
                                                    delay: index * 0.02,
                                                    duration: 0.2
                                                }}
                                                className={cn(
                                                    "border-muted/50 hover:bg-muted/50 transition-colors duration-200",
                                                    "group cursor-pointer"
                                                )}
                                            >
                                                {row.getVisibleCells().map((cell) => (
                                                    <TableCell
                                                        key={cell.id}
                                                        className="py-3"
                                                    >
                                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                                    </TableCell>
                                                ))}
                                            </motion.tr>
                                        ))
                                    ) : (
                                        <motion.tr
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ duration: 0.3 }}
                                        >
                                            <TableCell
                                                colSpan={columns.length}
                                                className="h-32 text-center"
                                            >
                                                <div className="flex flex-col items-center gap-3 text-muted-foreground">
                                                    <TableIcon className="h-8 w-8" />
                                                    <div>
                                                        <p className="font-medium">No tasks found</p>
                                                        <p className="text-sm">
                                                            {globalFilter
                                                                ? "Try adjusting your search terms"
                                                                : "Create your first task to get started"}
                                                        </p>
                                                    </div>
                                                </div>
                                            </TableCell>
                                        </motion.tr>
                                    )}
                                </AnimatePresence>
                            </TableBody>
                        </Table>
                    </div>
                </motion.div>

                {/* Enhanced Pagination */}
                {totalRows > 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2, duration: 0.3 }}
                        className="flex items-center justify-between p-4 border-t border-muted/50 bg-muted/20"
                    >
                        {/* Pagination Info */}
                        <div className="flex items-center space-x-6 text-sm text-muted-foreground">
                            <div className="flex items-center space-x-2">
                                <span className="font-medium text-foreground">Rows per page</span>
                                <Select
                                    value={`${pagination.pageSize}`}
                                    onValueChange={(value) => {
                                        table.setPageSize(Number(value));
                                    }}
                                >
                                    <SelectTrigger className="h-8 w-[70px] bg-background">
                                        <SelectValue placeholder={pagination.pageSize} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {[5, 10, 20, 30, 40, 50].map((pageSize) => (
                                            <SelectItem key={pageSize} value={`${pageSize}`}>
                                                {pageSize}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="hidden sm:flex items-center gap-1">
                                <span className="font-medium text-foreground">
                                    Showing {startRow}-{endRow}
                                </span>
                                <span>of {totalRows} result{totalRows !== 1 ? 's' : ''}</span>
                            </div>

                            <div className="sm:hidden">
                                <span className="font-medium text-foreground">
                                    Page {currentPage} of {totalPages}
                                </span>
                            </div>
                        </div>

                        {/* Page Navigation */}
                        <div className="flex items-center space-x-2">
                            <div className="hidden sm:flex items-center space-x-1 text-sm text-muted-foreground mr-4">
                                <span>Page</span>
                                <span className="font-medium text-foreground">{currentPage}</span>
                                <span>of {totalPages}</span>
                            </div>

                            <Button
                                variant="outline"
                                className="hidden h-8 w-8 p-0 lg:flex hover:bg-muted/50"
                                onClick={() => table.setPageIndex(0)}
                                disabled={!table.getCanPreviousPage()}
                            >
                                <span className="sr-only">Go to first page</span>
                                <ChevronsLeft className="h-4 w-4" />
                            </Button>
                            <Button
                                variant="outline"
                                className="h-8 w-8 p-0 hover:bg-muted/50"
                                onClick={() => table.previousPage()}
                                disabled={!table.getCanPreviousPage()}
                            >
                                <span className="sr-only">Go to previous page</span>
                                <ChevronLeft className="h-4 w-4" />
                            </Button>
                            <Button
                                variant="outline"
                                className="h-8 w-8 p-0 hover:bg-muted/50"
                                onClick={() => table.nextPage()}
                                disabled={!table.getCanNextPage()}
                            >
                                <span className="sr-only">Go to next page</span>
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                            <Button
                                variant="outline"
                                className="hidden h-8 w-8 p-0 lg:flex hover:bg-muted/50"
                                onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                                disabled={!table.getCanNextPage()}
                            >
                                <span className="sr-only">Go to last page</span>
                                <ChevronsRight className="h-4 w-4" />
                            </Button>
                        </div>
                    </motion.div>
                )}
            </Card>
        </motion.div>
    );
}