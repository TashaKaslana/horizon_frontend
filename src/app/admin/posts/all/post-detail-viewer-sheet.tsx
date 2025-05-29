"use client";

import React from "react";
import {toast} from "sonner";
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

import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
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
    SheetTrigger,
} from "@/components/ui/sheet";
import {Separator} from "@/components/ui/separator";
import {Badge} from "@/components/ui/badge";
import {PostData, PostStatusEnum, PostCategoryEnum, PostFormData, PostDataWithMetadata} from "./post-schema";
import {PostSchema} from "@/schemas/post-schema";
import Image from "next/image";
import {usePostsManagement} from "@/app/admin/posts/all/hooks/usePostsManagement";
import usePostsStore from "@/app/admin/posts/all/stores/usePostsStore";

interface PostDetailViewerSheetProps {
    postId?: string,
    postCaption?: string,
    onUpdateAction: (updatedPost: Partial<PostData>) => void,
    children?: React.ReactNode,
    postDescription?: string
}

export const PostDetailViewerSheet: React.FC<PostDetailViewerSheetProps> = ({
                                                                                postId,
                                                                                postCaption,
                                                                                onUpdateAction,
                                                                                children,
                                                                                postDescription
                                                                            }) => {
        const [post, setPost] = React.useState<PostDataWithMetadata>({} as PostDataWithMetadata);
        const [isEditing, setIsEditing] = React.useState(false);
        const [formData, setFormData] = React.useState<PostFormData>({
            ...post,
            tagsInput: post.tags?.join(", ") || "",
        });
        const [errors, setErrors] = React.useState<Partial<Record<keyof PostFormData, string>>>({});
        const [isSubmitting, setIsSubmitting] = React.useState(false);
        const {actions} = usePostsStore()
        const {selectedPostData} = usePostsManagement(postId)
        const [isShowing, setIsShowing] = React.useState(false);

        React.useEffect(() => {
            if (!postId) {
                toast.error("No post ID provided.");
                throw new Error("No post ID provided.");
            } else {
                if (selectedPostData?.data && isShowing) {
                    actions.setSelectedPost(selectedPostData?.data);
                    setPost(selectedPostData?.data)
                }
            }
        }, [actions, isShowing, postId, selectedPostData?.data]);


        React.useEffect(() => {
            setFormData({
                ...post,
                tagsInput: post.tags?.join(", ") || "",
            });
            setIsEditing(false);
            setErrors({});
        }, [post]);

        const handleChange = (
            e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
        ) => {

            const {name, value} = e.target;
            setFormData((prev) => ({...prev, [name]: value}));
            if (errors[name as keyof PostFormData]) {
                setErrors(prev => ({...prev, [name]: undefined}));
            }
        };
        const handleSelectChange = (name: keyof PostFormData) => (value: string) => {
            setFormData((prev) => ({...prev, [name]: value}));
            if (errors[name as keyof PostFormData]) {
                setErrors(prev => ({...prev, [name]: undefined}));
            }
        };

        const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            setErrors({});
            setIsSubmitting(true);

            // Construct the object to be validated and submitted based on PostSchema
            const postToSubmit: Partial<PostData> = {
                ...event.target,
                tags: formData.tagsInput?.split(",").map((t) => t.trim()).filter(Boolean) || [],
            }

            const validationResult = PostSchema.partial().safeParse(postToSubmit);

            if (!validationResult.success) {
                const fieldErrors: Partial<Record<keyof PostFormData, string>> = {};
                validationResult.error.errors.forEach(err => {
                    if (err.path.length > 0) {
                        const fieldName = err.path[0] as keyof PostFormData;
                        fieldErrors[fieldName] = err.message;
                    }
                });
                setErrors(fieldErrors);
                toast.error("Please correct the highlighted errors.");
                setIsSubmitting(false);
                return;
            }

            // Ensure we're only passing data that's part of PostData
            const validatedDataForAction = validationResult.data as Partial<PostData>;


            const updatePromise = new Promise((resolve) => setTimeout(resolve, 700))
                .then(() => {
                    onUpdateAction(validatedDataForAction);
                });

            toast.promise(updatePromise, {
                loading: `Updating "${formData.caption}"...`,
                success: () => {
                    setIsEditing(false);
                    return `"${formData.caption}" updated successfully!`;
                },
                error: "Error updating post.",
                finally: () => setIsSubmitting(false)
            });
        };

        const renderInfoField = (label: string, value: string | number | undefined, icon?: React.ReactNode) => (
            value !== undefined && value !== null && value !== '' ? <div className="flex items-start gap-2">
                {icon || <div className="w-4 h-4"/>} {/* Adjusted icon placeholder size */}
                <div>
                    <span className="font-medium text-muted-foreground">{label}:</span> {String(value)}
                </div>
            </div> : null
        );

        if (!post || !postId) {
            return (
                <div className="flex items-center justify-center h-full">
                    <p className="text-muted-foreground">No post selected.</p>
                </div>
            );
        }

        return (
            <Sheet onOpenChange={(open) => {
                if (!open) setIsEditing(false);
                setIsShowing(open);
            }}
                   open={isShowing}>
                <SheetTrigger asChild>
                    {children || (
                        <div >
                            <Button
                                variant="link"
                                className="w-fit px-0 py-0 h-fit text-left font-medium text-foreground hover:text-primary hover:no-underline whitespace-normal truncate"
                            >
                                {postCaption ? postCaption : post.caption}
                            </Button>
                            <p className={'text-muted-foreground truncate'}>
                                {postDescription ? postDescription : post.description ? post.description : "No description provided."}
                            </p>
                        </div>
                    )}
                </SheetTrigger>
                <SheetContent side="right" className="flex flex-col w-full sm:max-w-xl md:max-w-2xl px-2">
                    <SheetHeader className="pb-4">
                        <div className="flex justify-between items-start">
                            <div>
                                <SheetTitle className="text-2xl">{isEditing ? "Edit Post" : post.caption}</SheetTitle>
                                <SheetDescription>
                                    {isEditing ? "Modify the details of the post." : post.description ? post.description : "No description provided."}
                                </SheetDescription>
                            </div>
                            {!isEditing && (
                                <Button onClick={() => setIsEditing(true)} variant="outline" size="sm">Edit Post</Button>
                            )}
                        </div>
                    </SheetHeader>
                    <Separator/>

                    {isEditing ? (
                        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto py-4 space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <Label htmlFor="edit-caption">caption</Label>
                                    <Input id="edit-caption" name="caption" value={formData.caption} onChange={handleChange}
                                           disabled={isSubmitting}/>
                                    {errors.caption && <p className="text-xs text-red-500">{errors.caption}</p>}
                                </div>
                                <div className="space-y-1.5">
                                    <Label htmlFor="edit-description">Description (Optional)</Label>
                                    <Input id="edit-description" name="description" value={formData.description || ''}
                                           onChange={handleChange} disabled={isSubmitting}/>
                                    {errors.description && <p className="text-xs text-red-500">{errors.description}</p>}
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <Label htmlFor="edit-categoryName">categoryName</Label>
                                    <Select name="categoryName" value={formData.categoryName}
                                            onValueChange={handleSelectChange('categoryName')} disabled={isSubmitting}>
                                        <SelectTrigger id="edit-categoryName"><SelectValue
                                            placeholder="Select categoryName"/></SelectTrigger>
                                        <SelectContent>
                                            {PostCategoryEnum.options.map(cat => <SelectItem key={cat}
                                                                                             value={cat}>{cat}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                    {errors.categoryName && <p className="text-xs text-red-500">{errors.categoryName}</p>}
                                </div>
                                <div className="space-y-1.5">
                                    <Label htmlFor="edit-status">Status</Label>
                                    <Select name="status" value={formData.status}
                                            onValueChange={handleSelectChange('status')} disabled={isSubmitting}>
                                        <SelectTrigger id="edit-status"><SelectValue
                                            placeholder="Select status"/></SelectTrigger>
                                        <SelectContent>
                                            {PostStatusEnum.options.map(stat => <SelectItem key={stat}
                                                                                            value={stat}>{stat}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                    {errors.status && <p className="text-xs text-red-500">{errors.status}</p>}
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <Label htmlFor="edit-tagsInput">Tags (comma-separated)</Label>
                                <Input id="edit-tagsInput" name="tagsInput" value={formData.tagsInput}
                                       onChange={handleChange} placeholder="e.g., tech, news" disabled={isSubmitting}/>
                                {errors.tagsInput && <p className="text-xs text-red-500">{errors.tagsInput}</p>}
                            </div>
                            <div className="space-y-1.5">
                                <Label htmlFor="edit-videoThumbnailUrl">Featured Image URL</Label>
                                <Input id="edit-videoThumbnailUrl" name="videoThumbnailUrl"
                                       value={formData.videoThumbnailUrl || ""} onChange={handleChange}
                                       placeholder="https://example.com/image.png" disabled={isSubmitting}/>
                                {errors.videoThumbnailUrl &&
                                    <p className="text-xs text-red-500">{errors.videoThumbnailUrl}</p>}
                            </div>
                            <div className="space-y-1.5">
                                <Label htmlFor="edit-updatedAt">Published Date (Optional)</Label>
                                <Input id="edit-updatedAt" name="updatedAt" type="datetime-local"
                                       value={formData.updatedAt ? new Date(formData.updatedAt).toISOString().substring(0, 16) : ""}
                                       onChange={(e) => {
                                           const dateVal = e.target.value ? new Date(e.target.value).toISOString() : undefined;
                                           setFormData(prev => ({...prev, updatedAt: dateVal ?? ''}));
                                           if (errors.updatedAt) {
                                               setErrors(prevErrors => ({...prevErrors, updatedAt: undefined}));
                                           }
                                       }} disabled={isSubmitting}/>
                                {errors.updatedAt && <p className="text-xs text-red-500">{errors.updatedAt}</p>}
                            </div>

                            <SheetFooter className="mt-auto flex flex-col-reverse sm:flex-row sm:justify-end gap-2 pt-6">
                                <Button type="button" variant="outline" onClick={() => setIsEditing(false)}
                                        disabled={isSubmitting}>
                                    <XIcon className="mr-2 h-4 w-4"/> Cancel
                                </Button>
                                <Button type="submit" disabled={isSubmitting}>
                                    {isSubmitting ? <Loader2Icon className="mr-2 h-4 w-4 animate-spin"/> :
                                        <SaveIcon className="mr-2 h-4 w-4"/>}
                                    Save Changes
                                </Button>
                            </SheetFooter>
                        </form>
                    ) : (
                        <div className="flex-1 overflow-y-auto py-4 space-y-5 text-sm pr-2">
                            {post.videoThumbnailUrl && (
                                <div className="mb-4 relative w-full aspect-video">
                                    <Image
                                        src={post.videoThumbnailUrl}
                                        alt={post.caption}
                                        className="rounded-md object-cover"
                                        fill
                                    />
                                </div>
                            )}
                            <Separator/>
                            <div className="space-y-3">
                                {renderInfoField("Author", post.user?.displayName, <UserCircleIcon
                                    className="h-4 w-4 text-muted-foreground"/>)}
                                {renderInfoField("Category", post.categoryName, <TagIcon
                                    className="h-4 w-4 text-muted-foreground"/>)}
                                {renderInfoField("Status", post.status, <CheckIcon
                                    className="h-4 w-4 text-muted-foreground"/>)}
                                {renderInfoField("Views", post?.views ?? 0, <EyeIcon
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
                                {renderInfoField("Created", new Date(post.createdAt).toLocaleString(), <CalendarDaysIcon
                                    className="h-3.5 w-3.5"/>)}
                                {renderInfoField("Last Updated", new Date(post.updatedAt).toLocaleString(),
                                    <CalendarDaysIcon className="h-3.5 w-3.5"/>)}
                                {post.updatedAt && renderInfoField("Published", new Date(post.updatedAt).toLocaleString(),
                                    <CalendarDaysIcon className="h-3.5 w-3.5"/>)}
                            </div>
                            <SheetFooter className="mt-auto pt-6">
                                <SheetClose asChild>
                                    <Button variant="outline" className="w-full sm:w-auto">Close</Button>
                                </SheetClose>
                            </SheetFooter>
                        </div>
                    )}
                </SheetContent>
            </Sheet>
        );
    }
;