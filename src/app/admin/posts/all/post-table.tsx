"use client";

import React from "react";
import { ColumnDef } from "@tanstack/react-table";
import {
    CheckCircle2Icon,
    EditIcon,
    FileTextIcon,
    LoaderIcon,
    MoreVerticalIcon,
    EyeIcon,
} from "lucide-react";
import { toast } from "sonner";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Image from "next/image";
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
import { DataTable } from "@/components/ui/data-table";
import { DragHandleCell } from "@/components/common/dnd-table-components";
import { DataTableColumnHeader } from "@/components/common/data-table-components";
import { PostData } from "./post-schema";
import { PostDetailViewerSheet } from "./post-detail-viewer-sheet";
import { CreatePostSheet } from "./create-post-sheet";
import { UserTableCellViewer } from "../../users/all/user-table-cell-viewer";
import { UserAdminData, UserAdminSchema } from "../../users/all/user-admin-table";
import {getFixedNumberFormat} from "@/lib/utils";

const mockPostsData: PostData[] = [
    {
        id: '1',
        createdAt: '2024-05-01T10:00:00Z',
        updatedAt: '2024-05-01T11:00:00Z',
        createdBy: 'user-1',
        updatedBy: 'user-1',
        user: {
            id: 'user-1',
            displayName: 'Alice Wonderland',
            username: 'alice123',
            profileImage: 'https://picsum.photos/seed/alice/100/100',
            coverImage: 'https://picsum.photos/seed/cover1/400/200',
            createdAt: '2023-01-01T00:00:00Z',
        },
        caption: 'Exploring Next.js Server Actions',
        description: 'An overview of how Server Actions simplify mutation handling.',
        visibility: 'PUBLIC',
        duration: 120,
        categoryName: 'Technology',
        tags: ['Next.js', 'React', 'WebDev'],
        videoPlaybackUrl: 'https://videos.example.com/nextjs-server-actions.mp4',
        videoThumbnailUrl: 'https://picsum.photos/seed/video1/400/200',
        videoAsset: {
            id: 'asset-1',
            originalFilename: 'Next.js Server Actions',
            resourceType: 'video/mp4',
            bytes: 123456,
            createdAt: '2024-05-01T09:00:00Z',
            createdBy: "",
            publicId: "",
            format: "",
            width: 0,
            height: 0
        },
        isAuthorDeleted: false,
        status: "Published",
    },
    {
        id: '2',
        createdAt: '2024-05-02T12:00:00Z',
        updatedAt: '2024-05-02T12:30:00Z',
        createdBy: 'user-2',
        updatedBy: 'user-2',
        user: {
            id: 'user-2',
            displayName: 'Bob The Builder',
            username: 'bobthebuilder',
            profileImage: 'https://picsum.photos/seed/bob/100/100',
            coverImage: 'https://picsum.photos/seed/cover2/400/200',
            createdAt: '2023-02-15T00:00:00Z',
        },
        caption: 'AI in Modern Art',
        description: 'How artificial intelligence is transforming creative expression.',
        visibility: 'PRIVATE',
        duration: 180,
        categoryName: 'Art',
        tags: ['AI', 'Creativity', 'Art'],
        videoPlaybackUrl: 'https://videos.example.com/ai-art.mp4',
        videoThumbnailUrl: 'https://picsum.photos/seed/video2/400/200',
        videoAsset: {
            id: 'asset-2',
            originalFilename: 'AI Art',
            resourceType: 'video/mp4',
            bytes: 654321,
            createdAt: '2024-05-02T11:00:00Z',
            createdBy: "",
            publicId: "",
            format: "",
            width: 0,
            height: 0
        },
        isAuthorDeleted: false,
        status: "Published",
    },
];


