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
import {z} from "zod";

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
import {UserAdminData, UserAdminSchema} from "../../users/all/user-admin-table";
import {PostDetailViewerSheet} from "../../posts/all/post-detail-viewer-sheet";
import {PostData} from "../../posts/all/post-schema";
import {CommentDetailViewerSheet} from "./comment-detail-viewer-sheet";

export const CommentAdminSchema = z.object({
    id: z.string(),
    content: z.string().min(1, "Content cannot be empty"),
    authorId: z.string(),
    authorName: z.string(),
    authorUsername: z.string(),
    authorEmail: z.string().email(),
    authorProfileImage: z.string().url().optional(),
    postId: z.string(),
    postTitle: z.string(),
    status: z.enum(["Approved", "Pending", "Spam", "Rejected"]),
    createdAt: z.string(),
    updatedAt: z.string().optional(),
});

export type CommentAdminData = z.infer<typeof CommentAdminSchema> & DraggableItem;

const mockCommentAdminData: CommentAdminData[] = [
    {
        id: "cmt001",
        content: "This is a great post! Really insightful.",
        authorId: "usr001",
        authorName: "Alice Wonderland",
        authorUsername: "alicew",
        authorEmail: "alice@example.com",
        authorProfileImage: "https://avatar.vercel.sh/alice.png",
        postId: "post001",
        postTitle: "The Future of AI",
        status: "Approved",
        createdAt: "2024-03-10T10:00:00Z",
        updatedAt: "2024-03-10T10:05:00Z"
    },
    {
        id: "cmt002",
        content: "I have a question about the second paragraph. Could you elaborate?",
        authorId: "usr002",
        authorName: "Bob The Builder",
        authorUsername: "bobthebuilder",
        authorEmail: "bob@example.com",
        authorProfileImage: "https://avatar.vercel.sh/bob.png",
        postId: "post001",
        postTitle: "The Future of AI",
        status: "Pending",
        createdAt: "2024-03-10T11:30:00Z"
    },
    {
        id: "cmt003",
        content: "Check out my website for more info: spamlink.com",
        authorId: "usr003",
        authorName: "Charlie Spammer",
        authorUsername: "charliespam",
        authorEmail: "charlie@example.com",
        postId: "post002",
        postTitle: "Exploring New Technologies",
        status: "Spam",
        createdAt: "2024-03-09T09:15:00Z"
    },
    {
        id: "cmt004",
        content: "Not sure I agree with this point.",
        authorId: "usr004",
        authorName: "Diana Prince",
        authorUsername: "wonderwoman",
        authorEmail: "diana@example.com",
        authorProfileImage: "https://avatar.vercel.sh/diana.png",
        postId: "post003",
        postTitle: "A Deep Dive into Web3",
        status: "Rejected",
        createdAt: "2024-03-08T16:45:00Z"
    },
    {
        id: "cmt005",
        content: "Thanks for sharing!",
        authorId: "usr005",
        authorName: "Edward Scissorhands",
        authorUsername: "edwardscissor",
        authorEmail: "edward@example.com",
        postId: "post002",
        postTitle: "Exploring New Technologies",
        status: "Approved",
        createdAt: "2024-03-07T14:00:00Z",
        updatedAt: "2024-03-07T14:00:00Z"
    },
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
                    <CommentDetailViewerSheet comment={comment}>
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
                const authorPlaceholder: UserAdminData = {
                    id: comment.authorId as string | number,
                    name: comment.authorName,
                    username: comment.authorUsername,
                    email: comment.authorEmail,
                    profileImage: comment.authorProfileImage,
                    type: UserAdminSchema.shape.type.options[0],
                    status: UserAdminSchema.shape.status.options[0],
                    createdAt: new Date(0).toISOString(),
                    lastLogin: undefined,
                };

                return (
                    <div className="flex items-center gap-2 py-0.5 min-w-[200px]">
                        <Avatar className="h-9 w-9 flex-shrink-0">
                            <AvatarImage src={comment.authorProfileImage} alt={comment.authorName}/>
                            <AvatarFallback>{comment.authorName.split(' ').map(n => n[0]).join('').toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col gap-0.5">
                            <UserTableCellViewer
                                item={authorPlaceholder}
                                onUpdate={() => {
                                    toast.info("Author details are managed in the Users section.");
                                }}
                            />
                            <span className="text-xs text-muted-foreground">ID: {comment.authorId}</span>
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
                    id: comment.postId,
                    title: comment.postTitle,
                    description: undefined,
                    content: "",
                    authorId: "",
                    authorName: "",
                    category: "",
                    status: "Draft",
                    tags: [],
                    featuredImage: undefined,
                    publishedAt: undefined,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                    viewCount: 0,
                };

                return (
                    <div className="flex items-center gap-2 py-0.5 min-w-[180px] max-w-[240px]">
                        <div className="h-9 w-12 bg-muted rounded-sm flex items-center justify-center flex-shrink-0">
                            {postForSheet.featuredImage ? (
                                <Image
                                    src={postForSheet.featuredImage}
                                    alt={comment.postTitle.split(" ").slice(0, 2).join(" ")}
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
                                post={postForSheet}
                                onUpdate={() => {
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

    const statusFilterOptions = [
        {label: "Approved", value: "Approved", icon: CheckCircle2Icon, color: "text-green-500"},
        {label: "Pending", value: "Pending", icon: LoaderIcon, color: "text-amber-500"},
        {label: "Spam", value: "Spam", icon: XCircleIcon, color: "text-red-500"},
        {label: "Rejected", value: "Rejected", icon: XCircleIcon, color: "text-orange-500"},
    ];

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
