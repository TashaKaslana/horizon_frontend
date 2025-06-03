"use client";

import React, {useEffect} from "react";
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
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageSquareIcon, UserIcon, FileTextIcon, CalendarIcon, TagIcon, Edit3Icon, ShieldAlertIcon, Loader2Icon } from "lucide-react";
import useCommentsManagement from "@/app/admin/comments/all/hooks/useCommentsManagement";
import {CommentRespond} from "@/api/client";
import useCommentsStore from "@/app/admin/comments/all/stores/useCommentsStore";
import {formatDateTS} from "@/lib/utils";

interface CommentDetailViewerSheetProps {
    commentId: string;
    children: React.ReactNode;
    onUpdate?: (updatedComment: Partial<CommentRespond>) => void;
}

export function CommentDetailViewerSheet({
    commentId,
    children,
    onUpdate,
}: CommentDetailViewerSheetProps) {
    const { selectedCommentData, isLoading, isError, error } = useCommentsManagement(commentId);
    const {selectedComment, actions} = useCommentsStore()

    const handleEdit = () => {
        console.log("Edit comment:", selectedCommentData?.data);
    };

    useEffect(() => {
        if (selectedCommentData?.data) {
            actions.setSelectedComment(selectedCommentData.data)
        }
    }, [actions, selectedCommentData, selectedCommentData?.data]);

    if (isLoading) {
        return (
            <Sheet>
                <SheetTrigger asChild>{children}</SheetTrigger>
                <SheetContent className="sm:max-w-lg w-[90vw] p-0 flex items-center justify-center">
                    <Loader2Icon className="h-8 w-8 animate-spin text-muted-foreground" />
                </SheetContent>
            </Sheet>
        );
    }

    if (isError || !selectedComment) {
        return (
            <Sheet>
                <SheetTrigger asChild>{children}</SheetTrigger>
                <SheetContent className="sm:max-w-lg w-[90vw] p-0">
                    <SheetHeader className="p-6 border-b">
                        <SheetTitle className="flex items-center gap-2 text-destructive">
                            <ShieldAlertIcon className="size-5" />
                            Error
                        </SheetTitle>
                        <SheetDescription>
                            {error?.message || "Could not load comment details."}
                        </SheetDescription>
                    </SheetHeader>
                    <SheetFooter className="p-6 border-t mt-auto">
                        <SheetClose asChild>
                            <Button variant="outline" size="sm">Close</Button>
                        </SheetClose>
                    </SheetFooter>
                </SheetContent>
            </Sheet>
        );
    }

    return (
        <Sheet>
            <SheetTrigger asChild>
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
                            Viewing details for comment ID: {selectedComment?.id}
                        </SheetDescription>
                    </SheetHeader>

                    <div className="p-6 space-y-6">
                        <div className="space-y-2">
                            <h4 className="text-sm font-semibold text-muted-foreground">Comment Content</h4>
                            <div className="p-3 bg-muted/50 rounded-md border text-sm whitespace-pre-wrap break-words">
                                {selectedComment?.content}
                            </div>
                        </div>

                        <Separator />

                        <div className="space-y-3">
                            <h4 className="text-sm font-semibold text-muted-foreground flex items-center gap-1.5">
                                <UserIcon className="size-4" /> Author
                            </h4>
                            <div className="flex items-center gap-3">
                                <Avatar className="h-12 w-12">
                                    <AvatarImage src={selectedComment?.user?.profileImage || undefined} alt={selectedComment?.user?.displayName || 'User'} />
                                    <AvatarFallback>{selectedComment?.user?.displayName?.split(' ').map((n: string) => n[0]).join('').toUpperCase() || 'U'}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="font-medium">{selectedComment?.user?.displayName || 'N/A'} <span className="text-xs text-muted-foreground">(@{selectedComment?.user?.username || 'N/A'})</span></p>
                                    <p className="text-xs text-muted-foreground">{selectedComment?.user?.username || 'N/A'}</p>
                                    <p className="text-xs text-muted-foreground">Author ID: {selectedComment?.user?.id}</p>
                                </div>
                            </div>
                        </div>

                        <Separator />

                        <div className="space-y-2">
                            <h4 className="text-sm font-semibold text-muted-foreground flex items-center gap-1.5">
                                <FileTextIcon className="size-4" /> Related Post
                            </h4>
                            <p className="text-sm font-medium">{selectedComment?.post?.caption || 'N/A'}</p>
                            <p className="text-xs text-muted-foreground">Post ID: {selectedComment?.post?.id}</p>
                        </div>

                        <Separator />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <h4 className="text-sm font-semibold text-muted-foreground flex items-center gap-1.5">
                                    <TagIcon className="size-4" /> Status
                                </h4>
                                <Badge variant={
                                    selectedComment?.status === "APPROVED" ? "default" :
                                        selectedComment?.status === "PENDING" ? "outline" :
                                            selectedComment?.status === "SPAM" || selectedComment?.status === "REJECTED" ? "destructive" : "secondary"
                                } className="text-xs">
                                    {selectedComment?.status}
                                </Badge>
                            </div>
                            <div className="space-y-1">
                                <h4 className="text-sm font-semibold text-muted-foreground flex items-center gap-1.5">
                                    <CalendarIcon className="size-4" /> Submitted At
                                </h4>
                                <p className="text-xs">{selectedComment?.createdAt ? formatDateTS(selectedComment?.createdAt ) :  'N/A'}</p>
                            </div>
                            {selectedComment?.updatedAt && (
                                <div className="space-y-1">
                                    <h4 className="text-sm font-semibold text-muted-foreground flex items-center gap-1.5">
                                        <CalendarIcon className="size-4" /> Last Updated
                                    </h4>
                                    <p className="text-xs">{new Date(selectedComment?.updatedAt).toLocaleString()}</p>
                                </div>
                            )}
                        </div>
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

