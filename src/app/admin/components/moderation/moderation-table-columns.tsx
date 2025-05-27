"use client";

import React from "react";
import {ColumnDef} from "@tanstack/react-table";
import {toast} from "sonner";
import {
    CheckCircle2Icon,
    LoaderIcon,
    MoreVerticalIcon,
    Trash2Icon,
    ShieldQuestionIcon,
    FileTextIcon,
    MessageSquareIcon,
    UserIcon,
    AlertTriangleIcon,
    BanIcon,
    ShieldCheckIcon,
    ShieldXIcon,
    Edit3Icon
} from "lucide-react";

import {Badge} from "@/components/ui/badge";
import {Button} from "@/components/ui/button";
import {Checkbox} from "@/components/ui/checkbox";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {DataTableColumnHeader} from "@/components/common/data-table-components";
import {DraggableItem, DragHandleCell} from "@/components/common/dnd-table-components";
import {PostDetailViewerSheet} from '../../posts/all/post-detail-viewer-sheet';
import {CommentDetailViewerSheet} from '../../comments/all/comment-detail-viewer-sheet';
import {UserTableCellViewer} from '../../users/all/components/user-table-cell-viewer';
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {ModerationStatus, ModerationStatusSchema} from "@/schemas/report-schema";
import {ReportDto} from "@/api/client";

interface ModerationTableColumnsProps {
    onUpdateStatusAction: (itemIds: string[], newStatus: ModerationStatus) => void;
    onDeleteEntriesAction: (itemIds: string[]) => void;
}

type ModerationItemData = ReportDto & DraggableItem

export const statusFilterOptions = ModerationStatusSchema.options.map(status => ({
    value: status,
    label: status.replace(/_/g, ' '),
    icon: (() => {
        switch (status.toUpperCase()) {
            case "PENDING":
                return LoaderIcon;
            case "REVIEWED_APPROVED":
                return ShieldCheckIcon;
            case "REVIEWED_REJECTED":
                return ShieldXIcon;
            case "ACTIONTAKEN_CONTENTREMOVED":
            case "ACTIONTAKEN_USERWARNED":
            case "ACTIONTAKEN_USERBANNED":
                return AlertTriangleIcon;
            case "RESOLVED":
                return CheckCircle2Icon;
            default:
                return ShieldQuestionIcon;
        }
    })()
}));

