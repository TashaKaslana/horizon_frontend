// components/datatable/DataTable.tsx
"use client";

import React from "react";
import {
    ColumnDef,
    ColumnFiltersState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    SortingState,
    useReactTable,
    Table as TanstackTableType,
    Row,
    TableMeta,
    VisibilityState,
    FilterFn,

} from "@tanstack/react-table";
import type { DragEndEvent } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";

import {
    Table, // Your ShadCN UI Table
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import {
    DataTablePagination,
    DataTableViewOptions,
} from "@/components/common/data-table-components"; // Corrected import path
import {
    DndTableContext,
    DraggableRow,
    DraggableItem, // Import DraggableItem type
} from "@/components/common/dnd-table-components"; // Corrected import path

interface DataTableProps<TData extends DraggableItem, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    setData?: React.Dispatch<React.SetStateAction<TData[]>>;
    fetchNextPage?: () => void;
    hasNextPage?: boolean;
    isLoading?: boolean;
    isFetchingNextPage?: boolean;
    enableDnd?: boolean;
    onDragEnd?: (event: DragEndEvent, currentData: TData[]) => TData[]; // Custom logic can return new array
    filterPlaceholder?: string;
    initialSort?: SortingState;
    initialColumnVisibility?: VisibilityState; // Allow initial column visibility
    enableRowSelection?: boolean | ((row: Row<TData>) => boolean);
    meta?: TableMeta<TData>;
    showGlobalFilter?: boolean;
    showViewOptions?: boolean;
    showPagination?: boolean;
    globalFilterFn?: FilterFn<TData> | 'auto' | null;
}

const genericGlobalFilterFn: FilterFn<any> = (
    row: Row<any>,
    columnId: string, // Not used by global filter, but part of FilterFn signature
    filterValue: string
): boolean => {
    const lowercasedFilterValue = filterValue.toLowerCase();

    // Iterate over all values in the original row data
    for (const key in row.original) {
        if (Object.prototype.hasOwnProperty.call(row.original, key)) {
            const value = row.original[key];

            // Check if the value is a string or number and if it includes the filter text
            if ((typeof value === 'string' || typeof value === 'number') &&
                String(value).toLowerCase().includes(lowercasedFilterValue)) {
                return true; // Match found
            }
            // Optional: If you have nested objects/arrays you want to search,
            // you might need a more recursive approach here, but for flat
            // or mostly flat data, this is usually sufficient.
        }
    }
    return false; // No match found in any property
};

