'use client'

import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SortAsc, SortDesc } from "lucide-react";

// Types
type SortField = "name" | "dueDate" | "progress" | "status";
type SortDirection = "asc" | "desc";


const SortControls = ({
    sortField,
    onSortFieldChange,
    sortDirection,
    onToggleDirection,
}: {
    sortField: SortField;
    onSortFieldChange: (field: SortField) => void;
    sortDirection: SortDirection;
    onToggleDirection: () => void;
}) => (
    <div className="flex gap-2">
        <Select
            value={sortField}
            onValueChange={(value) => onSortFieldChange(value as SortField)}>
            <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="name">Name</SelectItem>
                <SelectItem value="dueDate">Due Date</SelectItem>
                <SelectItem value="progress">Progress</SelectItem>
                <SelectItem value="status">Status</SelectItem>
            </SelectContent>
        </Select>
        <Button
            variant="outline"
            size="icon"
            onClick={onToggleDirection}
            title={`Sort ${sortDirection === "asc" ? "Ascending" : "Descending"}`}>
            {sortDirection === "asc" ? (
                <SortAsc className="h-4 w-4" />
            ) : (
                <SortDesc className="h-4 w-4" />
            )}
        </Button>
    </div>
);

export default SortControls;