export const getModerationTableColumns = ({
                                              onUpdateStatusAction,
                                              onDeleteEntriesAction,
                                          }: ModerationTableColumnsProps): ColumnDef<ModerationItemData>[] => [
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
                checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                aria-label="Select all" onClick={(e) => e.stopPropagation()}
            />
        ),
        cell: ({row}) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Select row" onClick={(e) => e.stopPropagation()}
            />
        ),
        enableSorting: false, enableHiding: false, size: 40,
    },
    {
        accessorKey: "id",
        header: ({column}) => <DataTableColumnHeader column={column} title="Report ID"/>,
        cell: ({row}) => (
            <div className="text-sm text-muted-foreground max-w-32 truncate" title={row.original.id}>
                {row.original.id}
            </div>
        ),
        enableHiding: false,
        enableSorting: false,
    },
    {
        accessorKey: "itemPreview",
        header: ({column}) => <DataTableColumnHeader column={column} title="Reported Item"/>,
        cell: ({row}) => {
            const item = row.original;
            let icon = <ShieldQuestionIcon className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0"/>;
            if (item.itemType === "POST") icon =
                <FileTextIcon className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0"/>;
            if (item.itemType === "COMMENT") icon =
                <MessageSquareIcon className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0"/>;
            if (item.itemType === "USER") icon =
                <UserIcon className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0"/>;

            const contentPreview = (content: string) => (
                <div className="flex flex-col">
                    <span className="font-medium text-sm group-hover:underline">{content}</span>
                </div>
            );

            const wrapperClass = "flex items-start gap-2 py-1 min-w-32 max-w-54 group cursor-pointer truncate";

            if (item.itemType === "POST" && item.post) {
                return (
                    <PostDetailViewerSheet
                        postId={item.post.id!}
                        onUpdateAction={(updatedPost) => {
                            console.log("Post update from sheet (moderation table):", updatedPost);
                            toast.info("Post details updated (mock).");
                        }}
                    >
                        <div className={wrapperClass}>
                            {icon} {contentPreview(item.post.caption!)}
                        </div>
                    </PostDetailViewerSheet>
                );
            }
            if (item.itemType === "COMMENT" && item.comment) {
                return (
                    <CommentDetailViewerSheet commentId={item.comment.id!}>
                        <div className={wrapperClass}>
                            {icon} {contentPreview(item.comment.content!)}
                        </div>
                    </CommentDetailViewerSheet>
                );
            }
            if (item.itemType === "USER" && item.reportedUser!) {
                return (
                    <div className="flex items-center gap-1 py-0.5 min-w-[200px]">
                        <Avatar className="h-9 w-9 flex-shrink-0">
                            <AvatarImage src={item.reportedUser.profileImage}
                                         alt={item.reportedUser.displayName
                                             ? item.reportedUser.displayName : item.reportedUser?.username?.[0] || "?"}
                            />
                            <AvatarFallback>
                                {item.reportedUser.displayName ?
                                    item.reportedUser?.displayName?.split(' ').map(n => n[0]).join('').toUpperCase()
                                    : item.reportedUser?.username?.[0]?.toUpperCase() || "?"}
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col gap-1">
                            <UserTableCellViewer userId={item.reportedUser.id!}
                                                 initialDisplayName={item.reportedUser.displayName!}/>
                            <span className="text-xs text-muted-foreground italic">@{item.reportedUser.username}</span>
                        </div>
                    </div>
                );
            }
        },
        enableHiding: false,
    },
    {
        accessorKey: "reporterInfo",
        header: ({column}) => <DataTableColumnHeader column={column} title="Reporter"/>,
        cell: ({row}) => {
            const item = row.original;
            return (
                <div className="flex items-center gap-1 py-0.5 min-w-[200px]">
                    <Avatar className="h-9 w-9 flex-shrink-0">
                        <AvatarImage src={item.reportedUser?.profileImage}
                                     alt={item.reportedUser?.displayName
                                         ? item.reportedUser?.displayName : item.reportedUser?.username?.[0] || "?"}
                        />
                        <AvatarFallback>
                            {item.reportedUser?.displayName ?
                                item.reportedUser?.displayName?.split(' ').map(n => n[0]).join('').toUpperCase()
                                : item.reportedUser?.username?.[0]?.toUpperCase() || "?"}
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col gap-1">
                        <UserTableCellViewer userId={item.reportedUser?.id}
                                             initialDisplayName={item.reportedUser?.displayName}/>
                        <span className="text-xs text-muted-foreground italic">@{item.reportedUser?.username}</span>
                    </div>
                </div>
            )
        },
    },
    {
        accessorKey: "reason",
        header: ({column}) => <DataTableColumnHeader column={column} title="Reason"/>,
        cell: ({row}) => <div className="text-sm text-muted-foreground max-w-64 truncate"
                              title={row.original.reason}>{row.original.reason}</div>,
    },
    {
        accessorKey: "status",
        header: ({column}) => <DataTableColumnHeader column={column} title="Status"/>,
        cell: ({row}) => {
            const status = row.original.status;
            const option = statusFilterOptions.find(opt => opt.value === status); // Ensure statusFilterOptions is imported/available
            return (
                <Badge variant={
                    !status ? "secondary" :
                        status === "REVIEWED_REJECTED" || status.includes("BANNED") || status.includes("REMOVED") ? "destructive" :
                            status.includes("APPROVED") || status.includes("RESOLVED") ? "default" :
                                status.includes("PENDING") ? "outline" : "secondary"
                } className="flex w-fit items-center gap-1.5 px-2 py-1 text-xs min-w-[120px] justify-center">
                    {option?.icon &&
                        <option.icon className={`size-3.5 ${option.icon === LoaderIcon ? 'animate-spin' : ''}`}/>}
                    {option?.label || status}
                </Badge>
            );
        },
        filterFn: (row, columnId, filterValue: string[] | undefined) => {
            if (!filterValue || filterValue.length === 0) return true;
            const cellValue = row.getValue(columnId) as string;
            return filterValue.includes(cellValue);
        },
    },
    {
        accessorKey: "createdAt",
        header: ({column}) => <DataTableColumnHeader column={column} title="Reported On"/>,
        cell: ({row}) => (
            <div className="text-xs text-muted-foreground min-w-[90px]">
                {row.original.createdAt ? new Date(row.original.createdAt).toLocaleDateString() : ""}
                <div className="text-gray-400">
                    {row.original.createdAt ? new Date(row.original.createdAt).toLocaleTimeString() : ""}
                </div>
            </div>
        ),
    },
    {
        id: "actions",
        cell: ({row}) => {
            const item = row.original;
            return (
                <div className="flex justify-end">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="flex size-8 p-0 data-[state=open]:bg-muted">
                                <MoreVerticalIcon className="size-4"/> <span className="sr-only">Open menu</span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-[220px]">
                            <DropdownMenuItem onSelect={() => toast.info(`Editing notes for ${item.id}`)}>
                                <Edit3Icon className="mr-2 h-4 w-4"/> Edit Moderation Notes
                            </DropdownMenuItem>
                            <DropdownMenuSeparator/>
                            {item.status !== "REVIEWED_APPROVED" && item.status !== "RESOLVED" && (
                                <DropdownMenuItem onSelect={() => onUpdateStatusAction([item.id], "REVIEWED_APPROVED")}>
                                    <ShieldCheckIcon className="mr-2 h-4 w-4 text-green-500"/> Approve Content
                                </DropdownMenuItem>
                            )}
                            {item.status !== "REVIEWED_REJECTED" && item.status !== "RESOLVED" && (
                                <DropdownMenuItem onSelect={() => onUpdateStatusAction([item.id], "REVIEWED_REJECTED")}>
                                    <ShieldXIcon className="mr-2 h-4 w-4 text-orange-500"/> Reject Content
                                </DropdownMenuItem>
                            )}
                            <DropdownMenuSeparator/>
                            {item.itemType === "USER" && item.status !== "ACTIONTAKEN_USERWARNED" && (
                                <DropdownMenuItem
                                    onSelect={() => onUpdateStatusAction([item.id], "ACTIONTAKEN_USERWARNED")}>
                                    <AlertTriangleIcon className="mr-2 h-4 w-4 text-amber-600"/> Warn User
                                </DropdownMenuItem>
                            )}
                            {item.itemType === "USER" && item.status !== "ACTIONTAKEN_USERBANNED" && (
                                <DropdownMenuItem className="text-red-600 focus:text-red-600"
                                                  onSelect={() => onUpdateStatusAction([item.id], "ACTIONTAKEN_USERBANNED")}>
                                    <BanIcon className="mr-2 h-4 w-4"/> Ban User
                                </DropdownMenuItem>
                            )}
                            {(item.itemType === "POST" || item.itemType === "COMMENT") && item.status !== "ACTIONTAKEN_CONTENTREMOVED" && (
                                <DropdownMenuItem className="text-red-600 focus:text-red-600"
                                                  onSelect={() => onUpdateStatusAction([item.id], "ACTIONTAKEN_CONTENTREMOVED")}>
                                    <Trash2Icon className="mr-2 h-4 w-4"/> Remove Content
                                </DropdownMenuItem>
                            )}
                            {item.status !== "RESOLVED" && <DropdownMenuSeparator/>}
                            {item.status !== "RESOLVED" && (
                                <DropdownMenuItem onSelect={() => onUpdateStatusAction([item.id], "RESOLVED")}>
                                    <CheckCircle2Icon className="mr-2 h-4 w-4 text-blue-500"/> Mark as Resolved
                                </DropdownMenuItem>
                            )}
                            <DropdownMenuSeparator/>
                            <DropdownMenuItem className="text-red-600 hover:!text-red-600 focus:text-red-600"
                                              onSelect={() => onDeleteEntriesAction([item.id])}>
                                <Trash2Icon className="mr-2 h-4 w-4"/> Delete Report
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            );
        },
        size: 50, enableSorting: false, enableHiding: false,
    },
];
