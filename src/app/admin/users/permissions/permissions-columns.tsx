"use client";

import {ColumnDef} from "@tanstack/react-table";
import {Checkbox} from "@/components/ui/checkbox";
import {DataTableColumnHeader} from "@/components/common/data-table-components";
import React from "react";
import {PermissionSummary} from "@/schemas/user-schema";
import {formatDateTS} from "@/lib/utils";
import {MoreVerticalIcon, EditIcon, TrashIcon, EyeIcon} from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import {Button} from "@/components/ui/button";
import {toast} from "sonner";
import {Tooltip, TooltipContent, TooltipTrigger} from "@/components/ui/tooltip";

export const permissionsColumns: ColumnDef<PermissionSummary>[] = [
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
        accessorKey: "name",
        header: ({column}) => (
            <DataTableColumnHeader column={column} title="Name"/>
        ),
        cell: ({row}) => {
            return (
                <div className="flex space-x-2">
                  <span className="max-w-[250px] truncate font-medium">
                    {row.getValue("name")}
                  </span>
                </div>
            );
        },
        enableSorting: true,
    },
    {
        accessorKey: "slug",
        header: ({column}) => (
            <DataTableColumnHeader column={column} title="Slug"/>
        ),
        cell: ({row}) => {
            return (
                <div className="max-w-[250px] truncate">
                    {row.getValue("slug")}
                </div>
            );
        },
        enableSorting: true,
    },
    {
        accessorKey: "description",
        header: ({column}) => (
            <DataTableColumnHeader column={column} title="Description"/>
        ),
        cell: ({row}) => {
            const description = row.getValue("description") as string | undefined;
            return (
                <Tooltip delayDuration={500}>
                    <TooltipTrigger>
                        <div className="flex space-x-2">
                            <div className="max-w-[300px] truncate" title={description}>
                                {description || "N/A"}
                            </div>
                        </div>
                    </TooltipTrigger>
                    <TooltipContent className={'bg-muted text-muted-foreground border'}
                                    arrowClass={'bg-muted fill-muted'}>
                        {description || "N/A"}
                    </TooltipContent>
                </Tooltip>
            );
        },
        enableSorting: true,
    },
    {
        accessorKey: "module",
        header: ({column}) => (
            <DataTableColumnHeader column={column} title="Module"/>
        ),
        cell: ({row}) => {
            return (
                <div className="max-w-[200px] truncate">
                    {row.getValue("module")}
                </div>
            );
        },
        enableSorting: true,
    },
    {
        accessorKey: "created_at",
        header: ({column}) => (
            <DataTableColumnHeader column={column} title="Created At"/>
        ),
        cell: ({row}) => {
            const dateValue = row.getValue("created_at") as string | undefined;
            const formattedDate = dateValue ? formatDateTS(new Date(dateValue)) : "N/A";
            return <div className="min-w-[150px]">{formattedDate}</div>;
        },
        enableSorting: true,
    },
    {
        id: "actions",
        header: () => <div className="text-right">Actions</div>,
        cell: ({row}) => {
            const permission = row.original;

            const handleViewDetails = () => {
                toast.info(`Viewing permission: ${permission.name}`, {
                    description: <pre
                        className="max-h-60 overflow-y-auto bg-muted p-2 rounded-md">{JSON.stringify(permission, null, 2)}</pre>
                });
            };

            const handleEdit = () => {
                toast.info(`Editing permission: ${permission.name} (ID: ${permission.id})`);
            };

            const handleDelete = () => {
                toast.warning(`Attempting to delete permission: ${permission.name} (ID: ${permission.id})`);
            };

            return (
                <div className="flex justify-end">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="flex size-8 p-0 data-[state=open]:bg-muted">
                                <MoreVerticalIcon className="size-4"/>
                                <span className="sr-only">Open menu</span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-[160px]">
                            <DropdownMenuItem onSelect={handleViewDetails}>
                                <EyeIcon className="mr-2 h-4 w-4"/>
                                View Details
                            </DropdownMenuItem>
                            <DropdownMenuSeparator/>
                            <DropdownMenuItem onSelect={handleEdit}>
                                <EditIcon className="mr-2 h-4 w-4"/>
                                Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem onSelect={handleDelete} className="text-red-600 focus:text-red-600">
                                <TrashIcon className="mr-2 h-4 w-4"/>
                                Delete
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            );
        },
        enableSorting: false,
        enableHiding: false,
    },
];

