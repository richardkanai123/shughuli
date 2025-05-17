'use client';
import { useState, useEffect } from "react";

// Debounce hook for search functionality
export function useDebounce<T>(value: T, delay?: number): T {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);

    useEffect(() => {
        const timer = setTimeout(() => setDebouncedValue(value), delay || 500);
        return () => clearTimeout(timer);
    }, [value, delay]);

    return debouncedValue;
}

// Fuzzy filter function for table searching
export const fuzzyFilter = (row: any, columnId: string, value: string) => {
    const searchValue = value.toLowerCase();
    const cellValue = String(row.getValue(columnId)).toLowerCase();
    return cellValue.includes(searchValue);
};