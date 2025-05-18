"use client";

import React from "react";
import { ColumnDef } from "@tanstack/react-table";
import {
    ArchiveIcon,
    CheckCircle2Icon,
    EditIcon,
    FileTextIcon,
    LoaderIcon,
    MoreVerticalIcon,
    HourglassIcon,
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
import { PostData } from "./post-schema"; // Adjust path
import { PostDetailViewerSheet } from "./post-detail-viewer-sheet"; // Adjust path
import { CreatePostSheet } from "./create-post-sheet"; // Adjust path
import { UserTableCellViewer } from "../../users/all/user-table-cell-viewer";
import { UserAdminData, UserAdminSchema } from "../../users/all/user-admin-table";
import {getFixedNumberFormat} from "@/lib/utils";

const mockPostsData: PostData[] = [
    {
        id: '1', title: "Getting Started with Next.js 14", description: "An introductory guide to the latest features in Next.js 14, including server actions and improved image handling.",
        content: "Next.js 14 introduces server actions, improved image handling, and more. This post explores the key features...",
        authorId: "user-1", authorName: "Alice Wonderland", category: "Technology", status: "Published",
        tags: ["Next.js", "React", "Web Development"], featuredImage: "https://picsum.photos/seed/nextjs/400/200",
        publishedAt: "2024-03-10T10:00:00Z", createdAt: "2024-03-08T09:00:00Z", updatedAt: "2024-03-10T10:00:00Z", viewCount: 1500,
    },
    {
        id: '2', title: "The Future of AI in Art", description: "Exploring the transformative impact of artificial intelligence on the art world, from creation to curation.",
        content: "Exploring how artificial intelligence is reshaping the art world, from generation to curation.",
        authorId: "user-2", authorName: "Bob The Builder", category: "Art", status: "Draft",
        tags: ["AI", "Art", "Technology"],
        createdAt: "2024-03-15T14:30:00Z", updatedAt: "2024-03-16T11:00:00Z", viewCount: 250,
    },
    {
        id: '3', title: "A Guide to Sustainable Travel", description: "Practical tips and advice for traveling more sustainably and minimizing your environmental footprint.",
        content: "Tips and tricks for traveling more sustainably and reducing your carbon footprint.",
        authorId: "user-1", authorName: "Alice Wonderland", category: "Travel", status: "Pending Review",
        tags: ["Sustainability", "Travel", "Eco-friendly"], featuredImage: "https://picsum.photos/seed/travel/400/200",
        createdAt: "2024-02-20T12:00:00Z", updatedAt: "2024-03-01T16:00:00Z", viewCount: 780,
    },
    {
        id: '4', title: "Mastering Remote Work Productivity", description: "Proven strategies and tools to enhance focus and achieve more when working from home.",
        content: "Proven strategies to stay focused and achieve more while working from home.",
        authorId: "user-3", authorName: "Charlie Brown", category: "Business", status: "Published",
        tags: ["Remote Work", "Productivity"],
        publishedAt: "2024-01-25T09:00:00Z", createdAt: "2024-01-20T10:00:00Z", updatedAt: "2024-01-25T09:00:00Z", viewCount: 12034,
    },
    {
        id: '5', title: "The Science of Sleep: Why It Matters", description: "An in-depth look at the critical role sleep plays in physical and mental well-being.",
        content: "Delving into the crucial role sleep plays in our physical and mental well-being.",
        authorId: "user-4", authorName: "Diana Prince", category: "Science", status: "Archived",
        tags: ["Health", "Science", "Well-being"], featuredImage: "https://picsum.photos/seed/sleep/400/200",
        publishedAt: "2023-11-10T14:00:00Z", createdAt: "2023-11-08T11:00:00Z", updatedAt: "2023-12-01T10:00:00Z", viewCount: 5600,
    }
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
                        {post.featuredImage ?
                            <Image src={post.featuredImage} alt={post.title} width={48} height={36} className="h-9 w-12 object-cover rounded-sm flex-shrink-0"/> :
                            <div className="h-9 w-12 bg-muted rounded-sm flex items-center justify-center flex-shrink-0">
                                <FileTextIcon className="h-5 w-5 text-muted-foreground"/>
                            </div>
                        }
                        <div className="flex flex-col gap-0.5">
                            <PostDetailViewerSheet post={post} onUpdate={handleUpdatePost} />
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
                const views = row.original.viewCount || 0;
                return <div className="text-xs text-muted-foreground text-right min-w-[60px]">{getFixedNumberFormat(views)}</div>;
            },
            size: 80,
        },
        {
            accessorKey: "authorName",
            header: ({ column }) => <DataTableColumnHeader column={column} title="Author" />,
            cell: ({ row }) => {
                const post = row.original;
                const authorPlaceholder: UserAdminData = {
                    id: post.authorId as string | number,
                    name: post.authorName,
                    username: post.authorName.toLowerCase().replace(/\s+/g, '') || 'author',
                    email: `${post.authorName.toLowerCase().replace(/\s+/g, '') || 'author'}@example.com`,
                    profileImage: undefined,
                    type: UserAdminSchema.shape.type.options[0],
                    status: UserAdminSchema.shape.status.options[0],
                    createdAt: new Date(0).toISOString(),
                    lastLogin: undefined,
                };

                return (
                    <div className="flex items-center gap-2 py-0.5 min-w-[200px]">
                        <Avatar className="h-9 w-9 flex-shrink-0">
                            <AvatarFallback>{post.authorName.split(' ').map(n=>n[0]).join('').toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col gap-0.5">
                            <UserTableCellViewer
                                item={authorPlaceholder}
                                onUpdate={() => {
                                    toast.info("Author details are managed in the Users section.");
                                }}
                            />
                            <span className="text-xs text-muted-foreground">ID: {post.authorId}</span>
                        </div>
                    </div>
                );
            },
        },
        {
            accessorKey: "category",
            header: ({ column }) => <DataTableColumnHeader column={column} title="Category" />,
            cell: ({ row }) => <Badge variant="outline" className="text-xs">{row.original.category}</Badge>,
        },
        {
            accessorKey: "status",
            header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
            cell: ({ row }) => {
                const status = row.original.status;
                let icon: React.ReactNode;
                let variant: "default" | "secondary" | "outline" | "destructive" = "secondary";

                switch (status) {
                    case "Published": icon = <CheckCircle2Icon className="size-3.5 text-green-500" />; variant = "default"; break;
                    case "Draft": icon = <EditIcon className="size-3.5 text-blue-500" />; variant = "secondary"; break;
                    case "Pending Review": icon = <HourglassIcon className="size-3.5 text-amber-500" />; variant = "outline"; break;
                    case "Archived": icon = <ArchiveIcon className="size-3.5 text-slate-500" />; variant = "outline"; break;
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
            accessorKey: "publishedAt",
            header: ({ column }) => <DataTableColumnHeader column={column} title="Published" />,
            cell: ({ row }) => row.original.publishedAt ?
                <div className="text-xs text-muted-foreground min-w-[64px]">{new Date(row.original.publishedAt).toLocaleDateString()}</div> :
                <span className="text-xs text-muted-foreground/70">Not published</span>,
        },
        {
            accessorKey: "updatedAt",
            header: ({ column }) => <DataTableColumnHeader column={column} title="Last Updated" />,
            cell: ({ row }) => <div className="text-xs text-muted-foreground min-w-[64px]">{new Date(row.original.updatedAt).toLocaleDateString()}</div>,
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
                                        toast.info(`View/Edit \"${post.title}\" (use title link or add programmatic open)`);
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
                                                      onSelect={() => handleDeletePost(post.id, post.title)}>
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
                <CreatePostSheet onCreate={handleCreatePost} currentAuthor={currentMockUser}/>
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

