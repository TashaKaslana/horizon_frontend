"use client";

import React from "react";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetDescription,
    SheetFooter,
    SheetClose, SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { CommentAdminData } from "./comment-admin-table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageSquareIcon, UserIcon, FileTextIcon, CalendarIcon, TagIcon, Edit3Icon, ShieldAlertIcon } from "lucide-react";
import {commentData} from "@/app/admin/components/mockData";
// import { useQuery } from "@tanstack/react-query"; // Example import for TanStack Query

interface CommentDetailViewerSheetProps {
    commentId: string; // Changed: Expect commentId instead of full comment object
    children: React.ReactNode;
    // Removed onUpdate prop
}

// Placeholder: Replace with your actual fetch function
// const fetchCommentById = async (commentId: string): Promise<CommentAdminData> => {
//     // Example: return apiClient.get(`/api/comments/${commentId}`);
//     // For demonstration, returning a mock. Replace with actual API call.
//     console.log(`Fetching comment with ID: ${commentId}`);
//     return new Promise(resolve => setTimeout(() => resolve({
//         id: commentId,
//         content: "This is a fetched comment content.",
//         authorId: "author-123",
//         authorName: "Fetched Author",
//         authorUsername: "fetchedauthor",
//         authorEmail: "fetched@example.com",
//         authorProfileImage: "https://avatar.vercel.sh/fetched.png",
//         postId: "post-456",
//         postTitle: "Fetched Post Title",
//         status: "Approved",
//         createdAt: new Date().toISOString(),
//         updatedAt: null,
//     } as CommentAdminData), 1000));
// };

