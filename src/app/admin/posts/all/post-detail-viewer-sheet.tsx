"use client";

import React, { useEffect } from "react";
import { toast } from "sonner";
import {
    CalendarDaysIcon,
    CheckIcon,
    EyeIcon,
    Loader2Icon,
    SaveIcon,
    TagIcon,
    UserCircleIcon,
    XIcon,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { PostStatusEnum, PostCategoryEnum } from "./post-schema";
import Image from "next/image";
import { usePostsManagement } from "@/app/admin/posts/all/hooks/usePostsManagement";
import usePostsStore from "@/app/admin/posts/all/stores/usePostsStore";
import { PostAdminViewDto } from "@/api/client";
import { zPostAdminViewDto, zUpdatePostRequest } from "@/api/client/zod.gen";
import { formatDateTS } from "@/lib/utils";

const editablePostSchema = zPostAdminViewDto.pick({
    caption: true,
    description: true,
    category: true,
    status: true,
    videoThumbnailUrl: true,
    visibility: true,
}).partial().extend({
    tags: z.array(z.string()).optional(),
    categoryName: z.string().optional().default(""),
});

type EditablePostFormValues = z.infer<typeof editablePostSchema>;

interface PostDetailViewerSheetProps {
    postId?: string,
    isOpen: boolean,
    onSetIsOpenAction?: (value: boolean) => void
}

export const PostDetailViewerSheet: React.FC<PostDetailViewerSheetProps> = ({
    postId,
    isOpen = false,
    onSetIsOpenAction
}) => {
    const [post, setPostData] = React.useState<PostAdminViewDto | null>(null);
    const [isEditing, setIsEditing] = React.useState(false);
    const { actions: postStoreActions } = usePostsStore();
    const { selectedPostData, updatePost, isUpdatingPost, isSelectedPostLoading } = usePostsManagement(postId);

    const form = useForm<EditablePostFormValues>({
        resolver: zodResolver(editablePostSchema),
        defaultValues: {
            caption: "",
            description: "",
            categoryName: "",
            status: "DRAFT",
            tags: [],
            videoThumbnailUrl: "",
            visibility: "PUBLIC",
        },
    });

    useEffect(() => {
        if (isOpen && postId) {
            if (selectedPostData?.data) {
                const fetchedPost = selectedPostData.data as PostAdminViewDto;
                setPostData(fetchedPost);
                postStoreActions.setSelectedPost(fetchedPost);
                form.reset({
                    caption: fetchedPost.caption || "",
                    description: fetchedPost.description || "",
                    categoryName: fetchedPost.category?.name || "",
                    status: fetchedPost.status || "DRAFT",
                    tags: fetchedPost.tags || [],
                    videoThumbnailUrl: fetchedPost.videoThumbnailUrl || "",
                    visibility: fetchedPost.visibility || "PUBLIC",
                });
            }
        } else if (!isOpen) {
            setPostData(null);
            setIsEditing(false);
            form.reset({
                caption: "", description: "", categoryName: "", status: "DRAFT", tags: [], videoThumbnailUrl: "", visibility: "PUBLIC",
            });
        }
    }, [isOpen, postId, selectedPostData?.data, postStoreActions, form]);

    useEffect(() => {
        if (post) {
            form.reset({
                caption: post.caption || "",
                description: post.description || "",
                categoryName: post.category?.name || "",
                status: post.status || "DRAFT",
                tags: post.tags || [],
                videoThumbnailUrl: post.videoThumbnailUrl || "",
                visibility: post.visibility || "PUBLIC",
            });
        } else {
            form.reset({
                caption: "", description: "", categoryName: "", status: "DRAFT", tags: [], videoThumbnailUrl: "", visibility: "PUBLIC",
            });
        }
    }, [post, form]);

    const onSubmit = async (values: EditablePostFormValues) => {
        if (!post || !post.id) {
            toast.error("Cannot update post without an ID.");
            return;
        }

        const payloadForUpdate = {
            caption: values.caption,
            description: values.description,
            categoryName: values.categoryName,
            status: values.status,
            tags: values.tags || [],
            videoThumbnailUrl: values.videoThumbnailUrl,
            visibility: values.visibility,
        };

        try {
            const validatedPayload = zUpdatePostRequest.parse(payloadForUpdate);

            await updatePost(post.id, validatedPayload);
            toast.success(`"${values.caption || post.caption}" updated successfully!`);
            setIsEditing(false);
        } catch (error) {
            if (error instanceof z.ZodError) {
                toast.error("Validation error. Please review your input.");
                console.error("Zod validation error for UpdatePostRequest:", error.flatten());
            } else {
                console.error("Update post error:", error);
            }
        }
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
        if (post) {
            form.reset({
                caption: post.caption || "",
                description: post.description || "",
                categoryName: post.category?.name || "",
                status: post.status || "DRAFT",
                tags: post.tags || [],
                videoThumbnailUrl: post.videoThumbnailUrl || "",
                visibility: post.visibility || "PUBLIC",
            });
        }
    };

    const renderInfoField = (label: string, value: string | number | undefined | Date, icon?: React.ReactNode) => (
        value !== undefined && value !== null && String(value).trim() !== '' ? <div className="flex items-start gap-2">
            {icon || <div className="w-4 h-4"/>}
            <div>
                <span className="font-medium text-muted-foreground">{label}:</span> {value instanceof Date ? formatDateTS(value) : String(value)}
            </div>
        </div> : null
    );

    if (!isOpen && !post) {
        return null;
    }
    if (isOpen && postId && !post && isSelectedPostLoading) {
        return (
            <Sheet open={isOpen} onOpenChange={(openState) => onSetIsOpenAction?.(openState)}>
                <SheetContent side="right" className="flex flex-col items-center justify-center w-full sm:max-w-xl md:max-w-2xl px-2">
                    <Loader2Icon className="h-8 w-8 animate-spin text-muted-foreground" />
                    <p>Loading post details...</p>
                </SheetContent>
            </Sheet>
        );
    }

    if (isOpen && postId && !post && !isSelectedPostLoading) {
        return (
            <Sheet open={isOpen} onOpenChange={(openState) => onSetIsOpenAction?.(openState)}>
                <SheetContent side="right" className="flex flex-col items-center justify-center w-full sm:max-w-xl md:max-w-2xl px-2">
                    <p className="text-muted-foreground">Post not found or unable to load.</p>
                    <Button onClick={() => { onSetIsOpenAction?.(false); setIsEditing(false); }} variant="outline">Close</Button>
                </SheetContent>
            </Sheet>
        );
    }

    if (!post) {
        return (
            <Sheet open={isOpen} onOpenChange={(openState) => {
                if (!openState) setIsEditing(false);
                onSetIsOpenAction?.(openState);
            }}>
                <SheetContent side="right" className="flex flex-col items-center justify-center w-full sm:max-w-xl md:max-w-2xl px-2">
                    <p className="text-muted-foreground">No post selected or available.</p>
                    <Button onClick={() => { onSetIsOpenAction?.(false); setIsEditing(false); }} variant="outline">Close</Button>
                </SheetContent>
            </Sheet>
        );
    }

    return (
        <Sheet
            open={isOpen}
            onOpenChange={(openState) => {
                if (!openState) {
                    setIsEditing(false);
                }
                onSetIsOpenAction?.(openState);
            }}
        >
            <SheetContent side="right" className="flex flex-col w-full sm:max-w-xl md:max-w-2xl px-2">
                <SheetHeader className="pb-4">
                    <SheetTitle className="flex justify-between items-start">
                        <div>
                            <SheetTitle className="text-2xl">{isEditing ? "Edit Post" : post.caption || "Post Details"}</SheetTitle>
                            <SheetDescription>
                                {isEditing ? "Modify the details of the post." : post.description || "No description provided."}
                            </SheetDescription>
                        </div>
                        {!isEditing && (
                            <Button onClick={() => setIsEditing(true)} variant="outline" size="sm">Edit Post</Button>
                        )}
                    </SheetTitle>
                </SheetHeader>
                <Separator/>

                {isEditing ? (
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="flex-1 overflow-y-auto py-4 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="caption"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Caption</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Post caption" {...field} disabled={isUpdatingPost} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="description"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Description (Optional)</FormLabel>
                                            <FormControl>
                                                <Textarea placeholder="Post description" {...field} value={field.value || ""} disabled={isUpdatingPost} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="categoryName"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Category</FormLabel>
                                            <Select onValueChange={field.onChange} value={field.value || ""} disabled={isUpdatingPost}>
                                                <FormControl>
                                                    <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {PostCategoryEnum.options.map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="status"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Status</FormLabel>
                                            <Select onValueChange={field.onChange} value={field.value || ""} disabled={isUpdatingPost}>
                                                <FormControl>
                                                    <SelectTrigger><SelectValue placeholder="Select status" /></SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {PostStatusEnum.options.map(stat => <SelectItem key={stat} value={stat}>{stat}</SelectItem>)}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <FormField
                                control={form.control}
                                name="tags"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Tags</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="e.g., tech, news"
                                                {...field}
                                                value={Array.isArray(field.value) ? field.value.join(", ") : ""}
                                                onChange={(e) => field.onChange(e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag))}
                                                disabled={isUpdatingPost}
                                            />
                                        </FormControl>
                                        <FormDescription>Enter tags separated by commas.</FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="videoThumbnailUrl"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Featured Image URL</FormLabel>
                                        <FormControl>
                                            <Input placeholder="https://example.com/image.png" {...field} value={field.value || ""} disabled={isUpdatingPost} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="visibility"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Visibility</FormLabel>
                                        <Select onValueChange={field.onChange} value={field.value || "PUBLIC"} disabled={isUpdatingPost}>
                                            <FormControl>
                                                <SelectTrigger><SelectValue placeholder="Select visibility" /></SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="PUBLIC">Public</SelectItem>
                                                <SelectItem value="FRIENDS">Friends</SelectItem>
                                                <SelectItem value="PRIVATE">Private</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <SheetFooter className="mt-auto flex flex-col-reverse sm:flex-row sm:justify-end gap-2 pt-6">
                                <Button type="button" variant="outline" onClick={handleCancelEdit} disabled={isUpdatingPost}>
                                    <XIcon className="mr-2 h-4 w-4"/> Cancel
                                </Button>
                                <Button type="submit" disabled={isUpdatingPost || !form.formState.isDirty && form.formState.isSubmitted}>
                                    {isUpdatingPost ? <Loader2Icon className="mr-2 h-4 w-4 animate-spin"/> :
                                        <SaveIcon className="mr-2 h-4 w-4"/>}
                                    Save Changes
                                </Button>
                            </SheetFooter>
                        </form>
                    </Form>
                ) : (
                    <div className="flex-1 overflow-y-auto py-4 space-y-5 text-sm pr-2">
                        {post.videoThumbnailUrl && (
                            <div className="mb-4 relative w-full aspect-video">
                                <Image
                                    src={post.videoThumbnailUrl}
                                    alt={post.caption || "Post image"}
                                    className="rounded-md object-cover"
                                    fill
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                />
                            </div>
                        )}
                        <Separator/>
                        <div className="space-y-3">
                            {renderInfoField("Author", post.user?.displayName, <UserCircleIcon
                                className="h-4 w-4 text-muted-foreground"/>)}
                            {renderInfoField("Category", post.category?.name, <TagIcon
                                className="h-4 w-4 text-muted-foreground"/>)}
                            {renderInfoField("Status", post.status, <CheckIcon
                                className="h-4 w-4 text-muted-foreground"/>)}
                            {renderInfoField("Visibility", post.visibility, <EyeIcon
                                className="h-4 w-4 text-muted-foreground"/>)}
                            {renderInfoField("Views", Number(post.totalViews) ?? 0, <EyeIcon
                                className="h-4 w-4 text-muted-foreground"/>)}
                            {post.tags && post.tags.length > 0 && (
                                <div className="flex items-start gap-2">
                                    <TagIcon className="h-4 w-4 text-muted-foreground mt-0.5"/>
                                    <div>
                                        <span className="font-medium text-muted-foreground">Tags:</span>
                                        <div className="flex flex-wrap gap-1 mt-1">
                                            {post.tags.map(tag => <Badge key={tag} variant="secondary">{tag}</Badge>)}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                        <Separator/>
                        <div className="space-y-2 text-xs text-muted-foreground">
                            {renderInfoField("Created", post.createdAt ? new Date(post.createdAt) : undefined,
                                <CalendarDaysIcon className="h-3.5 w-3.5"/>)}
                            {renderInfoField("Last Updated", post.updatedAt ? new Date(post.updatedAt) : undefined,
                                <CalendarDaysIcon className="h-3.5 w-3.5"/>)}
                        </div>
                        <SheetFooter className="mt-auto pt-6">
                            <SheetClose asChild>
                                <Button variant="outline" className="w-full sm:w-auto" onClick={() => setIsEditing(false)}>Close</Button>
                            </SheetClose>
                        </SheetFooter>
                    </div>
                )}
            </SheetContent>
        </Sheet>
    );
};

