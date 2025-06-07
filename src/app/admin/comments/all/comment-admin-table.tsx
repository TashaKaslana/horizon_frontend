"use client";

import React, {useEffect} from "react";
import {ColumnDef} from "@tanstack/react-table";
import {
    CheckCircle2Icon,
    LoaderIcon,
    MessageSquareIcon,
    MoreVerticalIcon,
    Trash2Icon,
    XCircleIcon,
    ShieldQuestionIcon,
    FileTextIcon,
} from "lucide-react";
import {toast} from "sonner";
import Image from "next/image";
import { useTranslations } from "next-intl";

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
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {DataTable} from "@/components/ui/data-table";
import {DataTableColumnHeader} from "@/components/common/data-table-components";
import {DraggableItem, DragHandleCell} from "@/components/common/dnd-table-components";
import {UserTableCellViewer} from "../../users/all/components/user-table-cell-viewer";
import {PostDetailViewerSheet} from "../../posts/all/post-detail-viewer-sheet";
import {CommentDetailViewerSheet} from "./comment-detail-viewer-sheet";
import useCommentsStore from "@/app/admin/comments/all/stores/useCommentsStore";
import {CommentResponseWithPostDetails} from "@/api/client";
import {formatDateTS} from "@/lib/utils";
import useCommentsManagement from "./hooks/useCommentsManagement";

export type CommentAdminData = CommentResponseWithPostDetails & DraggableItem;

