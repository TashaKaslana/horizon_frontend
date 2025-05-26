"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTableColumnHeader } from "@/components/common/data-table-components";
import React from "react";
import { formatDateTS } from "@/lib/utils";
import { MoreVerticalIcon, EditIcon, TrashIcon, EyeIcon } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {RoleDto} from "@/api/client";
import {DraggableItem} from "@/components/common/dnd-table-components";

type RoleDraggable = RoleDto & DraggableItem

export const rolesColumns: ColumnDef<RoleDraggable>[] = [
    {
        id: "select",
        header: ({ table }) => (
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
        cell: ({ row }) => (
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
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Name" />
        ),
        cell: ({ row }) => {
            return (
                // Replace with a Detail Viewer Sheet if needed
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
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Slug" />
        ),
        cell: ({ row }) => {
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
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Description" />
        ),
        cell: ({ row }) => {
            const description = row.getValue("description") as string | undefined;
            return (
                <div className="max-w-[350px] truncate" title={description}>
                    {description || "N/A"}
                </div>
            );
        },
        enableSorting: true,
    },
    {
        accessorKey: "createdAt",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Created At" />
        ),
        cell: ({ row }) => {
            const dateValue = row.getValue("createdAt") as Date
            const formattedDate = dateValue ? formatDateTS(dateValue) : "N/A";
            return <div className="min-w-[150px]">{formattedDate}</div>;
        },
        enableSorting: true,
    },
    {
        id: "actions",
        header: () => <div className="text-right">Actions</div>,
        cell: ({ row }) => {
            const role = row.original;

            const handleViewDetails = () => {
                // Placeholder for viewing details, perhaps in a modal or sheet
                toast.info(`Viewing role: ${role.name}`, {
                    description: <pre className="max-h-60 overflow-y-auto bg-muted p-2 rounded-md">{JSON.stringify(role, null, 2)}</pre>
                });
            };

            const handleEdit = () => {
                // Placeholder for edit action
                // This would typically open an edit form/sheet
                toast.info(`Editing role: ${role.name} (ID: ${role.id})`);
            };

            const handleDelete = () => {
                // Placeholder for delete action
                // This would typically show a confirmation dialog
                toast.warning(`Attempting to delete role: ${role.name} (ID: ${role.id})`);
            };

            return (
                <div className="flex justify-end">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="flex size-8 p-0 data-[state=open]:bg-muted">
                                <MoreVerticalIcon className="size-4" />
                                <span className="sr-only">Open menu</span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-[160px]">
                            <DropdownMenuItem onSelect={handleViewDetails}>
                                <EyeIcon className="mr-2 h-4 w-4" />
                                View Details
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onSelect={handleEdit}>
                                <EditIcon className="mr-2 h-4 w-4" />
                                Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem onSelect={handleDelete} className="text-red-600 focus:text-red-600">
                                <TrashIcon className="mr-2 h-4 w-4" />
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

