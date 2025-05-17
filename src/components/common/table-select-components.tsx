// src/components/common/table-select-components.tsx
import React from "react";
import { Table, Row } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";

interface TableSelectHeaderProps<TData> {
    table: Table<TData>;
}
export function TableSelectHeader<TData>({ table }: TableSelectHeaderProps<TData>) {
    return (
        <div className="flex items-center justify-center px-1">
            <Checkbox
                checked={
                    table.getIsAllPageRowsSelected() ||
                    (table.getIsSomePageRowsSelected() && "indeterminate")
                }
                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                aria-label="Select all rows on this page"
            />
        </div>
    );
}

interface TableSelectCellProps<TData> {
    row: Row<TData>;
}
export function TableSelectCell<TData>({ row }: TableSelectCellProps<TData>) {
    return (
        <div className="flex items-center justify-center px-1">
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Select row"
                onClick={(e) => e.stopPropagation()} // Prevent row click if selection is primary action
            />
        </div>
    );
}