export function CommentAdminTable() {
    const {comments} = useCommentsStore()
    const {isLoading, isFetchingNextPage, hasNextPage, fetchNextPage} = useCommentsManagement()
    const [data, setData] = React.useState<CommentAdminData[]>([]);
    const [selectedPostId, setSelectedPostId] = React.useState<string | null>(null);
    const [isPostSheetOpen, setIsPostSheetOpen] = React.useState(false);
    const tTable = useTranslations('Admin.comments.all.table');
    const tStatus = useTranslations('Admin.comments.all.status');

    useEffect(() => {
        setData(comments.map(comment => ({
            ...comment,
            id: comment.id ?? '',
        })));
    }, [comments]);

    const handleUpdateCommentStatus = React.useCallback((commentId: string, newStatus: CommentAdminData["status"]) => {
        setData(currentData =>
            currentData.map(item =>
                item.id === commentId ? {...item, status: newStatus, updatedAt: new Date()} : item
            )
        );
        toast.success(tStatus('statusUpdated'));
    }, [tStatus]);

    const handleDeleteComment = React.useCallback((commentId: string) => {
        setData(prev => prev.filter(item => item.id !== commentId));
        toast.error(tStatus('commentDeleted'));
    }, [tStatus]);

    const columns = React.useMemo<ColumnDef<CommentAdminData>[]>(() => [
        {
            id: "drag",
            header: () => null,
            cell: (props) => <DragHandleCell {...props} />,
            size: 40, enableSorting: false, enableHiding: false,
        },
        {
            id: "select",
            header: ({table}) => (
                <div className="flex items-center justify-center px-1">
                    <Checkbox
                        checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
                        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                        aria-label="Select all" onClick={(e) => e.stopPropagation()}
                    />
                </div>
            ),
            cell: ({row}) => (
                <div className="flex items-center justify-center px-1">
                    <Checkbox
                        checked={row.getIsSelected()}
                        onCheckedChange={(value) => row.toggleSelected(!!value)}
                        aria-label="Select row" onClick={(e) => e.stopPropagation()}
                    />
                </div>
            ),
            enableSorting: false, enableHiding: false, size: 40,
        },
        {
            accessorKey: "content",
            header: ({column}) => <DataTableColumnHeader column={column} title={tTable('comment')}/>,
            cell: ({row}) => {
                const comment = row.original;
                return (
                    <CommentDetailViewerSheet commentId={comment.id}>
                        <div
                            className="flex items-start gap-2 py-1 min-w-36 max-w-xs cursor-pointer hover:underline decoration-sky-500 decoration-1">
                            <MessageSquareIcon className="h-4 w-4 text-muted-foreground mt-1 flex-shrink-0"/>
                            <span
                                className="overflow-hidden text-ellipsis whitespace-nowrap flex-grow min-w-0 truncate">
                                {comment.content}
                            </span>
                        </div>
                    </CommentDetailViewerSheet>
                );
            },
            enableHiding: false,
        },
        {
            accessorKey: "authorName",
            header: ({column}) => <DataTableColumnHeader column={column} title={tTable('author')}/>,
            cell: ({row}) => {
                const comment = row.original;
                return (
                    <div className="flex items-center gap-2 py-0.5 min-w-[200px]">
                        <Avatar className="h-9 w-9 flex-shrink-0">
                            <AvatarImage src={comment?.user?.profileImage} alt={comment?.user?.displayName}/>
                            <AvatarFallback>{comment?.user?.displayName?.split(' ').map(n => n[0]).join('').toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col gap-0.5">
                            <UserTableCellViewer
                                userId={comment?.user?.id}
                                initialDisplayName={comment?.user?.displayName}
                                onUpdate={() => {
                                    toast.info(tTable('authorDetailsManaged'));
                                }}
                            />
                        </div>
                    </div>
                );
            },
        },
        {
            id: "postDetails",
            header: ({column}) => <DataTableColumnHeader column={column} title={tTable('post')}/>,
            cell: ({row}) => {
                const comment = row.original;
                return (
                    <div className="flex items-center gap-2 py-0.5 min-w-[180px] max-w-[240px]">
                        <div
                            className="h-12 w-20 bg-muted rounded-sm flex items-center justify-center flex-shrink-0 relative aspect-video">
                            {comment?.post?.videoThumbnailUrl ? (
                                <Image
                                    src={comment?.post?.videoThumbnailUrl}
                                    alt={comment?.post?.caption?.split(" ").slice(0, 2).join(" ") ?? 'N/A'}
                                    className="object-cover rounded-sm"
                                    fill
                                />
                            ) : (
                                <FileTextIcon className="h-5 w-5 text-muted-foreground"/>
                            )}
                        </div>
                        <div className="flex flex-col gap-0.5">
                            <h3 onClick={() => {
                                setSelectedPostId(comment.post!.id!)
                                setIsPostSheetOpen(true)
                            }}
                                className={'font-semibold hover:underline truncate cursor-pointer'}
                            >
                                {comment.post?.caption}
                            </h3>
                            <p className={'text-sm text-muted-foreground truncate'}>{comment.post?.description}</p>
                        </div>
                    </div>
                );
            },
            enableHiding: false,
        },
        {
            accessorKey: "status",
            header: ({column}) => <DataTableColumnHeader column={column} title={tTable('status')}/>,
            cell: ({row}) => {
                const status = row.original.status ?? "PENDING";
                let icon = <ShieldQuestionIcon className="size-3.5 text-slate-400"/>;
                let badgeVariant: "default" | "secondary" | "outline" | "destructive" = "secondary";

                if (status === "APPROVED") {
                    icon = <CheckCircle2Icon className="size-3.5 text-green-500"/>;
                    badgeVariant = "default";
                } else if (status === "PENDING") {
                    icon = <LoaderIcon className="size-3.5 animate-spin text-amber-500"/>;
                    badgeVariant = "outline";
                } else if (status === "SPAM") {
                    icon = <XCircleIcon className="size-3.5 text-red-500"/>;
                    badgeVariant = "destructive";
                } else if (status === "REJECTED") {
                    icon = <XCircleIcon className="size-3.5 text-orange-500"/>;
                    badgeVariant = "destructive";
                }

                return (
                    <Badge variant={badgeVariant}
                           className="flex w-fit items-center gap-1.5 px-2 py-1 text-xs min-w-[90px] justify-center">
                        {icon} {tStatus(status.toLowerCase())}
                    </Badge>
                );
            },
            filterFn: (row, id, value) => {
                return value.includes(row.getValue(id));
            }
        },
        {
            accessorKey: "createdAt",
            header: ({column}) => <DataTableColumnHeader column={column} title={tTable('submitted')}/>,
            cell: ({row}) => (
                <div className="text-xs text-muted-foreground min-w-[90px]">
                    {row.original.createdAt && (
                        <div className="text-gray-400">{formatDateTS(row.original?.createdAt)}</div>
                    )}

                    {row.original.updatedAt && (
                        <div className="text-gray-400">{formatDateTS(row.original?.updatedAt)}</div>
                    )}
                </div>
            ),
        },
        {
            id: "actions",
            cell: ({row}) => (
                <div className="flex justify-end">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="flex size-8 p-0 data-[state=open]:bg-muted"
                                    onClick={(e) => e.stopPropagation()}>
                                <MoreVerticalIcon className="size-4"/> <span className="sr-only">Open menu</span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-40">
                            <DropdownMenuItem onSelect={() => handleUpdateCommentStatus(row.original.id, "APPROVED")}>
                                <CheckCircle2Icon className="mr-2 h-4 w-4 text-green-500"/> {tTable('approve')}
                            </DropdownMenuItem>
                            <DropdownMenuItem onSelect={() => handleUpdateCommentStatus(row.original.id, "PENDING")}>
                                <LoaderIcon className="mr-2 h-4 w-4 text-amber-500"/> {tTable('markAsPending')}
                            </DropdownMenuItem>
                            <DropdownMenuItem onSelect={() => handleUpdateCommentStatus(row.original.id, "SPAM")}>
                                <XCircleIcon className="mr-2 h-4 w-4 text-red-500"/> {tTable('markAsSpam')}
                            </DropdownMenuItem>
                            <DropdownMenuItem onSelect={() => handleUpdateCommentStatus(row.original.id, "REJECTED")}>
                                <XCircleIcon className="mr-2 h-4 w-4 text-orange-500"/> {tTable('reject')}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator/>
                            <DropdownMenuItem onSelect={() => toast.info(tTable('editingComment', { id: row.original.id }))}>
                                {tTable('editComment')}
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                className="text-red-600 hover:!text-red-600 hover:!bg-red-100 dark:hover:!bg-red-700/50"
                                onSelect={() => handleDeleteComment(row.original.id)}>
                                <Trash2Icon className="mr-2 h-4 w-4"/> {tTable('delete')}
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            ),
            size: 50, enableSorting: false, enableHiding: false,
        },
    ], [handleUpdateCommentStatus, handleDeleteComment, tTable, tStatus]);
    return (
        <div className="flex w-full flex-col justify-start gap-6 p-4 md:p-6">
            <DataTable
                columns={columns}
                data={data}
                setData={setData}
                enableDnd={true}
                enableRowSelection={true}
                filterPlaceholder={tTable('searchComments')}
                isLoading={isLoading}
                isFetchingNextPage={isFetchingNextPage}
                hasNextPage={hasNextPage}
                fetchNextPage={fetchNextPage}
            />
            {
                selectedPostId && <PostDetailViewerSheet
                    postId={selectedPostId}
                    isOpen={isPostSheetOpen}
                    onSetIsOpenAction={setIsPostSheetOpen}
                />
            }
        </div>
    );
}
