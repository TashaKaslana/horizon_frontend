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
    PaginationState,
    OnChangeFn,
} from "@tanstack/react-table";
import type {DragEndEvent, UniqueIdentifier} from "@dnd-kit/core";
import {arrayMove} from "@dnd-kit/sortable";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {Input} from "@/components/ui/input";
import {Spinner} from "@/components/ui/spinner";
import {
    DataTablePagination,
    DataTableViewOptions,
} from "@/components/common/data-table-components";
import {
    DndTableContext,
    DraggableRow,
    DraggableItem,
} from "@/components/common/dnd-table-components";

// Interface for data items when DND is enabled.
// They must have an 'id' for dnd-kit.
type DataWithDndId = { id: UniqueIdentifier };

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    setData?: React.Dispatch<React.SetStateAction<TData[]>>;

    pageCount?: number;
    pagination?: PaginationState;
    onPaginationChange?: OnChangeFn<PaginationState>;

    fetchNextPage?: () => Promise<unknown>;
    hasNextPage?: boolean;
    isFetchingNextPage?: boolean;

    enableRowSelection?: boolean | ((row: Row<TData>) => boolean);
    setRowSelectionFn?: React.Dispatch<React.SetStateAction<TData[]>>;

    isLoading?: boolean;
    enableDnd?: boolean;
    onDragEnd?: (event: DragEndEvent, currentData: (TData & DataWithDndId)[]) => (TData & DataWithDndId)[];
    filterPlaceholder?: string;
    initialSort?: SortingState;
    initialColumnVisibility?: VisibilityState;
    meta?: TableMeta<TData>;
    showGlobalFilter?: boolean;
    showViewOptions?: boolean;
    showPagination?: boolean;
    globalFilterFn?: FilterFn<TData> | 'auto' | null;
    customGetRowId?: (originalRow: TData, index: number) => string;
}

const genericGlobalFilterFn: FilterFn<any> = (
    row: Row<any>,
    columnId: string,
    filterValue: string
): boolean => {
    const lowercasedFilterValue = filterValue.toLowerCase();

    for (const key in row.original) {
        if (Object.prototype.hasOwnProperty.call(row.original, key)) {
            const value = row.original[key];

            if ((typeof value === 'string' || typeof value === 'number') &&
                String(value).toLowerCase().includes(lowercasedFilterValue)) {
                return true;
            }
        }
    }
    return false;
};

