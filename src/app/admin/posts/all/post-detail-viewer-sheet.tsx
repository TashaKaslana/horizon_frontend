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
import {postData} from "@/app/admin/components/mockData"; // Adjust path as needed

interface PostDetailViewerSheetProps {
    postId: string
    onUpdateAction: (updatedPost: Partial<PostData>) => void;
    children?: React.ReactNode;
}

export const PostDetailViewerSheet: React.FC<PostDetailViewerSheetProps> = ({
                                                                                postId,
                                                                                onUpdateAction,
                                                                                children,
                                                                            }) => {
    const [post, setPost] = React.useState<PostDataWithMetadata>({} as PostDataWithMetadata);
    const [isEditing, setIsEditing] = React.useState(false);
    const [formData, setFormData] = React.useState<PostFormData>({
        ...post,
        tagsInput: post.tags?.join(", ") || "",
    });
    const [errors, setErrors] = React.useState<Partial<Record<keyof PostFormData, string>>>({});
    const [isSubmitting, setIsSubmitting] = React.useState(false);


    React.useEffect(() => {
        setPost({...postData, id: postId, views: 0, likes: 0, comments: 0});
    }, [postId]);

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


    return (
        <Sheet onOpenChange={(open) => {
            if (!open) setIsEditing(false);
        }}>
            <SheetTrigger asChild>
                {children || (
                    <Button
                        variant="link"
                        className="w-fit px-0 py-0 h-fit text-left font-medium text-foreground hover:text-primary hover:no-underline whitespace-normal"
                    >
                        {post.caption}
                    </Button>
                )}
            </SheetTrigger>
            <SheetContent side="right" className="flex flex-col w-full sm:max-w-xl md:max-w-2xl">
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
                    <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto py-4 space-y-4 pr-2">
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
                            <div className="mb-4">
                                <img src={post.videoThumbnailUrl} alt={post.caption}
                                     className="rounded-md max-h-80 w-full object-cover"/>
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
};