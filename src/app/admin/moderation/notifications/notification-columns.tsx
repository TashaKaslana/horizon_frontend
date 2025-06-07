"use client";

import {ColumnDef} from "@tanstack/react-table";
import {Checkbox} from "@/components/ui/checkbox";
import {DataTableColumnHeader} from "@/components/common/data-table-components";
import {formatDateTS} from "@/lib/utils";
import {MoreVerticalIcon, EyeIcon, MailCheckIcon, MailWarningIcon} from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import {Button} from "@/components/ui/button";
import {toast} from "sonner";
import {Badge} from "@/components/ui/badge";
import {Tooltip, TooltipContent, TooltipTrigger} from "@/components/ui/tooltip";
import {AdminNotificationDto} from "@/api/client";
import {useTranslations} from "next-intl";

export const useNotificationColumns = () => {
    const t = useTranslations("Admin.moderation.notifications.table");
    const statusT = useTranslations("Admin.moderation.notifications.status");

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
                    aria-label={t("selectAll")}
                    className="translate-y-[2px]"
                />
            ),
            cell: ({row}) => (
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
            accessorKey: "title",
            header: ({column}) => (
                <DataTableColumnHeader column={column} title={t("title") || "Title"}/>
            ),
            cell: ({row}) => {
                return (
                    <Tooltip delayDuration={500}>
                        <TooltipTrigger>
                            <div className="flex space-x-2">
                              <span className="max-w-[200px] truncate font-medium">
                                {row.getValue("title")}
                              </span>
                            </div>
                        </TooltipTrigger>
                        <TooltipContent className={'bg-muted text-muted-foreground border'}
                                        arrowClass={'bg-muted fill-muted'}>
                            {row.getValue("title")}
                        </TooltipContent>
                    </Tooltip>
                );
            },
            enableSorting: true,
        },
        {
            accessorKey: "message",
            header: ({column}) => (
                <DataTableColumnHeader column={column} title={t("content") || "Message"}/>
            ),
            cell: ({row}) => {
                return (
                    <Tooltip delayDuration={500}>
                        <TooltipTrigger>
                            <div className="max-w-[300px] truncate">
                                {row.getValue("message")}
                            </div>
                        </TooltipTrigger>
                        <TooltipContent className={'bg-muted text-muted-foreground border'}
                                        arrowClass={'bg-muted fill-muted'}>
                            {row.getValue("message")}
                        </TooltipContent>
                    </Tooltip>
                );
            },
            enableSorting: true,
        },
        {
            accessorKey: "type",
            header: ({column}) => (
                <DataTableColumnHeader column={column} title={t("type") || "Type"}/>
            ),
            cell: ({row}) => {
                const type = row.getValue("type") as string;
                return <Badge variant="outline">{type}</Badge>;
            },
            enableSorting: true,
            filterFn: (row, id, value) => {
                return value.includes(row.getValue(id));
            },
        },
        {
            accessorKey: "severity",
            header: ({column}) => (
                <DataTableColumnHeader column={column} title={t("severity") || "Severity"}/>
            ),
            cell: ({row}) => {
                const severity = row.getValue("severity") as string;
                let badgeVariant: "default" | "destructive" | "outline" | "secondary";
                switch (severity) {
                    case "CRITICAL":
                        badgeVariant = "destructive";
                        break;
                    case "WARNING":
                        badgeVariant = "destructive";
                        break;
                    case "INFO":
                        badgeVariant = "secondary";
                        break;
                    default:
                        badgeVariant = "outline";
                        break;
                }
                return <Badge variant={badgeVariant} className="capitalize">{severity}</Badge>;
            },
            enableSorting: true,
            filterFn: (row, id, value) => {
                return value.includes(row.getValue(id));
            },
        },
        {
            accessorKey: "isRead",
            header: ({column}) => (
                <DataTableColumnHeader column={column} title={t("isRead") || "Is Read"}/>
            ),
            cell: ({row}) => {
                const isRead = row.getValue("isRead") as boolean;
                return isRead ?
                    <Badge variant="secondary">{statusT("read")}</Badge> :
                    <Badge variant="outline">{statusT("unread")}</Badge>;
            },
            enableSorting: true,
            filterFn: (row, id, value) => {
                return value.includes(row.getValue(id));
            },
        },
        {
            accessorKey: "source",
            header: ({column}) => (
                <DataTableColumnHeader column={column} title={t("source") || "Source"}/>
            ),
            cell: ({row}) => {
                const source = row.getValue("source") as string | undefined;
                return <div className="min-w-[100px] truncate">{source || "System"}</div>;
            },
            enableSorting: true,
        },
        {
            accessorKey: "created_at",
            header: ({column}) => (
                <DataTableColumnHeader column={column} title={t("createdAt") || "Timestamp"}/>
            ),
            cell: ({row}) => {
                const dateValue = row.original.createdAt;
                const formattedDate = dateValue ? formatDateTS(dateValue) : "N/A";
                return <div className="min-w-[100px]">{formattedDate}</div>;
            },
            enableSorting: true,
        },
        {
            id: "actions",
            header: () => <div className="text-right">{t("actions")}</div>,
            cell: ({row}) => {
                const notification = row.original;

                const handleView = () => {
                    toast.info(`Viewing notification: ${notification.message} (ID: ${notification.id})`);
                    // Implement view logic, e.g., open a modal or navigate
                };

                const handleToggleRead = () => {
                    toast.info(`Toggling read status for: ${notification.message}`);
                    // Implement toggle read status logic
                };

                return (
                    <div className="flex justify-end">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="flex size-8 p-0 data-[state=open]:bg-muted">
                                    <MoreVerticalIcon className="size-4"/>
                                    <span className="sr-only">{t("openMenu") || "Open menu"}</span>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-[160px]">
                                <DropdownMenuItem onSelect={handleView}>
                                    <EyeIcon className="mr-2 h-4 w-4"/>
                                    {t("viewDetails") || "View Details"}
                                </DropdownMenuItem>
                                <DropdownMenuSeparator/>
                                <DropdownMenuItem onSelect={handleToggleRead}>
                                    {notification.isRead ?
                                        <MailWarningIcon className="mr-2 h-4 w-4"/> :
                                        <MailCheckIcon className="mr-2 h-4 w-4"/>}
                                    {notification.isRead ?
                                        (t("markAsUnread") || "Mark as Unread") :
                                        (t("markAsRead") || "Mark as Read")}
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                );
            },
            enableSorting: false,
            enableHiding: false,
        },
    ] as ColumnDef<AdminNotificationDto>[];
};
