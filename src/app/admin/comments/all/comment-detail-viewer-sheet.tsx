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
import { CommentAdminData } from "./comment-admin-table"; // Adjust path as necessary
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageSquareIcon, UserIcon, FileTextIcon, CalendarIcon, TagIcon, Edit3Icon, ShieldAlertIcon } from "lucide-react";

interface CommentDetailViewerSheetProps {
    comment: CommentAdminData;
    children: React.ReactNode; // To use as SheetTrigger
    onUpdate?: (updatedComment: Partial<CommentAdminData>) => void; // Optional: for future edit functionality
}

export function CommentDetailViewerSheet({
    comment,
    children,
    onUpdate,
}: CommentDetailViewerSheetProps) {
    const handleEdit = () => {
        // Placeholder for edit functionality
        console.log("Edit comment:", comment.id);
        // Example: onUpdate?.({ ...comment, content: "Updated content" });
    };

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
                                    <AvatarImage src={comment.authorProfileImage} alt={comment.authorName} />
                                    <AvatarFallback>{comment.authorName.split(' ').map(n => n[0]).join('').toUpperCase()}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="font-medium">{comment.authorName} <span className="text-xs text-muted-foreground">(@{comment.authorUsername})</span></p>
                                    <p className="text-xs text-muted-foreground">{comment.authorEmail}</p>
                                    <p className="text-xs text-muted-foreground">Author ID: {comment.authorId}</p>
                                </div>
                            </div>
                        </div>

                        <Separator />

                        {/* Post Section */}
                        <div className="space-y-2">
                            <h4 className="text-sm font-semibold text-muted-foreground flex items-center gap-1.5">
                                <FileTextIcon className="size-4" /> Related Post
                            </h4>
                            <p className="text-sm font-medium">{comment.postTitle}</p>
                            <p className="text-xs text-muted-foreground">Post ID: {comment.postId}</p>
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
                                {onUpdate && (
                                    <Button variant="default" size="sm" onClick={handleEdit} className="gap-1.5">
                                        <Edit3Icon className="size-4" />
                                        Edit Comment
                                    </Button>
                                )}
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

