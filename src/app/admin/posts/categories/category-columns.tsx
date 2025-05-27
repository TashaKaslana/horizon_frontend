"use client";

import {ColumnDef} from "@tanstack/react-table";
import {Checkbox} from "@/components/ui/checkbox";
import {DataTableColumnHeader} from "@/components/common/data-table-components";
import {DragHandleCell} from "@/components/common/dnd-table-components";
import React from "react";
import {TagRowData} from "@/app/admin/posts/tags/types";
import {formatDateTS} from "@/lib/utils";
import {MoreVerticalIcon, EditIcon, TrashIcon} from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import {Button} from "@/components/ui/button";
import {toast} from "sonner";
import {CategoryDetailViewerSheet} from "@/app/admin/posts/categories/category-detail-viewer-sheet";

export const columns: ColumnDef<TagRowData>[] = [
    {
        id: "drag",
        header: () => null,
        cell: (props) => <DragHandleCell {...props} />,
        size: 40, enableSorting: false, enableHiding: false,
    },
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
        accessorKey: "id",
        header: ({column}) => (
            <DataTableColumnHeader column={column} title="ID"/>
        ),
        cell: ({row}) => {
            return (
                <div className="min-w-[100px] truncate">
                    {row.getValue("id")}
                </div>
            );
        },
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: "name",
        header: ({column}) => (
            <DataTableColumnHeader column={column} title="Name"/>
        ),
        cell: ({row}) => {
            return (
                <CategoryDetailViewerSheet tagInitialData={row.original}
                                      onUpdateAction={() => toast.info("Update not implemented")}
                >
                    <div className="flex space-x-2">
                      <span className="max-w-[300px] truncate font-medium hover:underline">
                        {row.getValue("name")}
                      </span>
                    </div>
                </CategoryDetailViewerSheet>
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
                <div className="max-w-[300px] truncate">
                    {row.getValue("slug")}
                </div>
            );
        },
        enableSorting: true,
    },
    {
        accessorKey: "postsCount",
        header: ({column}) => (
            <DataTableColumnHeader column={column} title="Category of Posts"/>
        ),
        cell: ({row}) => {
            return (
                <div className="text-center">
                    {row.getValue("postsCount")}
                </div>
            );
        },
        enableSorting: true,
    },
    {
        accessorKey: "createdBy",
        header: ({column}) => (
            <DataTableColumnHeader column={column} title="Created By"/>
        ),
        cell: ({row}) => {
            const createdById = row.getValue("createdBy") as string | undefined;
            if (createdById === '00000000-0000-0000-0000-000000000000') {
                return <div className="min-w-[100px] truncate">System</div>;
            }

            return <div className="min-w-[100px] truncate">{createdById || "N/A"}</div>;
        },
        enableSorting: true,
    },
    {
        accessorKey: "createdAt",
        header: ({column}) => (
            <DataTableColumnHeader column={column} title="Created At"/>
        ),
        cell: ({row}) => {
            const dateValue = row.getValue("createdAt") as string | undefined;
            const formattedDate = dateValue ? formatDateTS(new Date(dateValue)) : "N/A";
            return <div className="min-w-[100px]">{formattedDate}</div>;
        },
        enableSorting: true,
    },
    {
        id: "actions",
        header: () => <div className="text-right">Actions</div>,
        cell: ({row}) => {
            const category = row.original;

            const handleEdit = () => {
                toast.info(`Editing category: ${category.name} (ID: ${category.id})`);
            };

            const handleDelete = () => {
                toast.warning(`Attempting to delete category: ${category.name} (ID: ${category.id})`);
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
                            <DropdownMenuItem onSelect={handleEdit}>
                                <EditIcon className="mr-2 h-4 w-4"/>
                                Edit
                            </DropdownMenuItem>
                            <DropdownMenuSeparator/>
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
