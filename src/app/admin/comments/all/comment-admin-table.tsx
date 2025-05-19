"use client";

import React from "react";
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
import {UserTableCellViewer} from "../../users/all/user-table-cell-viewer";
import {PostDetailViewerSheet} from "../../posts/all/post-detail-viewer-sheet";
import {PostData} from "../../posts/all/post-schema";
import {CommentDetailViewerSheet} from "./comment-detail-viewer-sheet";
import {CommentResponseFull} from "@/schemas/comment-schema";
import {commentData} from "@/app/admin/components/mockData";

export type CommentAdminData = CommentResponseFull & DraggableItem;

const mockCommentAdminData: CommentAdminData[] = [
    {...commentData}
];

export function CommentAdminTable() {
    const [data, setData] = React.useState<CommentAdminData[]>(() => mockCommentAdminData);

    const handleUpdateCommentStatus = React.useCallback((commentId: string, newStatus: CommentAdminData["status"]) => {
        setData(currentData =>
            currentData.map(item =>
                item.id === commentId ? {...item, status: newStatus, updatedAt: new Date().toISOString()} : item
            )
        );
        toast.success(`Comment ${commentId} status updated to ${newStatus}`);
    }, []);

    const handleDeleteComment = React.useCallback((commentId: string) => {
        setData(prev => prev.filter(item => item.id !== commentId));
        toast.error(`Comment ${commentId} deleted`);
    }, []);

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
            header: ({column}) => <DataTableColumnHeader column={column} title="Comment"/>,
            cell: ({row}) => {
                const comment = row.original;
                return (
                    <CommentDetailViewerSheet commentId={comment.id}>
                        <div className="flex items-start gap-2 py-1 min-w-36 max-w-xs cursor-pointer hover:underline decoration-sky-500 decoration-1">
                            <MessageSquareIcon className="h-4 w-4 text-muted-foreground mt-1 flex-shrink-0" />
                            <span className="overflow-hidden text-ellipsis whitespace-nowrap flex-grow min-w-0">
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
            header: ({column}) => <DataTableColumnHeader column={column} title="Author"/>,
            cell: ({row}) => {
                const comment = row.original;
                return (
                    <div className="flex items-center gap-2 py-0.5 min-w-[200px]">
                        <Avatar className="h-9 w-9 flex-shrink-0">
                            <AvatarImage src={comment.user.profileImage} alt={comment.user.displayName}/>
                            <AvatarFallback>{comment.user.displayName.split(' ').map(n => n[0]).join('').toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col gap-0.5">
                            <UserTableCellViewer
                                userId={comment.user.id}
                                initialDisplayName={comment.user.displayName}
                                onUpdate={() => {
                                    toast.info("Author details are managed in the Users section.");
                                }}
                            />
                            <span className="text-xs text-muted-foreground">ID: {comment.user.id}</span>
                        </div>
                    </div>
                );
            },
        },
        {
            id: "postDetails",
            header: ({column}) => <DataTableColumnHeader column={column} title="Post"/>,
            cell: ({row}) => {
                const comment = row.original;

                const postForSheet: PostData = {
                    id: 'post-001',
                    createdAt: '2024-05-01T10:00:00Z',
                    updatedAt: '2024-05-01T12:00:00Z',
                    createdBy: 'user-1',
                    updatedBy: 'user-1',
                    user: {
                        id: 'user-1',
                        displayName: 'Alice Wonderland',
                        username: 'alice123',
                        profileImage: 'https://picsum.photos/seed/alice/100/100',
                        coverImage: 'https://picsum.photos/seed/alice-cover/400/200',
                        createdAt: '2023-01-01T00:00:00Z',
                    },
                    caption: 'Mastering Next.js 14 Features',
                    description: 'A deep dive into the new Server Actions, metadata routing, and performance improvements.',
                    visibility: 'PUBLIC' as const,
                    duration: 135,
                    categoryName: 'Web Development',
                    tags: ['Next.js', 'JavaScript', 'Frontend'],
                    videoPlaybackUrl: 'https://cdn.example.com/videos/next14.mp4',
                    videoThumbnailUrl: 'https://cdn.example.com/thumbnails/next14.jpg',
                    videoAsset: {
                        id: 'asset-001',
                        publicId: 'videos/next14',
                        resourceType: 'video',
                        format: 'mp4',
                        bytes: 10485760,
                        width: 1920,
                        height: 1080,
                        originalFilename: 'next14.mp4',
                        createdAt: '2024-05-01T09:59:00Z',
                        createdBy: 'user-1',
                    },
                    isAuthorDeleted: false,
                    status: 'Draft'
                }

                return (
                    <div className="flex items-center gap-2 py-0.5 min-w-[180px] max-w-[240px]">
                        <div className="h-9 w-12 bg-muted rounded-sm flex items-center justify-center flex-shrink-0">
                            {postForSheet.videoThumbnailUrl ? (
                                <Image
                                    src={postForSheet.videoThumbnailUrl}
                                    alt={comment.post.caption.split(" ").slice(0, 2).join(" ")}
                                    width={48}
                                    height={48}
                                    className="object-cover rounded-sm"
                                />
                            ) : (
                                <FileTextIcon className="h-5 w-5 text-muted-foreground"/>
                            )}
                        </div>
                        <div className="flex flex-col gap-0.5">
                            <PostDetailViewerSheet
                                postId={comment.post.id}
                                onUpdateAction={() => {
                                    toast.info("Post details are managed in the Posts section.");
                                }}
                            />
                        </div>
                    </div>
                );
            },
            enableHiding: false,
        },
        {
            accessorKey: "status",
            header: ({column}) => <DataTableColumnHeader column={column} title="Status"/>,
            cell: ({row}) => {
                const status = row.original.status;
                let icon = <ShieldQuestionIcon className="size-3.5 text-slate-400"/>;
                let badgeVariant: "default" | "secondary" | "outline" | "destructive" = "secondary";

                if (status === "Approved") {
                    icon = <CheckCircle2Icon className="size-3.5 text-green-500"/>;
                    badgeVariant = "default";
                } else if (status === "Pending") {
                    icon = <LoaderIcon className="size-3.5 animate-spin text-amber-500"/>;
                    badgeVariant = "outline";
                } else if (status === "Spam") {
                    icon = <XCircleIcon className="size-3.5 text-red-500"/>;
                    badgeVariant = "destructive";
                } else if (status === "Rejected") {
                    icon = <XCircleIcon className="size-3.5 text-orange-500"/>;
                    badgeVariant = "destructive";
                }

                return (
                    <Badge variant={badgeVariant}
                           className="flex w-fit items-center gap-1.5 px-2 py-1 text-xs min-w-[90px] justify-center">
                        {icon} {status}
                    </Badge>
                );
            },
            filterFn: (row, id, value) => {
                return value.includes(row.getValue(id));
            }
        },
        {
            accessorKey: "createdAt",
            header: ({column}) => <DataTableColumnHeader column={column} title="Submitted"/>,
            cell: ({row}) => (
                <div className="text-xs text-muted-foreground min-w-[90px]">
                    {new Date(row.original.createdAt).toLocaleDateString()}
                    <div className="text-gray-400">{new Date(row.original.createdAt).toLocaleTimeString()}</div>
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
                            <DropdownMenuItem onSelect={() => handleUpdateCommentStatus(row.original.id, "Approved")}>
                                <CheckCircle2Icon className="mr-2 h-4 w-4 text-green-500"/> Approve
                            </DropdownMenuItem>
                            <DropdownMenuItem onSelect={() => handleUpdateCommentStatus(row.original.id, "Pending")}>
                                <LoaderIcon className="mr-2 h-4 w-4 text-amber-500"/> Mark as Pending
                            </DropdownMenuItem>
                            <DropdownMenuItem onSelect={() => handleUpdateCommentStatus(row.original.id, "Spam")}>
                                <XCircleIcon className="mr-2 h-4 w-4 text-red-500"/> Mark as Spam
                            </DropdownMenuItem>
                            <DropdownMenuItem onSelect={() => handleUpdateCommentStatus(row.original.id, "Rejected")}>
                                <XCircleIcon className="mr-2 h-4 w-4 text-orange-500"/> Reject
                            </DropdownMenuItem>
                            <DropdownMenuSeparator/>
                            <DropdownMenuItem onSelect={() => toast.info(`Editing comment: ${row.original.id}`)}>
                                Edit Comment
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                className="text-red-600 hover:!text-red-600 hover:!bg-red-100 dark:hover:!bg-red-700/50"
                                onSelect={() => handleDeleteComment(row.original.id)}>
                                <Trash2Icon className="mr-2 h-4 w-4"/> Delete
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            ),
            size: 50, enableSorting: false, enableHiding: false,
        },
    ], [handleUpdateCommentStatus, handleDeleteComment]);

    // const statusFilterOptions = [
    //     {label: "Approved", value: "Approved", icon: CheckCircle2Icon, color: "text-green-500"},
    //     {label: "Pending", value: "Pending", icon: LoaderIcon, color: "text-amber-500"},
    //     {label: "Spam", value: "Spam", icon: XCircleIcon, color: "text-red-500"},
    //     {label: "Rejected", value: "Rejected", icon: XCircleIcon, color: "text-orange-500"},
    // ];

    return (
        <div className="flex w-full flex-col justify-start gap-6 p-4 md:p-6">
            <DataTable
                columns={columns}
                data={data}
                setData={setData}
                enableDnd={true}
                enableRowSelection={true}
                filterPlaceholder="Search comments, authors, posts..."
            />
        </div>
    );
}
