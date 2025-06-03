"use client";

import React, {useCallback, useEffect} from "react";
import {ColumnDef} from "@tanstack/react-table";
import {
    CheckCircle2Icon,
    EditIcon,
    FileTextIcon,
    LoaderIcon,
    MoreVerticalIcon,
    EyeIcon,
} from "lucide-react";
import {toast} from "sonner";

import {Avatar, AvatarFallback} from "@/components/ui/avatar";
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
import {DataTable} from "@/components/ui/data-table";
import {DataTableColumnHeader} from "@/components/common/data-table-components";
import {PostDetailViewerSheet} from "./post-detail-viewer-sheet";
import {CreatePostSheet} from "./create-post-sheet";
import {UserTableCellViewer} from "../../users/all/components/user-table-cell-viewer";
import {formatDateTS, getFixedNumberFormat} from "@/lib/utils";
import {PostAdminViewDto} from "@/api/client";
import usePostsStore from "./stores/usePostsStore";
import {usePostsManagement} from "@/app/admin/posts/all/hooks/usePostsManagement";


export function PostTable() {
    const [data, setData] = React.useState<PostAdminViewDto[]>([]);
    const [selectedPostId, setSelectedPostId] = React.useState<string | null>(null);
    const [isSheetOpen, setIsSheetOpen] = React.useState(false);

    const {posts} = usePostsStore();

    const {isLoading, isFetchingNextPage, fetchNextPage, hasNextPage, deletePost, createPost} = usePostsManagement()

    useEffect(() => {
        if (!isLoading && !isFetchingNextPage) {
            setData(posts);
        }
    }, [isFetchingNextPage, isLoading, posts]);

    const handleDeletePost = React.useCallback(async (postId: string, postTitle: string) => {
        const promise = deletePost(postId);

        toast.promise(promise, {
            loading: `Deleting "${postTitle}"...`,
            success: () => {
                return `"${postTitle}" deleted.`;
            },
            error: (err) => {
                console.error("Delete post error in table:", err);
                return `Failed to delete "${postTitle}".`;
            },
        });
    }, [deletePost]);

    const handleOpenSheet = useCallback((postId: string) => {
            setSelectedPostId(postId);
            setIsSheetOpen(true);
        }, []
    );

    const columns = React.useMemo<ColumnDef<PostAdminViewDto>[]>(() => [
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
            accessorKey: "title",
            header: ({column}) => <DataTableColumnHeader column={column} title="Title"/>,
            cell: ({row}) => {
                const post = row.original;
                return (
                    <div className="flex items-center gap-2 py-0.5 min-w-[180px] max-w-[240px]">
                        {post.videoThumbnailUrl ?
                            <Image src={post.videoThumbnailUrl} alt={post.caption!} width={48} height={36}
                                   className="h-9 w-12 object-cover rounded-sm flex-shrink-0"/> :
                            <div
                                className="h-9 w-12 bg-muted rounded-sm flex items-center justify-center flex-shrink-0">
                                <FileTextIcon className="h-5 w-5 text-muted-foreground"/>
                            </div>
                        }
                        <div className="flex flex-col gap-0.5">
                            <Button
                                variant="link"
                                className="w-fit px-0 py-0 h-fit text-left font-medium text-foreground hover:text-primary hover:no-underline whitespace-normal truncate"
                                onClick={() => handleOpenSheet(post.id!)}
                            >
                                {post.caption || "View Details"}
                            </Button>
                            <p className={'text-muted-foreground truncate'}>
                                {post.description ? post.description : "No description provided."}
                            </p>
                        </div>
                    </div>
                );
            },
            enableHiding: false,
        },
        {
            accessorKey: "viewCount",
            header: ({column}) => <DataTableColumnHeader column={column} title="Views"/>,
            cell: ({row}) => {
                const views = row.original.totalViews
                return <div
                    className="text-xs text-muted-foreground text-right min-w-[60px]">{getFixedNumberFormat(Number(views) ?? 0)}</div>;
            },
            size: 80,
        },
        {
            accessorKey: "authorName",
            header: ({column}) => <DataTableColumnHeader column={column} title="Author"/>,
            cell: ({row}) => {
                const user = row.original.user;
                return (
                    <div className="flex items-center gap-2 py-0.5 min-w-[200px]">
                        <Avatar className="h-9 w-9 flex-shrink-0">
                            <AvatarFallback>{user?.displayName?.split(' ').map(n => n[0]).join('').toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col gap-0.5">
                            <UserTableCellViewer
                                onUpdate={() => {
                                    toast.info("Author details are managed in the Users section.");
                                }}
                                userId={user?.id}
                                initialDisplayName={user?.displayName}
                            />
                            <span className="text-xs text-muted-foreground">ID: {user?.id}</span>
                        </div>
                    </div>
                );
            },
        },
        {
            accessorKey: "category",
            header: ({column}) => <DataTableColumnHeader column={column} title="Category"/>,
            cell: ({row}) => <Badge variant="outline" className="text-xs">{row.original.category?.name}</Badge>,
        },
        {
            accessorKey: "visibility",
            header: ({column}) => <DataTableColumnHeader column={column} title="Visibilty"/>,
            cell: ({row}) => {
                const status = row.original.visibility;
                let icon: React.ReactNode;
                let variant: "default" | "secondary" | "outline" | "destructive" = "secondary";

                switch (status) {
                    case "PUBLIC":
                        icon = <CheckCircle2Icon className="size-3.5 text-green-500"/>;
                        variant = "default";
                        break;
                    case "PRIVATE":
                        icon = <EditIcon className="size-3.5 text-blue-500"/>;
                        variant = "secondary";
                        break;
                    default:
                        icon = <LoaderIcon className="size-3.5 text-muted-foreground"/>;
                }
                return (
                    <Badge variant={variant} className="flex w-fit items-center gap-1.5 px-2 py-1 text-xs">
                        {icon} {status}
                    </Badge>
                );
            },
        },
        {
            accessorKey: "createdAt",
            header: ({column}) => <DataTableColumnHeader column={column} title="Created At"/>,
            cell: ({row}) => <div className="text-xs text-muted-foreground min-w-[64px]">
                {row.original.createdAt ? formatDateTS(row.original.createdAt) : ''}
            </div>,
        },
        {
            accessorKey: "lastUpdate",
            header: ({column}) => <DataTableColumnHeader column={column} title="Update At"/>,
            cell: ({row}) => row.original.updatedAt ?
                <div
                    className="text-xs text-muted-foreground min-w-[64px]">{new Date(row.original.updatedAt).toLocaleDateString()}</div> :
                <span className="text-xs text-muted-foreground/70">Not published</span>,
        },
        {
            id: "actions",
            cell: ({row}) => {
                const post = row.original;
                return (
                    <>
                        <div className="flex justify-end">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="flex size-8 p-0 data-[state=open]:bg-muted"
                                            onClick={(e) => e.stopPropagation()}>
                                        <MoreVerticalIcon className="size-4"/> <span
                                        className="sr-only">Open menu</span>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-40">
                                    <DropdownMenuItem onSelect={() => {
                                        toast.info(`View/Edit \"${post.caption}\" (use title link or add programmatic open)`);
                                    }}>
                                        <EditIcon className="mr-2 h-3.5 w-3.5 text-muted-foreground/70"/>
                                        View / Edit
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onSelect={() => window.open(`/foryou/${post.id}`, '_blank')}>
                                        <EyeIcon className="mr-2 h-3.5 w-3.5 text-muted-foreground/70"/>
                                        Preview Post
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator/>
                                    <DropdownMenuItem
                                        className="text-red-600 hover:!text-red-600 focus:text-red-600 focus:bg-red-50 dark:hover:!bg-red-700/50"
                                        onSelect={() => handleDeletePost(post.id!, post.caption!)}>
                                        Delete Post
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </>
                );
            },
            size: 50, enableSorting: false, enableHiding: false,
        },
    ], [handleDeletePost, handleOpenSheet]);

    return (
        <div className="flex w-full flex-col justify-start gap-6 p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
                <h1 className="text-2xl font-semibold">Manage Posts</h1>
                <CreatePostSheet onCreateAction={createPost}/>
            </div>

            <DataTable
                columns={columns}
                data={data}
                setData={setData}
                enableRowSelection={true}
                filterPlaceholder="Search posts by title, author, tags..."
                fetchNextPage={fetchNextPage}
                hasNextPage={hasNextPage}
                isFetchingNextPage={isFetchingNextPage}
                isLoading={isLoading}
            />

            {selectedPostId &&
                <PostDetailViewerSheet postId={selectedPostId} isOpen={isSheetOpen} onSetIsOpenAction={setIsSheetOpen}/>}
        </div>
    );
}

