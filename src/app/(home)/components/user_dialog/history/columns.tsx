'use client'

import {ColumnDef} from "@tanstack/react-table";
import {DataTableColumnHeader} from "@/components/common/data-table-components";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel, DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";

export type History = {
    id: string;
    type: 'watch' | 'comment' | 'like',
    references: string;
    createdAt: string;
}

export const historyColumns: ColumnDef<History>[] = [
    {
        header: ({column}) => (
            <DataTableColumnHeader column={column} title={'ID'}/>
        ),
        accessorKey: 'id'
    },
    {
        header: ({column}) => (
            <DataTableColumnHeader column={column} title={'Type'}/>
        ),
        accessorKey: 'type'
    },
    {
        header: ({column}) => (
            <DataTableColumnHeader column={column} title={'References'}/>
        ),
        accessorKey: 'references',
    },
    {
        id: "createdAt",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title={'Happened At'} />
        ),
        accessorFn: (row) => new Date(row.createdAt).toLocaleString(),
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const history = row.original
            return <Action history={history}/>
        },
    },
]

const Action = ({history} : {history: History}) => {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">Open menu</span>
                    <MoreHorizontal className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem
                    onClick={() => navigator.clipboard.writeText(history.id)}
                >
                    Copy ID
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>View target place</DropdownMenuItem>
                <DropdownMenuItem>View target details</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}