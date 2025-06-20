'use client'
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export function TasksTableSkeleton() {
    return (
        <div className="space-y-4">
            {/* Header Skeleton */}
            <Card className="bg-gradient-to-r from-muted/30 to-muted/10 border-muted/50">
                <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Skeleton className="h-9 w-9 rounded-lg" />
                            <div className="space-y-2">
                                <Skeleton className="h-5 w-32" />
                                <Skeleton className="h-3 w-48" />
                            </div>
                        </div>
                        <Skeleton className="h-6 w-16" />
                    </div>
                </CardHeader>
                <CardContent className="pt-0">
                    <Skeleton className="h-10 w-full" />
                </CardContent>
            </Card>

            {/* Table Skeleton */}
            <Card className="shadow-sm border-0 bg-card overflow-hidden">
                <div className="rounded-lg border border-muted/50 overflow-hidden">
                    <Table>
                        <TableHeader className="bg-muted/30">
                            <TableRow className="hover:bg-transparent border-muted/50">
                                {Array.from({ length: 6 }).map((_, i) => (
                                    <TableHead key={i} className="h-12">
                                        <Skeleton className="h-4 w-full" />
                                    </TableHead>
                                ))}
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {Array.from({ length: 5 }).map((_, rowIndex) => (
                                <TableRow key={rowIndex} className="border-muted/50">
                                    {Array.from({ length: 6 }).map((_, cellIndex) => (
                                        <TableCell key={cellIndex} className="py-3">
                                            <Skeleton className="h-4 w-full" />
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>

                {/* Pagination Skeleton */}
                <div className="flex items-center justify-between p-4 border-t border-muted/50 bg-muted/20">
                    <div className="flex items-center space-x-6">
                        <div className="flex items-center space-x-2">
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-8 w-16" />
                        </div>
                        <Skeleton className="h-4 w-32" />
                    </div>
                    <div className="flex items-center space-x-2">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-8 w-8" />
                        <Skeleton className="h-8 w-8" />
                        <Skeleton className="h-8 w-8" />
                        <Skeleton className="h-8 w-8" />
                    </div>
                </div>
            </Card>
        </div>
    )
}