export function PostTable() {
    const [data, setData] = React.useState<PostData[]>(() => mockPostsData);

    const handleCreatePost = React.useCallback((newPost: PostData) => {
        setData(currentData => [newPost, ...currentData]);
    }, []);

    const handleUpdatePost = React.useCallback((updatedPost: Partial<PostData>) => {
        setData(currentData =>
            currentData.map(item =>
                item.id === updatedPost.id ? { ...item, ...updatedPost, updatedAt: new Date().toISOString() } as PostData : item
            )
        );
    }, []);

    const handleDeletePost = React.useCallback((postId: string, postTitle: string) => {
        toast.promise(new Promise(res => setTimeout(res, 500)), {
            loading: `Deleting \"${postTitle}\"...`,
            success: () => {
                setData(prev => prev.filter(item => item.id !== postId));
                return `\"${postTitle}\" deleted.`;
            },
            error: `Failed to delete \"${postTitle}\".`,
        });
    }, []);


    const columns = React.useMemo<ColumnDef<PostData>[]>(() => [
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
            accessorKey: "title",
            header: ({ column }) => <DataTableColumnHeader column={column} title="Title" />,
            cell: ({ row }) => {
                const post = row.original;
                return (
                    <div className="flex items-center gap-2 py-0.5 min-w-[180px] max-w-[240px]">
                        {post.videoThumbnailUrl ?
                            <Image src={post.videoThumbnailUrl} alt={post.caption} width={48} height={36} className="h-9 w-12 object-cover rounded-sm flex-shrink-0"/> :
                            <div className="h-9 w-12 bg-muted rounded-sm flex items-center justify-center flex-shrink-0">
                                <FileTextIcon className="h-5 w-5 text-muted-foreground"/>
                            </div>
                        }
                        <div className="flex flex-col gap-0.5">
                            <PostDetailViewerSheet post={post} onUpdateAction={handleUpdatePost} />
                            {post.description && <span className="text-xs text-muted-foreground truncate max-w-48" title={post.description}>{post.description}</span>}
                        </div>
                    </div>
                );
            },
            enableHiding: false,
        },
        {
            accessorKey: "viewCount",
            header: ({ column }) => <DataTableColumnHeader column={column} title="Views" />,
            cell: ({ row }) => {
                const views = /*row.original.viewCount || 0;*/ 10 //TODO: add later
                return <div className="text-xs text-muted-foreground text-right min-w-[60px]">{getFixedNumberFormat(views)}</div>;
            },
            size: 80,
        },
        {
            accessorKey: "authorName",
            header: ({ column }) => <DataTableColumnHeader column={column} title="Author" />,
            cell: ({ row }) => {
                const user = row.original.user;
                const authorPlaceholder: UserAdminData = {
                    id: user.id,
                    name: user.displayName,
                    username: user.username.toLowerCase().replace(/\s+/g, '') || 'author',
                    email: 'author@example.com',
                    profileImage: user.profileImage,
                    type: UserAdminSchema.shape.type.options[0],
                    status: UserAdminSchema.shape.status.options[0],
                    createdAt: new Date(0).toISOString(),
                    lastLogin: undefined,
                };

                return (
                    <div className="flex items-center gap-2 py-0.5 min-w-[200px]">
                        <Avatar className="h-9 w-9 flex-shrink-0">
                            <AvatarFallback>{user.displayName.split(' ').map(n=>n[0]).join('').toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col gap-0.5">
                            <UserTableCellViewer
                                item={authorPlaceholder}
                                onUpdate={() => {
                                    toast.info("Author details are managed in the Users section.");
                                }}
                            />
                            <span className="text-xs text-muted-foreground">ID: {user.id}</span>
                        </div>
                    </div>
                );
            },
        },
        {
            accessorKey: "category",
            header: ({ column }) => <DataTableColumnHeader column={column} title="Category" />,
            cell: ({ row }) => <Badge variant="outline" className="text-xs">{row.original.categoryName}</Badge>,
        },
        {
            accessorKey: "visibility",
            header: ({ column }) => <DataTableColumnHeader column={column} title="Visibilty" />,
            cell: ({ row }) => {
                const status = row.original.visibility;
                let icon: React.ReactNode;
                let variant: "default" | "secondary" | "outline" | "destructive" = "secondary";

                switch (status) {
                    case "PUBLIC": icon = <CheckCircle2Icon className="size-3.5 text-green-500" />; variant = "default"; break;
                    case "PRIVATE": icon = <EditIcon className="size-3.5 text-blue-500" />; variant = "secondary"; break;
                    // case "Pending Review": icon = <HourglassIcon className="size-3.5 text-amber-500" />; variant = "outline"; break;
                    // case "Archived": icon = <ArchiveIcon className="size-3.5 text-slate-500" />; variant = "outline"; break;
                    default: icon = <LoaderIcon className="size-3.5 text-muted-foreground" />;
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
            header: ({ column }) => <DataTableColumnHeader column={column} title="Created At"/>,
            cell: ({ row }) => <div className="text-xs text-muted-foreground min-w-[64px]">{new Date(row.original.createdAt).toLocaleDateString()}</div>,
        },
        {
            accessorKey: "lastUpdate",
            header: ({ column }) => <DataTableColumnHeader column={column} title="Update At"/>,
            cell: ({ row }) => row.original.updatedAt ?
                <div className="text-xs text-muted-foreground min-w-[64px]">{new Date(row.original.updatedAt).toLocaleDateString()}</div> :
                <span className="text-xs text-muted-foreground/70">Not published</span>,
        },
        {
            id: "actions",
            cell: ({ row }) => {
                const post = row.original;
                return (
                    <>
                        <div className="flex justify-end">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="flex size-8 p-0 data-[state=open]:bg-muted" onClick={(e) => e.stopPropagation()}>
                                        <MoreVerticalIcon className="size-4" /> <span className="sr-only">Open menu</span>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-40">
                                    <DropdownMenuItem onSelect={() => {
                                        toast.info(`View/Edit \"${post.caption}\" (use title link or add programmatic open)`);
                                    }}>
                                        <EditIcon className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
                                        View / Edit
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onSelect={() => window.open(`/foryou/${post.id}`, '_blank')}>
                                        <EyeIcon className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
                                        Preview Post
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem className="text-red-600 hover:!text-red-600 focus:text-red-600 focus:bg-red-50 dark:hover:!bg-red-700/50"
                                                      onSelect={() => handleDeletePost(post.id, post.caption)}>
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
    ], [handleUpdatePost, handleDeletePost]);

    const currentMockUser = { id: "user-current", name: "Current Admin" };

    return (
        <div className="flex w-full flex-col justify-start gap-6 p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
                <h1 className="text-2xl font-semibold">Manage Posts</h1>
                <CreatePostSheet onCreateAction={handleCreatePost} currentAuthor={currentMockUser}/>
            </div>

            <DataTable
                columns={columns}
                data={data}
                setData={setData}
                enableDnd={true}
                enableRowSelection={true}
                filterPlaceholder="Search posts by title, author, tags..."
                searchableColumn="title"
            />
        </div>
    );
}

