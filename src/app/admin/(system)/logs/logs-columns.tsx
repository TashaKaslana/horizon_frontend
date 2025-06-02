"use client";

import {ColumnDef} from "@tanstack/react-table";
import {DataTableColumnHeader} from "@/components/common/data-table-components";
import {formatDateTS} from "@/lib/utils";
import {Badge} from "@/components/ui/badge";
import {Checkbox} from "@/components/ui/checkbox";
import {Button} from "@/components/ui/button";
import {MoreVerticalIcon, EyeIcon} from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {toast} from "sonner";
import {LogDetailSheet} from "@/app/admin/(system)/logs/log-details-sheet";
import {useState} from "react";
import {LogEntryDto} from "@/api/client";

export const columns: ColumnDef<LogEntryDto>[] = [
    {
        id: "select",
        header: ({table}) => (
            <Checkbox
                checked={
                    table.getIsAllPageRowsSelected() ||
                    (table.getIsSomePageRowsSelected() && "indeterminate")
                }
                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                aria-label="Select all"
                className="translate-y-[2px]"
            />
        ),
        cell: ({row}) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Select row"
                className="translate-y-[2px]"
            />
        ),
        enableSorting: false,
        enableHiding: false,
        size: 40,
    },
    {
        accessorKey: "timestamp",
        header: ({column}) => (
            <DataTableColumnHeader column={column} title="Timestamp"/>
        ),
        cell: ({row}) => {
            const dateValue = row.getValue("timestamp") as string | undefined;
            const formattedDate = dateValue ? formatDateTS(new Date(dateValue)) : "N/A";
            return <div className="min-w-[120px]">{formattedDate}</div>;
        },
        enableSorting: true,
    },
    {
        accessorKey: "severity",
        header: ({column}) => (
            <DataTableColumnHeader column={column} title="Severity"/>
        ),
        cell: ({row}) => {
            const severity = row.original.severity;
            let badgeVariant: "default" | "destructive" | "outline" | "secondary";
            switch (severity?.toLowerCase()) {
                case "critical":
                    badgeVariant = "destructive";
                    break;
                case "error":
                    badgeVariant = "destructive";
                    break;
                case "warning":
                    badgeVariant = "secondary";
                    break;
                case "info":
                    badgeVariant = "outline";
                    break;
                default:
                    badgeVariant = "default";
            }
            return <Badge variant={badgeVariant}
                          className="capitalize min-w-[70px] flex justify-center">{severity}</Badge>;
        },
        enableSorting: true,
        filterFn: (row, id, value) => {
            return value.includes(row.getValue(id));
        },
    },
    {
        accessorKey: "message",
        header: ({column}) => (
            <DataTableColumnHeader column={column} title="Message"/>
        ),
        cell: ({row}) => {
            return (
                <div className="max-w-[400px] truncate" title={row.getValue("message")}>
                    {row.getValue("message")}
                </div>
            );
        },
        enableSorting: true,
    },
    {
        accessorKey: "source",
        header: ({column}) => (
            <DataTableColumnHeader column={column} title="Source"/>
        ),
        cell: ({row}) => {
            return <div className="min-w-[100px] max-w-[150px] truncate">{row.getValue("source")}</div>;
        },
        enableSorting: true,
    },
    {
        accessorKey: "userId",
        header: ({column}) => (
            <DataTableColumnHeader column={column} title="User ID"/>
        ),
        cell: ({row}) => {
            const userId = row.getValue("userId") as string | undefined;
            return <div className="min-w-[80px] max-w-[120px] truncate">{userId || "N/A"}</div>;
        },
        enableSorting: true,
    },
    {
        accessorKey: "context",
        header: "Context",
        cell: ({row}) => {
            const context = row.getValue("context") as object | undefined;
            if (!context || Object.keys(context).length === 0) {
                return <div className="text-center">-</div>;
            }
            return (
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toast.info("Context Details", {
                        description: <pre
                            className="max-h-60 overflow-y-auto bg-muted p-2 rounded-md">{JSON.stringify(context, null, 2)}</pre>
                    })}
                >
                    View
                </Button>
            );
        },
        enableSorting: false,
    },
    {
        id: "actions",
        header: () => <div className="text-right">Actions</div>,
        cell: ({ row }) => <ActionsCell log={row.original} />,
        enableSorting: false,
        enableHiding: false,
    }
];

function ActionsCell({ log }: { log: LogEntryDto }) {
    const [open, setOpen] = useState(false);

    return (
        <div className="flex justify-end">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant="ghost"
                        className="flex size-8 p-0 data-[state=open]:bg-muted"
                    >
                        <MoreVerticalIcon className="size-4" />
                        <span className="sr-only">Open menu</span>
                    </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end" className="w-[160px]">
                    <DropdownMenuItem asChild>
                        <button
                            className="flex items-center w-full"
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setOpen(true);
                            }}
                        >
                            <EyeIcon className="mr-2 h-4 w-4" />
                            View Full Log
                        </button>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <LogDetailSheet log={log} open={open} onOpenChangeAction={setOpen} />
        </div>
    );
}



