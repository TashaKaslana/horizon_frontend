"use client";

import React from "react";
import {
    CheckCircle2Icon,
    LoaderIcon,
    Trash2Icon,
    ShieldQuestionIcon,
    FileTextIcon,
    MessageSquareIcon,
    UserIcon,
    AlertTriangleIcon,
    ShieldCheckIcon,
    ShieldXIcon,
} from "lucide-react";
import {toast} from "sonner";
import {z} from "zod";

import {Button} from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {DataTable} from "@/components/ui/data-table";
import {
    ModerationItemData,
    ModerationStatus,
    generateMockModerationItem,
    ModerationItemTypeSchema,
    ModerationStatusSchema
} from "./moderation-schema";
import {PostSchema} from '../../posts/all/post-schema';
import {UserAdminSchema} from '../../users/all/user-admin-table';
import {Input} from "@/components/ui/input";
import {getModerationTableColumns} from "@/app/admin/moderation/all/moderation-table-columns";
import {CommentAdminSchema} from "@/app/admin/comments/all/comment-admin-table";

const mockPostForModeration = (id: string, title: string): z.infer<typeof PostSchema> => ({
    id, title, content: `Content for ${title}`, authorId: `user-${id}`, authorName: `Author ${id}`,
    category: "Technology", status: "Published", createdAt: new Date().toISOString(), viewCount: 100,
    description: `Description for ${title}`, tags: [],
    updatedAt: new Date().toISOString(),
});

const mockCommentForModeration = (id: string, content: string): z.infer<typeof CommentAdminSchema> => ({
    id, content, authorId: `user-${id}`, authorName: `User ${id}`, authorUsername: `user${id}`,
    authorEmail: `user${id}@example.com`, postId: `post-${id}`, postTitle: `Post Title ${id}`,
    status: "Approved", createdAt: new Date().toISOString(),
});

const mockUserForModeration = (id: string, name: string): z.infer<typeof UserAdminSchema> => ({
    id, name, username: name.toLowerCase(), email: `${name.toLowerCase()}@example.com`,
    type: "Viewer", status: "Active", createdAt: new Date().toISOString(),
    profileImage: undefined,
    bio: undefined,
    location: undefined,
    website: undefined,
    lastLogin: undefined,
    role: 'User',
    emailVerified: true,
    postsCount: 0,
    commentsCount: 0,
    followersCount: 0,
    followingCount: 0,
});

const mockModerationData: ModerationItemData[] = [
    generateMockModerationItem("mod001", "post001", "Post", "Pending", 1, mockPostForModeration("post001", "A Post Needing Review")),
    generateMockModerationItem("mod002", "cmt002", "Comment", "Reviewed_Approved", 2, mockCommentForModeration("cmt002", "This comment is fine.")),
    generateMockModerationItem("mod003", "usr003", "User", "ActionTaken_UserWarned", 3, mockUserForModeration("usr003", "WarnedUser123")),
    generateMockModerationItem("mod004", "post004", "Post", "Reviewed_Rejected", 0, mockPostForModeration("post004", "Inappropriate Post Content")),
    generateMockModerationItem("mod005", "cmt005", "Comment", "Pending", 1, mockCommentForModeration("cmt005", "Questionable comment content here.")),
    generateMockModerationItem("mod006", "usr006", "User", "Pending", 0, mockUserForModeration("usr006", "NewUserReport")),
    generateMockModerationItem("mod007", "post007", "Post", "ActionTaken_ContentRemoved", 5, mockPostForModeration("post007", "Removed Post due to violations")),
    generateMockModerationItem("mod008", "usr008", "User", "ActionTaken_UserBanned", 10, mockUserForModeration("usr008", "BannedUserAccount")),
    generateMockModerationItem("mod009", "cmt009", "Comment", "Resolved", 4, mockCommentForModeration("cmt009", "This was a misunderstanding.")),
];

