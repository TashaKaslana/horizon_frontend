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
import {ActivityPart, History} from "@/types/History";

export const historyColumns: ColumnDef<History>[] = [
    {
        header: ({column}) => (
            <DataTableColumnHeader column={column} title={'ID'}/>
        ),
        accessorKey: 'id'
    },
    {
        id: "activity",
        header: ({column}) => (
            <DataTableColumnHeader column={column} title={'Activity'} />
        ),
        cell: ({row}) => {
            return <div className="flex flex-wrap gap-1 items-center">{renderParts(row.original.parts)}</div>;
        }
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
            const history = row.original;
            return <Action history={history}/>;
        },
    },
];

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

const renderParts = (parts: ActivityPart[]) => {
    return parts.map((part, idx) => {
        if (part.type === 'text') {
            return <span key={idx}>{part.value}</span>;
        }

        if (part.type === 'object') {
            return (
                <span key={idx} className="font-medium text-blue-600">
          {part.label}
        </span>
            );
        }

        return null;
    });
};
