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
import type {DragEndEvent} from "@dnd-kit/core";
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

interface DataTableProps<TData extends DraggableItem, TValue> {
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
    onDragEnd?: (event: DragEndEvent, currentData: TData[]) => TData[];
    filterPlaceholder?: string;
    initialSort?: SortingState;
    initialColumnVisibility?: VisibilityState;
    meta?: TableMeta<TData>;
    showGlobalFilter?: boolean;
    showViewOptions?: boolean;
    showPagination?: boolean;
    globalFilterFn?: FilterFn<TData> | 'auto' | null;
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

export function DataTable<TData extends DraggableItem, TValue>({
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

    React.useEffect(() => {
        if (setRowSelectionFn) {
            const selectedRows = Object.keys(rowSelection)
                .flatMap(key => {
                    const found = data.find(item => item.id === key);
                    return found ? [found] : [];
                });

            setRowSelectionFn(selectedRows);
        }
    }, [rowSelection, data, setRowSelectionFn]);


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
        getRowId: (row: TData) => row.id.toString(),
        globalFilterFn: providedGlobalFilterFn === null ? undefined : providedGlobalFilterFn,

        manualPagination: isPaginationControlled,
        pageCount: isPaginationControlled ? pageCount : undefined,
    });

    const handleDragEnd = (event: DragEndEvent) => {
        if (!enableDnd) return;

        if (customOnDragEnd) {
            const reorderedData = customOnDragEnd(event, memoizedData);
            if (setData && reorderedData) setData(reorderedData);
        } else if (setData) {
            const {active, over} = event;
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
                    table.getRowModel().rows.map((row) =>
                        enableDnd ? (
                            <DraggableRow key={row.id} row={row as Row<TData>}/>
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
                    serverPageCount={controlledPageCount}
                />
            )}
        </div>
    );
}