export function DataTable<TData, TValue>({
                                                                   columns,
                                                                   data,
                                                                   setData,

                                                                   pageCount: controlledPageCount,
                                                                   pagination: controlledPagination,
                                                                   onPaginationChange: setControlledPagination,

                                                                   fetchNextPage,
                                                                   hasNextPage,
                                                                   isFetchingNextPage,

                                                                   enableRowSelection = false,
                                                                   setRowSelectionFn,


                                                                   isLoading,
                                                                   enableDnd = false,
                                                                   onDragEnd: customOnDragEnd,
                                                                   filterPlaceholder = "Search...",
                                                                   initialSort = [],
                                                                   initialColumnVisibility = {},
                                                                   meta,
                                                                   showGlobalFilter = true,
                                                                   showViewOptions = true,
                                                                   showPagination = true,
                                                                   globalFilterFn: providedGlobalFilterFn = genericGlobalFilterFn,
                                                                   customGetRowId,
                                                               }: DataTableProps<TData, TValue>) {
    const [sorting, setSorting] = React.useState<SortingState>(initialSort);
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
    const [globalFilter, setGlobalFilter] = React.useState("");
    const [rowSelection, setRowSelection] = React.useState({});
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>(initialColumnVisibility);

    const isPaginationControlled = !!setControlledPagination;

    const [internalPagination, setInternalPagination] = React.useState<PaginationState>({
        pageIndex: 0,
        pageSize: 10,
    });

    const pagination = isPaginationControlled ? controlledPagination! : internalPagination;
    const onPaginationChange = isPaginationControlled ? setControlledPagination : setInternalPagination;

    const pageCount = isPaginationControlled ? (controlledPageCount ?? -1) : -1;

    const memoizedData = React.useMemo(() => data, [data]);
    const memoizedColumns = React.useMemo(() => columns, [columns]);

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
            pagination,
        },
        enableRowSelection,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        onGlobalFilterChange: setGlobalFilter,
        onRowSelectionChange: enableRowSelection ? setRowSelection : undefined,
        onColumnVisibilityChange: setColumnVisibility,
        onPaginationChange: onPaginationChange,

        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getRowId: customGetRowId ?? ((originalRow: TData, index: number): string => {
            const idSource = originalRow as TData & { id?: UniqueIdentifier };
            if (idSource.id !== undefined && (typeof idSource.id === 'string')) {
                return String(idSource.id);
            }
            if (enableDnd) {
                console.error(`DataTable: When 'enableDnd' is true, data items must have an 'id' property (string or number) usable by 'getRowId', or a 'customGetRowId' must be provided that yields such an ID. Row at index ${index} is problematic.`);
                throw new Error(`DND Error: Item at index ${index} missing required 'id' for getRowId when DND enabled.`);
            }
            console.error(`DataTable: Row at index ${index} is missing an 'id' property for 'getRowId' and no 'customGetRowId' was provided. Table operations may fail.`);
            throw new Error(`Configuration Error: Item at index ${index} missing 'id' for getRowId and no 'customGetRowId' provided.`);
        }),
        globalFilterFn: providedGlobalFilterFn === null ? undefined : providedGlobalFilterFn,

        manualPagination: isPaginationControlled,
        pageCount: isPaginationControlled ? pageCount : undefined,
    });

    React.useEffect(() => {
        if (setRowSelectionFn) {
            const selectedRowOriginals = Object.keys(rowSelection)
                .map(rowId => {
                    const row = table.getRow(rowId);
                    return row ? row.original : undefined;
                })
                .filter(original => original !== undefined) as TData[];

            setRowSelectionFn(selectedRowOriginals);
        }
    }, [rowSelection, table, setRowSelectionFn]);

    const handleDragEnd = (event: DragEndEvent) => {
        if (!enableDnd) return;

        const currentDataForDnd = memoizedData as (TData & DataWithDndId)[];

        if (customOnDragEnd) {
            const reorderedData = customOnDragEnd(event, currentDataForDnd);
            if (setData && reorderedData) setData(reorderedData as TData[]);
        } else if (setData) {
            const {active, over} = event;
            if (active && over && active.id !== over.id) {
                setData((currentData) => {
                    const currentDataWithIds = currentData as (TData & DataWithDndId)[];
                    const oldIndex = currentDataWithIds.findIndex(item => item.id === active.id);
                    const newIndex = currentDataWithIds.findIndex(item => item.id === over.id);
                    if (oldIndex === -1 || newIndex === -1) {
                        console.warn("DataTable DND: Could not find items for reordering. Ensure 'id' properties are consistent.");
                        return currentData;
                    }
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
                            <TableHead key={header.id}
                                       style={{width: header.getSize() !== 150 ? header.getSize() : undefined}}
                                       colSpan={header.colSpan}>
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
                            <Spinner/>
                        </TableCell>
                    </TableRow>
                ) : table.getRowModel().rows?.length ? (
                    table.getRowModel().rows.map((row, rowIndex) => {
                        const originalItem = row.original as TData & { id?: UniqueIdentifier };

                        if (enableDnd && (originalItem.id === undefined || (typeof originalItem.id !== 'string' && typeof originalItem.id !== 'number'))) {
                            console.error("DataTable critical error: Attempting to render DraggableRow for an item missing a valid 'id'. This indicates an issue with getRowId configuration or data integrity for DND.");
                            return (
                                <TableRow key={`error-${row.id}-${rowIndex}`} data-state="error">
                                    <TableCell colSpan={memoizedColumns.length} className="h-12 text-center text-destructive">
                                        Error: Item missing ID for DND.
                                    </TableCell>
                                </TableRow>
                            );
                        }
                        return enableDnd ? (
                            <DraggableRow key={String(originalItem.id)} row={row as Row<TData & DraggableItem>}/>
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
                        );
                    })
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
                            <Spinner size="small"/>
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
                    ) : <div/>}
                    {showViewOptions && <DataTableViewOptions table={table as TanstackTableType<TData>}/>}
                </div>
            )}
            <div className="rounded-md border">
                {enableDnd && memoizedData.length > 0 ? (
                    <DndTableContext items={memoizedData as (TData & DraggableItem)[]} onDragEndAction={handleDragEnd}>
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
                    serverPageCount={controlledPageCount}
                />
            )}
        </div>
    );
}
