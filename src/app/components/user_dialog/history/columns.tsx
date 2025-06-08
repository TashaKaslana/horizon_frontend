'use client'

import {ColumnDef} from "@tanstack/react-table";
import {DataTableColumnHeader} from "@/components/common/data-table-components";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {Button} from "@/components/ui/button";
import {MoreHorizontal} from "lucide-react";
import {ActivityPart, History} from "@/types/History";
import Link from "next/link";
import {useRouter} from "next/navigation";

export const historyColumns: ColumnDef<History>[] = [
    {
        id: "activity",
        header: ({column}) => (
            <DataTableColumnHeader column={column} title={'Activity'}/>
        ),
        cell: ({row}) => {
            return <div className="flex flex-wrap gap-1 items-center">{renderParts(row.original.parts)}</div>;
        }
    },
    {
        id: "createdAt",
        header: ({column}) => (
            <DataTableColumnHeader column={column} title={'Happened At'}/>
        ),
        accessorFn: (row) => new Date(row.createdAt).toLocaleString(),
    },
    {
        id: "actions",
        header: ({column}) => (
            <DataTableColumnHeader column={column} title={'Actions'}/>
        ),
        cell: ({row}) => {
            const history = row.original;
            return <Action history={history}/>;
        },
        enableHiding: false,
        enableSorting: false,
    },
];

const Action = ({history}: { history: History }) => {
    const router = useRouter();

    const targetPart = history.parts.find(
        (part): part is Extract<ActivityPart, { type: 'object' }> => part.type === 'object'
    );

    const handleViewTargetPlace = () => {
        if (targetPart) {
            const path = switchLink(targetPart);
            router.push(path);
        }
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">Open menu</span>
                    <MoreHorizontal className="h-4 w-4"/>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem
                    onClick={() => navigator.clipboard.writeText(history.id)}
                >
                    Copy ID
                </DropdownMenuItem>
                <DropdownMenuSeparator/>
                {targetPart && <DropdownMenuItem onClick={handleViewTargetPlace}>View target place</DropdownMenuItem>}
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
                <Link key={idx} href={switchLink(part)}>
                    <span className="font-medium text-blue-600 hover:underline">
                        {part.label}
                    </span>
                </Link>
            );
        }


        return null;
    });
};


const switchLink = (part: Extract<ActivityPart, { type: 'object' }>) => {
    switch (part.entity) {
        case 'user':
            return `/users/${part.id}/overview`;
        case 'post':
            return `/foryou/${part.id}`;
        case 'comment':
            return `/foryou/comments/${part.id}`;

        default:
            return '#';
    }
};