ModerationStatusSchema.options.map(status => ({
    value: status,
    label: status.replace(/_/g, ' '),
    icon: (() => {
        switch (status) {
            case "Pending":
                return LoaderIcon;
            case "Reviewed_Approved":
                return ShieldCheckIcon;
            case "Reviewed_Rejected":
                return ShieldXIcon;
            case "ActionTaken_ContentRemoved":
            case "ActionTaken_UserWarned":
            case "ActionTaken_UserBanned":
                return AlertTriangleIcon;
            case "Resolved":
                return CheckCircle2Icon;
            default:
                return ShieldQuestionIcon;
        }
    })()
}));

ModerationItemTypeSchema.options.map(type => ({
    value: type,
    label: type,
    icon: (() => {
        switch (type) {
            case "Post":
                return FileTextIcon;
            case "Comment":
                return MessageSquareIcon;
            case "User":
                return UserIcon;
            default:
                return ShieldQuestionIcon;
        }
    })()
}));

export function ModerationTable() {
    const [data, setData] = React.useState<ModerationItemData[]>(() => mockModerationData);
    const [rowSelection, setRowSelection] = React.useState<any>({});
    const [columnFilters, setColumnFilters] = React.useState<any[]>([]);


    const handleUpdateStatus = React.useCallback((itemIds: string[], newStatus: ModerationStatus) => {
        setData(currentData =>
            currentData.map(item =>
                itemIds.includes(item.id) ? {...item, status: newStatus, updatedAt: new Date().toISOString()} : item
            )
        );
        toast.success(`Selected item(s) status updated to ${newStatus.replace(/_/g, ' ')}`);
    }, []);

    const handleDeleteModerationEntries = React.useCallback((itemIds: string[]) => {
        setData(prev => prev.filter(item => !itemIds.includes(item.id)));
        toast.error(`${itemIds.length} moderation entr${itemIds.length > 1 ? 'ies' : 'y'} removed.`);
        setRowSelection({});
    }, []);

    const columns = getModerationTableColumns({
        onUpdateStatusAction: handleUpdateStatus,
        onDeleteEntriesAction: handleDeleteModerationEntries
    });
    const selectedRowIds = () => Object.keys(rowSelection).filter(key => rowSelection[key]);

    return (
        <div className="space-y-4 p-4">
            <div className="flex items-center justify-between gap-2">
                <Input
                    placeholder="Filter reports by item, reporter, reason..."
                    value={(columnFilters.find(f => f.id === 'itemPreview')?.[0] as string) ?? ''}
                    onChange={(event) => {
                        const newFilters = columnFilters.filter(f => f.id !== 'itemPreview');
                        if (event.target.value) {
                            newFilters.push({id: 'itemPreview', value: event.target.value});
                        }
                        setColumnFilters(newFilters);
                        toast.info("Global text search needs TanStack Table's globalFilter setup.")
                    }}
                    className="h-9 max-w-sm"
                />
            </div>
            <DataTable
                columns={columns}
                data={data}
                setData={setData}
                enableDnd={true}
                enableRowSelection={true}
                columnFilters={columnFilters}
                filterPlaceholder="Search user, post, comment reports..."
            />
            {selectedRowIds().length > 0 && (
                <div className="fixed bottom-4 right-4 z-50 rounded-md border bg-background p-3 shadow-lg">
                    <p className="mb-2 text-sm font-medium">
                        {selectedRowIds().length} item(s) selected.
                    </p>
                    <div className="flex flex-wrap gap-2">
                        <Button size="sm" variant="outline"
                                onClick={() => handleDeleteModerationEntries(selectedRowIds())}>
                            <Trash2Icon className="mr-2 h-4 w-4"/> Delete Selected Reports
                        </Button>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button size="sm" variant="outline">
                                    <ShieldQuestionIcon className="mr-2 h-4 w-4"/> Change Status
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                {ModerationStatusSchema.options.map(status => (
                                    <DropdownMenuItem key={status}
                                                      onSelect={() => handleUpdateStatus(selectedRowIds(), status)}>
                                        {status.replace(/_/g, ' ')}
                                    </DropdownMenuItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            )}
        </div>
    );
}


