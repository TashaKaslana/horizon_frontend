"use client";

import {ColumnDef} from "@tanstack/react-table";
import {Checkbox} from "@/components/ui/checkbox";
import {DataTableColumnHeader} from "@/components/common/data-table-components";
import React from "react";
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
import {PostCategoryWithCountDto} from "@/api/client";
import {useTranslations} from "next-intl";

export const useCategoriesColumns = (): ColumnDef<PostCategoryWithCountDto>[] => {
    const t =  useTranslations("Admin.posts.categories");

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
                <DataTableColumnHeader column={column} title={t("table.name")}/>
            ),
            cell: ({row}) => {
                const categoryId = row.getValue("id") as string;

                return (
                    <CategoryDetailViewerSheet categoryInitial={{...row.original,  id: categoryId}}
                                        onUpdateAction={() => toast.info(t("notifications.updateNotImplemented"))}
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
                <DataTableColumnHeader column={column} title={t("table.slug")}/>
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
            accessorKey: "postCount",
            header: ({column}) => (
                <DataTableColumnHeader column={column} title={t("table.postCount")}/>
            ),
            cell: ({row}) => {
                return (
                    <div className="text-center">
                        {row.getValue("postCount")}
                    </div>
                );
            },
            enableSorting: true,
        },
        {
            accessorKey: "createdBy",
            header: ({column}) => (
                <DataTableColumnHeader column={column} title={t("table.createdBy")}/>
            ),
            cell: ({row}) => {
                const createdById = row.getValue("createdBy") as string | undefined;
                if (createdById === '00000000-0000-0000-0000-000000000000') {
                    return <div className="min-w-[100px] truncate">{t("table.system")}</div>;
                }

                return <div className="min-w-[100px] truncate">{createdById || t("table.notAvailable")}</div>;
            },
            enableSorting: true,
        },
        {
            accessorKey: "createdAt",
            header: ({column}) => (
                <DataTableColumnHeader column={column} title={t("table.createdAt")}/>
            ),
            cell: ({row}) => {
                const dateValue = row.getValue("createdAt") as string | undefined;
                const formattedDate = dateValue ? formatDateTS(new Date(dateValue)) : t("table.notAvailable");
                return <div className="min-w-[100px]">{formattedDate}</div>;
            },
            enableSorting: true,
        },
        {
            id: "actions",
            header: () => <div className="text-right">{t("table.actions")}</div>,
            cell: ({row}) => {
                const category = row.original;

                const handleEdit = () => {
                    toast.info(t("notifications.editingCategory", { name: category.name ?? '', id: category.id! }));
                };

                const handleDelete = () => {
                    toast.warning(t("notifications.deletingCategory", { name: category.name ?? '', id: category.id! }));
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
                                <DropdownMenuItem onSelect={handleEdit}>
                                    <EditIcon className="mr-2 h-4 w-4"/>
                                    {t("table.edit")}
                                </DropdownMenuItem>
                                <DropdownMenuSeparator/>
                                <DropdownMenuItem onSelect={handleDelete} className="text-red-600 focus:text-red-600">
                                    <TrashIcon className="mr-2 h-4 w-4"/>
                                    {t("table.delete")}
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
