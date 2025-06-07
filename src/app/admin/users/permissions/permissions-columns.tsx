"use client";

import {ColumnDef} from "@tanstack/react-table";
import {Checkbox} from "@/components/ui/checkbox";
import {DataTableColumnHeader} from "@/components/common/data-table-components";
import React from "react";
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
import {PermissionDto} from "@/api/client";
import {DraggableItem} from "@/components/common/dnd-table-components";
import {useTranslations} from "next-intl";

type PermissionDraggable = PermissionDto & DraggableItem;

export const useCreatePermissionsColumns = (): ColumnDef<PermissionDraggable>[] => {
    const t =  useTranslations("Admin.users.permissions");

    return [
        {
            id: "select",
            header: ({table}) => (
                <Checkbox
                    checked={
                        table.getIsAllPageRowsSelected() ||
                        (table.getIsSomePageRowsSelected() && "indeterminate")
                    }
                    onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                    aria-label={t("table.selectAll")}
                    className="translate-y-[2px]"
                />
            ),
            cell: ({row}) => (
                <Checkbox
                    checked={row.getIsSelected()}
                    onCheckedChange={(value) => row.toggleSelected(!!value)}
                    aria-label={t("table.selectRow")}
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
                <DataTableColumnHeader column={column} title={t("table.id")}/>
            ),
            cell: ({row}) => {
                return (
                    <div className="max-w-[100px] truncate">
                        {row.getValue("id")}
                    </div>
                );
            },
            enableSorting: true,
            enableHiding: true,
        },
        {
            accessorKey: "name",
            header: ({column}) => (
                <DataTableColumnHeader column={column} title={t("table.name")}/>
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
                <DataTableColumnHeader column={column} title={t("table.slug")}/>
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
                <DataTableColumnHeader column={column} title={t("table.description")}/>
            ),
            cell: ({row}) => {
                const description = row.getValue("description") as string | undefined;
                return (
                    <Tooltip delayDuration={500}>
                        <TooltipTrigger>
                            <div className="flex space-x-2">
                                <div className="max-w-[300px] truncate" title={description}>
                                    {description || t("table.noDescription")}
                                </div>
                            </div>
                        </TooltipTrigger>
                        <TooltipContent className={'bg-muted text-muted-foreground border'}
                                        arrowClass={'bg-muted fill-muted'}>
                            {description || t("table.noDescription")}
                        </TooltipContent>
                    </Tooltip>
                );
            },
            enableSorting: true,
        },
        {
            accessorKey: "module",
            header: ({column}) => (
                <DataTableColumnHeader column={column} title={t("table.module")}/>
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
            accessorKey: "createdAt",
            header: ({column}) => (
                <DataTableColumnHeader column={column} title={t("table.createdAt")}/>
            ),
            cell: ({row}) => {
                const dateValue = row.getValue("createdAt") as Date | undefined;
                const formattedDate = dateValue ? formatDateTS(dateValue) : t("table.noDescription");

                return <div className="min-w-[150px]">{formattedDate}</div>;
            },
            enableSorting: true,
        },
        {
            id: "actions",
            header: () => <div className="text-right">{t("table.actions")}</div>,
            cell: ({row}) => {
                const permission = row.original;

                const handleViewDetails = () => {
                    toast.info(t("notifications.permissionUpdated"), {
                        description:
                            <div className={'flex flex-1'}>
                                <pre
                                    className="max-h-60 overflow-y-auto bg-muted p-2 rounded-md break-words">{JSON.stringify(permission, null, 2)}</pre>
                            </div>
                    });
                };

                const handleEdit = () => {
                    toast.info(t("notifications.permissionUpdated"));
                };

                const handleDelete = () => {
                    toast.warning(t("notifications.permissionDeleted"));
                };

                return (
                    <div className="flex justify-end">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="flex size-8 p-0 data-[state=open]:bg-muted">
                                    <MoreVerticalIcon className="size-4"/>
                                    <span className="sr-only">{t("table.openMenu")}</span>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-[160px]">
                                <DropdownMenuItem onSelect={handleViewDetails}>
                                    <EyeIcon className="mr-2 h-4 w-4"/>
                                    {t("table.viewPermission")}
                                </DropdownMenuItem>
                                <DropdownMenuSeparator/>
                                <DropdownMenuItem onSelect={handleEdit}>
                                    <EditIcon className="mr-2 h-4 w-4"/>
                                    {t("table.editPermission")}
                                </DropdownMenuItem>
                                <DropdownMenuItem onSelect={handleDelete} className="text-red-600 focus:text-red-600">
                                    <TrashIcon className="mr-2 h-4 w-4"/>
                                    {t("table.deletePermission")}
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
};
