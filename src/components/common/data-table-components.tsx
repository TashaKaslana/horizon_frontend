"use client";

import React from "react";
import {useIsMounted} from "@/hooks/use-is-mounted";
import { Table as TanstackTable, Column } from "@tanstack/react-table";
import {
    ArrowDown,
    ArrowUp,
    ChevronsUpDown,
    EyeOff,
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight,
    Settings2,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface DataTableColumnHeaderProps<TData, TValue>
    extends React.HTMLAttributes<HTMLDivElement> {
    column: Column<TData, TValue>;
    title: string;
}

export function DataTableColumnHeader<TData, TValue>({
                                                         column,
                                                         title,
                                                         className,
                                                     }: DataTableColumnHeaderProps<TData, TValue>) {
    if (!column.getCanSort()) {
        return <div className={cn(className)}>{title}</div>;
    }

    return (
        <div className={cn("flex items-center space-x-2", className)}>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="-ml-3 h-8 data-[state=open]:bg-accent"
                    >
                        <span>{title}</span>
                        {column.getIsSorted() === "desc" ? (
                            <ArrowDown className="ml-2 h-4 w-4" />
                        ) : column.getIsSorted() === "asc" ? (
                            <ArrowUp className="ml-2 h-4 w-4" />
                        ) : (
                            <ChevronsUpDown className="ml-2 h-4 w-4" />
                        )}
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                    <DropdownMenuItem onClick={() => column.toggleSorting(false)}>
                        <ArrowUp className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
                        Asc
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => column.toggleSorting(true)}>
                        <ArrowDown className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
                        Desc
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    {column.getCanHide() && (
                        <DropdownMenuItem onClick={() => column.toggleVisibility(false)}>
                            <EyeOff className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
                            Hide
                        </DropdownMenuItem>
                    )}
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
}

interface DataTablePaginationProps<TData> {
    table: TanstackTable<TData>;
    fetchNextPage?: () => Promise<unknown>;
    hasNextPage?: boolean;
    isFetchingNextPage?: boolean;
    serverPageCount?: number;
}

export function DataTablePagination<TData>({
                                               table,
                                               fetchNextPage,
                                               hasNextPage,
                                               isFetchingNextPage,
                                               serverPageCount,
                                           }: DataTablePaginationProps<TData>) {
    const tableState = table.getState().pagination;
    const currentPageIndex = tableState.pageIndex;
    const clientSidePageCount = table.getPageCount();

    const isMounted = useIsMounted();

    const [isWaitingForDataToAdvance, setIsWaitingForDataToAdvance] = React.useState(false);

    const displayPageCount = (serverPageCount !== undefined && serverPageCount > 0) ? serverPageCount : (clientSidePageCount > 0 ? clientSidePageCount : 1);

    const handleNextPage = () => {
        if (table.getCanNextPage()) {
            table.nextPage();
            setIsWaitingForDataToAdvance(false);
        } else if (hasNextPage && fetchNextPage && !isFetchingNextPage) {
            fetchNextPage().then();
            setIsWaitingForDataToAdvance(true);
        }
    };

    React.useEffect(() => {
        if (isWaitingForDataToAdvance && !isFetchingNextPage) {
            const timerId = setTimeout(() => {
                if (!isMounted.current) return;
                if (table.getCanNextPage()) {
                    table.nextPage();
                }
                if (isMounted.current) {
                    setIsWaitingForDataToAdvance(false);
                }
            }, 0);

            return () => clearTimeout(timerId);
        }
    }, [isFetchingNextPage, table, isWaitingForDataToAdvance, isMounted]);

    const canGoToNextServerPage = hasNextPage || currentPageIndex < displayPageCount -1;

    return (
        <div className="flex items-center justify-between px-2 py-2">
            <div className="flex-1 text-sm text-muted-foreground">
                {table.getFilteredSelectedRowModel().rows.length} of{" "}
                {table.getFilteredRowModel().rows.length} row(s) selected.
            </div>
            <div className="flex items-center space-x-6 lg:space-x-8">
                <div className="flex items-center space-x-2">
                    <p className="text-sm font-medium">Rows per page</p>
                    <Select
                        value={`${table.getState().pagination.pageSize}`}
                        onValueChange={(value) => {
                            table.setPageSize(Number(value));
                        }}
                    >
                        <SelectTrigger className="h-8 w-[70px]">
                            <SelectValue placeholder={table.getState().pagination.pageSize} />
                        </SelectTrigger>
                        <SelectContent side="top">
                            {[10, 20, 30, 40, 50].map((pageSize) => (
                                <SelectItem key={pageSize} value={`${pageSize}`}>
                                    {pageSize}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="flex w-[100px] items-center justify-center text-sm font-medium">
                    Page {currentPageIndex + 1} of{" "}
                    {displayPageCount}
                </div>
                <div className="flex items-center space-x-2">
                    <Button
                        variant="outline"
                        className="hidden h-8 w-8 p-0 lg:flex"
                        onClick={() => table.setPageIndex(0)}
                        disabled={!table.getCanPreviousPage()}
                    >
                        <span className="sr-only">Go to first page</span>
                        <ChevronsLeft className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="outline"
                        className="h-8 w-8 p-0"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                    >
                        <span className="sr-only">Go to previous page</span>
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="outline"
                        className="h-8 w-8 p-0"
                        onClick={handleNextPage}
                        disabled={!canGoToNextServerPage || isFetchingNextPage}
                    >
                        <span className="sr-only">Go to next page</span>
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="outline"
                        className="hidden h-8 w-8 p-0 lg:flex"
                        onClick={() => table.setPageIndex(displayPageCount - 1)}

                        disabled={currentPageIndex >= displayPageCount - 1 || (!table.getCanNextPage() && !hasNextPage)}
                    >
                        <span className="sr-only">Go to last page</span>
                        <ChevronsRight className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </div>
    );
}

interface DataTableViewOptionsProps<TData> {
    table: TanstackTable<TData>;
}

export function DataTableViewOptions<TData>({
                                                table,
                                            }: DataTableViewOptionsProps<TData>) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="outline"
                    size="sm"
                    className="ml-auto hidden h-8 lg:flex"
                >
                    <Settings2 className="mr-2 h-4 w-4" />
                    View
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[150px]">
                <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {table
                    .getAllColumns()
                    .filter(
                        (column) =>
                            typeof column.accessorFn !== "undefined" && column.getCanHide()
                    )
                    .map((column) => {
                        // Helper to try and make IDs more readable
                        const friendlyName = column.id
                            .replace(/([A-Z0-9])/g, ' $1') // Add space before caps/numbers
                            .replace(/_/g, ' ')           // Replace underscores with spaces
                            .replace(/^./, str => str.toUpperCase()); // Capitalize first letter

                        return (
                            <DropdownMenuCheckboxItem
                                key={column.id}
                                className="capitalize" // May not be needed if friendlyName is good
                                checked={column.getIsVisible()}
                                onCheckedChange={(value) => column.toggleVisibility(value)}
                            >
                                {friendlyName}
                            </DropdownMenuCheckboxItem>
                        );
                    })}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

