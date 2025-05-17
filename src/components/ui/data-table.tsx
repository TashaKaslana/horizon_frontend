// Your existing DataTable.tsx
"use client"

import {
    ColumnDef, ColumnFiltersState,
    flexRender,
    getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, SortingState,
    useReactTable,
    RowData, // Import RowData
    Table as TanstackTable, Row, // Alias to avoid conflict
} from "@tanstack/react-table"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    DataTablePagination,
    DataTableViewOptions,
    // Assuming DataTableColumnHeader is also here or imported elsewhere
} from "@/components/common/data-table-components"; // Your existing file for these
import {DndTableContext, DraggableRow} from "@/components/common/dnd-table-components"; // New DND components
import React from "react";
import {Input} from "@/components/ui/input";
import {Spinner} from "@/components/ui/spinner";
import type {UniqueIdentifier, DragEndEvent} from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
// For DND types

// Define a base type for data that supports DND
export type DraggableItem = RowData & {
    id: UniqueIdentifier;
};

interface DataTableProps<TData extends RowData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    setData?: React.Dispatch<React.SetStateAction<TData[]>>; // For DND reordering
    fetchNextPage?: () => void;
    hasNextPage?: boolean;
    isLoading?: boolean;
    isFetchingNextPage?: boolean; // More specific loading state for infinite scroll
    totalPageCount?: number; // Tanstack table computes this if pagination is client-side
    enableDnd?: boolean; // New prop to enable drag and drop
    onDragEnd?: (event: DragEndEvent, currentData: TData[]) => TData[]; // Custom drag end logic that returns new data array
    filterPlaceholder?: string;
    initialSort?: SortingState;
    // Add other TanStack Table options you want to expose as props
    enableRowSelection?: boolean | ((row: Row<TData>) => boolean);
}

export function DataTable<TData extends DraggableItem, TValue>({
                                                                   columns,
                                                                   data,
                                                                   setData, // Required if enableDnd is true and onDragEnd is not custom
                                                                   fetchNextPage,
                                                                   hasNextPage,
                                                                   isLoading,
                                                                   isFetchingNextPage,
                                                                   enableDnd = false,
                                                                   onDragEnd: customOnDragEnd,
                                                                   filterPlaceholder = "Search...",
                                                                   initialSort = [],
                                                                   enableRowSelection = false,
                                                               }: DataTableProps<TData, TValue>) {
    const [sorting, setSorting] = React.useState<SortingState>(initialSort);
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
    const [globalFilter, setGlobalFilter] = React.useState("");
    const [rowSelection, setRowSelection] = React.useState({});

    // Memoize data if it's not managed by an external setData
    // This is important if `data` prop changes frequently from parent
    const memoizedData = React.useMemo(() => data, [data]);

    const table = useReactTable({
        data: memoizedData,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        onColumnFiltersChange: setColumnFilters,
        getFilteredRowModel: getFilteredRowModel(),
        onGlobalFilterChange: setGlobalFilter, // Ensure this is set if using global filter
        onRowSelectionChange: enableRowSelection ? setRowSelection : undefined,
        state: {
            sorting,
            columnFilters,
            globalFilter,
            rowSelection: enableRowSelection ? rowSelection : {},
        },
        globalFilterFn: (row, columnId, filterValue) => {
            const cellValue = row.getValue(columnId);
            return String(cellValue).toLowerCase().includes(filterValue.toLowerCase());
        },
        enableRowSelection, // Pass this to the table instance
        getRowId: enableDnd || enableRowSelection ? (row: any) => row.id?.toString() : undefined, // Required for DND and stable row selection
    });

    const handleDragEnd = (event: DragEndEvent) => {
        if (!setData && !customOnDragEnd) {
            console.warn("DataTable: setData or onDragEnd prop is required for DND functionality.");
            return;
        }
        if (customOnDragEnd) {
            // Caller handles data update
            const reorderedData = customOnDragEnd(event, memoizedData as TData[]);
            if (setData && reorderedData) setData(reorderedData); // Optionally allow customOnDragEnd to update via setData too
        } else if (setData && (memoizedData[0] as DraggableItem)?.id !== undefined) {
            // Default arrayMove logic
            const {active, over} = event;
            if (active && over && active.id !== over.id) {
                setData((currentData) => {
                    // Ensure currentData is treated as DraggableItem[] for id access
                    const oldIndex = currentData.findIndex(item => item.id === active.id);
                    const newIndex = currentData.findIndex(item => item.id === over.id);
                    if (oldIndex === -1 || newIndex === -1) return currentData;

                    return arrayMove(currentData, oldIndex, newIndex);
                });
            }
        }
    };


    const tableContent = (
        <Table>
            <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id}>
                        {headerGroup.headers.map((header) => (
                            <TableHead key={header.id}
                                       style={{width: header.getSize() !== 150 ? header.getSize() : undefined}}>
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
                {isLoading && !isFetchingNextPage ? ( // Show main loader only if not fetching next page
                    <TableRow>
                        <TableCell colSpan={columns.length} className="h-24 text-center">
                            <Spinner/>
                        </TableCell>
                    </TableRow>
                ) : table.getRowModel().rows?.length ? (
                    table.getRowModel().rows.map((row) =>
                        enableDnd ? (
                            <DraggableRow key={row.original.id} row={row as Row<TData>}/>
                        ) : (
                            <TableRow
                                key={row.id}
                                data-state={row.getIsSelected() && "selected"}
                            >
                                {row.getVisibleCells().map((cell) => (
                                    <TableCell key={cell.id}
                                               style={{width: cell.column.getSize() !== 150 ? cell.column.getSize() : undefined}}>
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </TableCell>
                                ))}
                            </TableRow>
                        )
                    )
                ) : !isLoading ? ( // Only show "No results" if not loading
                    <TableRow>
                        <TableCell colSpan={columns.length} className="h-24 text-center">
                            No results.
                        </TableCell>
                    </TableRow>
                ) : null}
                {isFetchingNextPage && ( // Loader for infinite scroll
                    <TableRow>
                        <TableCell colSpan={columns.length} className="h-12 text-center">
                            <Spinner size="small"/>
                        </TableCell>
                    </TableRow>
                )}
            </TableBody>
        </Table>
    );

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <Input
                    placeholder={filterPlaceholder}
                    value={globalFilter ?? ""}
                    onChange={(event) => setGlobalFilter(event.target.value)}
                    className="h-8 w-[150px] lg:w-[250px]"
                />
                <DataTableViewOptions table={table as TanstackTable<TData>}/>
            </div>
            <div className="rounded-md border">
                {enableDnd ? (
                    <DndTableContext items={memoizedData} onDragEnd={handleDragEnd}>
                        {tableContent}
                    </DndTableContext>
                ) : (
                    tableContent
                )}
            </div>
            <div>
                <DataTablePagination
                    table={table as TanstackTable<TData>}
                    fetchNextPage={fetchNextPage}
                    hasNextPage={hasNextPage}
                />
            </div>
        </div>
    );
}