export function DataTable<TData extends DraggableItem, TValue>({
                                                                   columns,
                                                                   data,
                                                                   setData,
                                                                   fetchNextPage,
                                                                   hasNextPage,
                                                                   isLoading,
                                                                   isFetchingNextPage,
                                                                   enableDnd = false,
                                                                   onDragEnd: customOnDragEnd,
                                                                   filterPlaceholder = "Search...",
                                                                   initialSort = [],
                                                                   initialColumnVisibility = {},
                                                                   enableRowSelection = false,
                                                                   meta,
                                                                   showGlobalFilter = true,
                                                                   showViewOptions = true,
                                                                   showPagination = true,
                                                                   globalFilterFn: providedGlobalFilterFn = genericGlobalFilterFn,
                                                               }: DataTableProps<TData, TValue>) {
    const [sorting, setSorting] = React.useState<SortingState>(initialSort);
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
    const [globalFilter, setGlobalFilter] = React.useState("");
    const [rowSelection, setRowSelection] = React.useState({});
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>(initialColumnVisibility);

    const memoizedData = React.useMemo(() => data, [data]);
    const memoizedColumns = React.useMemo(() => columns, [columns]); // Memoize columns if they can change

    const table = useReactTable({
        data: memoizedData,
        columns: memoizedColumns,
        meta,
        state: {
            sorting,
            columnFilters,
            globalFilter,
            rowSelection: enableRowSelection ? rowSelection : {},
            columnVisibility,
        },
        enableRowSelection,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        onGlobalFilterChange: setGlobalFilter,
        onRowSelectionChange: enableRowSelection ? setRowSelection : undefined,
        onColumnVisibilityChange: setColumnVisibility,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getRowId: (row: TData) => row.id.toString(),
        globalFilterFn: providedGlobalFilterFn === null ? undefined : providedGlobalFilterFn,
    });

    const handleDragEnd = (event: DragEndEvent) => {
        if (!enableDnd) return;

        if (customOnDragEnd) {
            const reorderedData = customOnDragEnd(event, memoizedData);
            if (setData && reorderedData) setData(reorderedData);
        } else if (setData) {
            const { active, over } = event;
            if (active && over && active.id !== over.id) {
                setData((currentData) => {
                    const oldIndex = currentData.findIndex(item => item.id === active.id);
                    const newIndex = currentData.findIndex(item => item.id === over.id);
                    if (oldIndex === -1 || newIndex === -1) return currentData;
                    return arrayMove(currentData, oldIndex, newIndex);
                });
            }
        } else {
            console.warn("DataTable: 'setData' prop or a custom 'onDragEnd' prop is required for DND reordering.");
        }
    };

    const tableContent = (
        <Table>
            <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id}>
                        {headerGroup.headers.map((header) => (
                            <TableHead key={header.id} style={{ width: header.getSize() !== 150 ? header.getSize() : undefined }} colSpan={header.colSpan}>
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
                {isLoading && !isFetchingNextPage ? (
                    <TableRow>
                        <TableCell colSpan={memoizedColumns.length} className="h-24 text-center">
                            <Spinner />
                        </TableCell>
                    </TableRow>
                ) : table.getRowModel().rows?.length ? (
                    table.getRowModel().rows.map((row) =>
                        enableDnd ? (
                            <DraggableRow key={row.id} row={row as Row<TData>} />
                        ) : (
                            <TableRow
                                key={row.id}
                                data-state={row.getIsSelected() && "selected"}
                            >
                                {row.getVisibleCells().map((cell) => (
                                    <TableCell key={cell.id} style={{ width: cell.column.getSize() !== 150 ? cell.column.getSize() : undefined }}>
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </TableCell>
                                ))}
                            </TableRow>
                        )
                    )
                ) : !isLoading ? (
                    <TableRow>
                        <TableCell colSpan={memoizedColumns.length} className="h-24 text-center">
                            No results found.
                        </TableCell>
                    </TableRow>
                ) : null}
                {isFetchingNextPage && (
                    <TableRow>
                        <TableCell colSpan={memoizedColumns.length} className="h-12 text-center">
                            <Spinner size="small" />
                        </TableCell>
                    </TableRow>
                )}
            </TableBody>
        </Table>
    );

    return (
        <div className="space-y-4">
            {(showGlobalFilter || showViewOptions) && (
                <div className="flex items-center justify-between p-1">
                    {showGlobalFilter ? (
                        <Input
                            placeholder={filterPlaceholder}
                            value={globalFilter ?? ""}
                            onChange={(event) => setGlobalFilter(event.target.value)}
                            className="h-8 w-[150px] lg:w-[250px]"
                        />
                    ) : <div />} {/* Placeholder for spacing if only view options shown */}
                    {showViewOptions && <DataTableViewOptions table={table as TanstackTableType<TData>} />}
                </div>
            )}
            <div className="rounded-md border">
                {enableDnd && memoizedData.length > 0 ? (
                    <DndTableContext items={memoizedData} onDragEndAction={handleDragEnd}>
                        {tableContent}
                    </DndTableContext>
                ) : (
                    tableContent
                )}
            </div>
            {showPagination && (
                <DataTablePagination
                    table={table as TanstackTableType<TData>}
                    fetchNextPage={fetchNextPage}
                    hasNextPage={hasNextPage}
                    isFetchingNextPage={isFetchingNextPage}
                />
            )}
        </div>
    );
}