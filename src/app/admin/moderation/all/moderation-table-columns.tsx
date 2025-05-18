"use client";

import React from "react";
import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { toast } from "sonner";
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
    EyeIcon,
    BanIcon,
    ShieldCheckIcon,
    ShieldXIcon,
    Edit3Icon
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DataTableColumnHeader } from "@/components/common/data-table-components";
import { DragHandleCell } from "@/components/common/dnd-table-components";
import {
    ModerationItemData,
    ModerationStatus,
} from "./moderation-schema";
import { PostDetailViewerSheet } from '../../posts/all/post-detail-viewer-sheet';
import { CommentDetailViewerSheet } from '../../comments/all/comment-detail-viewer-sheet';
import { UserTableCellViewer } from '../../users/all/user-table-cell-viewer';
import { statusFilterOptions } from "./moderation-table-mock-data";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar"; // Assuming this is created/moved

interface ModerationTableColumnsProps {
    onUpdateStatusAction: (itemIds: string[], newStatus: ModerationStatus) => void;
    onDeleteEntriesAction: (itemIds: string[]) => void;
}

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
        header: ({ table }) => (
            <Checkbox
                checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                aria-label="Select all" onClick={(e) => e.stopPropagation()}
            />
        ),
        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Select row" onClick={(e) => e.stopPropagation()}
            />
        ),
        enableSorting: false, enableHiding: false, size: 40,
    },
    {
        accessorKey: "itemPreview",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Reported Item" />,
        cell: ({ row }) => {
            const item = row.original;
            let icon = <ShieldQuestionIcon className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />;
            if (item.itemType === "Post") icon = <FileTextIcon className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />;
            if (item.itemType === "Comment") icon = <MessageSquareIcon className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />;
            if (item.itemType === "User") icon = <UserIcon className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />;

            const contentPreview = (
                <div className="flex flex-col">
                    <span className="font-medium text-sm group-hover:underline">{item.itemPreview || item.itemId}</span>
                    {item.itemLink &&
                        <Link href={item.itemLink} target="_blank" rel="noopener noreferrer"
                              className="text-xs text-blue-500 hover:underline"
                              onClick={(e) => e.stopPropagation()}
                        >
                            View Original (ID: {item.itemId})
                        </Link>
                    }
                </div>
            );

            const wrapperClass = "flex items-start gap-2 py-1 min-w-32 max-w-54 group cursor-pointer truncate";

            if (item.itemType === "Post" && item.postDetails) {
                return (
                    <PostDetailViewerSheet
                        post={item.postDetails}
                        onUpdateAction={(updatedPost) => {
                            console.log("Post update from sheet (moderation table):", updatedPost);
                            toast.info("Post details updated (mock).");
                        }}
                    >
                        <div className={wrapperClass}>
                            {icon} {contentPreview}
                        </div>
                    </PostDetailViewerSheet>
                );
            }
            if (item.itemType === "Comment" && item.commentDetails) {
                return (
                    <CommentDetailViewerSheet comment={item.commentDetails}>
                         <div className={wrapperClass}>
                            {icon} {contentPreview}
                        </div>
                    </CommentDetailViewerSheet>
                );
            }
            if (item.itemType === "User" && item.userDetails) {
                return (
                     <div className={wrapperClass} onClick={() => toast.info('User details view TBD or click UserTableCellViewer if interactive')}>
                        {icon}
                        <UserTableCellViewer item={item.userDetails} onUpdate={() => {}} />
                    </div>
                );
            }

            return (
                <div className={wrapperClass} onClick={() => item.itemLink && window.open(item.itemLink, '_blank')}>
                    {icon} {contentPreview}
                </div>
            );
        },
        enableHiding: false,
    },
    {
        accessorKey: "reporterInfo",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Reporter" />,
        cell: ({ row }) => {
            const item = row.original;

            const user = { id: 15, name: "Olivia Benson", username: "oliviab", email: "olivia@example.com", type: "Viewer", status: "Active", createdAt: "2024-03-01T19:00:00Z", lastLogin: "2024-03-09T19:00:00Z" }

            return (
                <div className="flex items-center gap-2 py-0.5 min-w-[200px]">
                    <Avatar className="h-9 w-9 flex-shrink-0">
                        <AvatarImage src={item.userDetails?.profileImage} alt={item.userDetails?.name}/>
                        <AvatarFallback>{item.userDetails?.name?.split(' ').map(n => n[0]).join('').toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col gap-0.5">
                        <UserTableCellViewer
                            item={user}
                            onUpdate={() => {
                                toast.info("Author details are managed in the Users section.");
                            }}
                        />
                        <span className="text-xs text-muted-foreground">ID: {item.userDetails?.id}</span>
                    </div>
                </div>
            )
        },
    },
    {
        accessorKey: "reason",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Reason" />,
        cell: ({ row }) => <div className="text-sm text-muted-foreground max-w-64 truncate" title={row.original.reason}>{row.original.reason}</div>,
    },
    {
        accessorKey: "status",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
        cell: ({ row }) => {
            const status = row.original.status;
            const option = statusFilterOptions.find(opt => opt.value === status); // Ensure statusFilterOptions is imported/available
            return (
                <Badge variant={
                    status.includes("Rejected") || status.includes("Banned") || status.includes("Removed") ? "destructive" :
                        status.includes("Approved") || status.includes("Resolved") ? "default" :
                            status.includes("Pending") ? "outline" : "secondary"
                } className="flex w-fit items-center gap-1.5 px-2 py-1 text-xs min-w-[120px] justify-center">
                    {option?.icon && <option.icon className={`size-3.5 ${option.icon === LoaderIcon ? 'animate-spin' : ''}`} />}
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
        header: ({ column }) => <DataTableColumnHeader column={column} title="Reported On" />,
        cell: ({ row }) => (
            <div className="text-xs text-muted-foreground min-w-[90px]">
                {new Date(row.original.createdAt).toLocaleDateString()}
                <div className="text-gray-400">{new Date(row.original.createdAt).toLocaleTimeString()}</div>
            </div>
        ),
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const item = row.original;
            return (
                <div className="flex justify-end">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="flex size-8 p-0 data-[state=open]:bg-muted">
                                <MoreVerticalIcon className="size-4" /> <span className="sr-only">Open menu</span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-[220px]">
                            {item.itemLink && (
                                <DropdownMenuItem onSelect={() => window.open(item.itemLink, '_blank')}>
                                    <EyeIcon className="mr-2 h-4 w-4" /> View Original Item
                                </DropdownMenuItem>
                            )}
                            <DropdownMenuItem onSelect={() => toast.info(`Editing notes for ${item.id}`)}>
                                <Edit3Icon className="mr-2 h-4 w-4" /> Edit Moderation Notes
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            {item.status !== "Reviewed_Approved" && item.status !== "Resolved" && (
                                <DropdownMenuItem onSelect={() => onUpdateStatusAction([item.id], "Reviewed_Approved")}>
                                    <ShieldCheckIcon className="mr-2 h-4 w-4 text-green-500" /> Approve Content
                                </DropdownMenuItem>
                            )}
                            {item.status !== "Reviewed_Rejected" && item.status !== "Resolved" && (
                                <DropdownMenuItem onSelect={() => onUpdateStatusAction([item.id], "Reviewed_Rejected")}>
                                    <ShieldXIcon className="mr-2 h-4 w-4 text-orange-500" /> Reject Content
                                </DropdownMenuItem>
                            )}
                            <DropdownMenuSeparator />
                            {item.itemType === "User" && item.status !== "ActionTaken_UserWarned" && (
                                <DropdownMenuItem onSelect={() => onUpdateStatusAction([item.id], "ActionTaken_UserWarned")}>
                                    <AlertTriangleIcon className="mr-2 h-4 w-4 text-amber-600" /> Warn User
                                </DropdownMenuItem>
                            )}
                            {item.itemType === "User" && item.status !== "ActionTaken_UserBanned" && (
                                <DropdownMenuItem className="text-red-600 focus:text-red-600"
                                                  onSelect={() => onUpdateStatusAction([item.id], "ActionTaken_UserBanned")}>
                                    <BanIcon className="mr-2 h-4 w-4" /> Ban User
                                </DropdownMenuItem>
                            )}
                            {(item.itemType === "Post" || item.itemType === "Comment") && item.status !== "ActionTaken_ContentRemoved" && (
                                 <DropdownMenuItem className="text-red-600 focus:text-red-600"
                                                   onSelect={() => onUpdateStatusAction([item.id], "ActionTaken_ContentRemoved")}>
                                     <Trash2Icon className="mr-2 h-4 w-4" /> Remove Content
                                 </DropdownMenuItem>
                            )}
                            {item.status !== "Resolved" && <DropdownMenuSeparator />}
                            {item.status !== "Resolved" && (
                                <DropdownMenuItem onSelect={() => onUpdateStatusAction([item.id], "Resolved")}>
                                    <CheckCircle2Icon className="mr-2 h-4 w-4 text-blue-500" /> Mark as Resolved
                                </DropdownMenuItem>
                            )}
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600 hover:!text-red-600 focus:text-red-600"
                                              onSelect={() => onDeleteEntriesAction([item.id])}>
                                <Trash2Icon className="mr-2 h-4 w-4" /> Delete Report
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            );
        },
        size: 50, enableSorting: false, enableHiding: false,
    },
];