export function CommentDetailViewerSheet({
    commentId,
    children,
}: CommentDetailViewerSheetProps) {
    // const { data: comment, isLoading, isError, error } = useQuery<CommentAdminData, Error>(
    //     ['comment', commentId],
    //     () => fetchCommentById(commentId),
    //     { enabled: !!commentId } // Only run query if commentId is available
    // );

    // Placeholder data and states until TanStack Query is fully implemented
    // Replace these with actual data from useQuery
    const isLoading = false; // Example: replace with query.isLoading
    const isError = false;   // Example: replace with query.isError
    const error = null;      // Example: replace with query.error
    const comment: CommentAdminData | undefined = commentData;
    // End of placeholder data

    const handleEdit = () => {
        // Placeholder for edit functionality
        // This would likely involve opening a modal/form or navigating,
        // and then re-fetching or updating the cache via TanStack Query.
        console.log("Edit comment action for ID:", commentId);
        // Example: onUpdate?.({ ...comment, content: "Updated content" }); // onUpdate is removed
    };

    if (isLoading) {
        return (
            <Sheet>
                <SheetTrigger asChild>{children}</SheetTrigger>
                <SheetContent className="sm:max-w-lg w-[90vw] p-0">
                    <SheetHeader className="p-6 border-b">
                        <SheetTitle>Loading Comment...</SheetTitle>
                    </SheetHeader>
                    <div className="p-6">Loading details...</div>
                </SheetContent>
            </Sheet>
        );
    }

    if (isError || !comment) {
        return (
            <Sheet>
                <SheetTrigger asChild>{children}</SheetTrigger>
                <SheetContent className="sm:max-w-lg w-[90vw] p-0">
                    <SheetHeader className="p-6 border-b">
                        <SheetTitle>Error</SheetTitle>
                    </SheetHeader>
                    <div className="p-6">
                        {isError && error ? (error as any).message : "Comment not found or failed to load."}
                    </div>
                </SheetContent>
            </Sheet>
        );
    }

    return (
        <Sheet>
            <SheetTrigger>
                {children}
            </SheetTrigger>
            <SheetContent className="sm:max-w-lg w-[90vw] p-0">
                <ScrollArea className="h-full">
                    <SheetHeader className="p-6 border-b">
                        <SheetTitle className="flex items-center gap-2">
                            <MessageSquareIcon className="size-5" />
                            Comment Details
                        </SheetTitle>
                        <SheetDescription>
                            Viewing details for comment ID: {comment.id}
                        </SheetDescription>
                    </SheetHeader>

                    <div className="p-6 space-y-6">
                        {/* Content Section */}
                        <div className="space-y-2">
                            <h4 className="text-sm font-semibold text-muted-foreground">Comment Content</h4>
                            <div className="p-3 bg-muted/50 rounded-md border text-sm whitespace-pre-wrap break-words">
                                {comment.content}
                            </div>
                        </div>

                        <Separator />

                        {/* Author Section */}
                        <div className="space-y-3">
                            <h4 className="text-sm font-semibold text-muted-foreground flex items-center gap-1.5">
                                <UserIcon className="size-4" /> Author
                            </h4>
                            <div className="flex items-center gap-3">
                                <Avatar className="h-12 w-12">
                                    <AvatarImage src={comment.user.profileImage} alt={comment.user.profileImage} />
                                    <AvatarFallback>{comment.user.displayName.split(' ').map(n => n[0]).join('').toUpperCase()}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="font-medium">{comment.user.displayName} <span className="text-xs text-muted-foreground">(@{comment.user.username})</span></p>
                                    {/*<p className="text-xs text-muted-foreground">{comment.user.email}</p>*/}
                                    <p className="text-xs text-muted-foreground">Author ID: {comment.user.id}</p>
                                </div>
                            </div>
                        </div>

                        <Separator />

                        {/* Post Section */}
                        <div className="space-y-2">
                            <h4 className="text-sm font-semibold text-muted-foreground flex items-center gap-1.5">
                                <FileTextIcon className="size-4" /> Related Post
                            </h4>
                            <p className="text-sm font-medium">{comment.post.caption}</p>
                            <p className="text-xs text-muted-foreground">Post ID: {comment.post.id}</p>
                            {/* Future: Could add a button to navigate to post management page */}
                        </div>

                        <Separator />

                        {/* Status & Timestamps Section */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <h4 className="text-sm font-semibold text-muted-foreground flex items-center gap-1.5">
                                    <TagIcon className="size-4" /> Status
                                </h4>
                                <Badge variant={
                                    comment.status === "Approved" ? "default" :
                                    comment.status === "Pending" ? "outline" :
                                    comment.status === "Spam" || comment.status === "Rejected" ? "destructive" : "secondary"
                                } className="text-xs">
                                    {comment.status}
                                </Badge>
                            </div>
                            <div className="space-y-1">
                                <h4 className="text-sm font-semibold text-muted-foreground flex items-center gap-1.5">
                                    <CalendarIcon className="size-4" /> Submitted At
                                </h4>
                                <p className="text-xs">{new Date(comment.createdAt).toLocaleString()}</p>
                            </div>
                            {comment.updatedAt && (
                                <div className="space-y-1">
                                    <h4 className="text-sm font-semibold text-muted-foreground flex items-center gap-1.5">
                                        <CalendarIcon className="size-4" /> Last Updated
                                    </h4>
                                    <p className="text-xs">{new Date(comment.updatedAt).toLocaleString()}</p>
                                </div>
                            )}
                        </div>

                        {/* Future: Could add sections for edit history, moderation logs, etc. */}

                    </div>

                    <SheetFooter className="p-6 border-t mt-auto">
                        <div className="flex w-full justify-between items-center">
                            <Button variant="outline" size="sm" onClick={() => alert("Report functionality to be implemented.")} className="gap-1.5">
                                <ShieldAlertIcon className="size-4" />
                                Report
                            </Button>
                            <div className="flex gap-2">
                                {/* Edit button is kept, handleEdit would be adapted for TanStack Query flows */}
                                <Button variant="default" size="sm" onClick={handleEdit} className="gap-1.5">
                                    <Edit3Icon className="size-4" />
                                    Edit Comment
                                </Button>
                                <SheetClose asChild>
                                    <Button variant="outline" size="sm">Close</Button>
                                </SheetClose>
                            </div>
                        </div>
                    </SheetFooter>
                </ScrollArea>
            </SheetContent>
        </Sheet>
    );
}

