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
import {useTranslations} from "next-intl";

type RoleDraggable = RoleDto & DraggableItem

export const useRolesColumns = () => {
    const t = useTranslations("Admin.users.roles.table");
    const notificationsT = useTranslations("Admin.users.roles.notifications");

    return [
        {
            id: "select",
            header: ({ table }) => (
                <Checkbox
                    checked={
                        table.getIsAllPageRowsSelected() ||
                        (table.getIsSomePageRowsSelected() && "indeterminate")
                    }
                    onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                    aria-label={t("selectAll")}
                    className="translate-y-[2px]"
                />
            ),
            cell: ({ row }) => (
                <Checkbox
                    checked={row.getIsSelected()}
                    onCheckedChange={(value) => row.toggleSelected(!!value)}
                    aria-label={t("selectRow")}
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
                <DataTableColumnHeader column={column} title={t("name")} />
            ),
            cell: ({ row }) => {
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
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title={t("slug")} />
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
                <DataTableColumnHeader column={column} title={t("description")} />
            ),
            cell: ({ row }) => {
                const description = row.getValue("description") as string | undefined;
                return (
                    <div className="max-w-[350px] truncate" title={description}>
                        {description || t("noDescription")}
                    </div>
                );
            },
            enableSorting: true,
        },
        {
            accessorKey: "createdAt",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title={t("createdAt")} />
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
            header: () => <div className="text-right">{t("actions")}</div>,
            cell: ({ row }) => {
                const role = row.original;

                const handleViewDetails = () => {
                    toast.info(notificationsT("viewingRole", { name: role.name ?? '' }), {
                        description: <pre className="max-h-60 overflow-y-auto bg-muted p-2 rounded-md">{JSON.stringify(role, null, 2)}</pre>
                    });
                };

                const handleEdit = () => {
                    toast.info(notificationsT("editingRole", { name: role.name ?? '', id: role.id }));
                };

                const handleDelete = () => {
                    toast.warning(notificationsT("deleteAttempt", { name: role.name ?? '', id: role.id }));
                };

                return (
                    <div className="flex justify-end">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="flex size-8 p-0 data-[state=open]:bg-muted">
                                    <MoreVerticalIcon className="size-4" />
                                    <span className="sr-only">{t("openMenu")}</span>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-[160px]">
                                <DropdownMenuItem onClick={handleViewDetails}>
                                    <EyeIcon className="mr-2 h-4 w-4" />
                                    {t("viewRole")}
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={handleEdit}>
                                    <EditIcon className="mr-2 h-4 w-4" />
                                    {t("editRole")}
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={handleDelete}>
                                    <TrashIcon className="mr-2 h-4 w-4" />
                                    {t("deleteRole")}
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                );
            },
        },
    ] as ColumnDef<RoleDraggable>[];
};
