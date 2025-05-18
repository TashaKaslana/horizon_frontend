"use client";

import React from "react";
import { toast } from "sonner";
import {
    CalendarDaysIcon,
    CheckIcon,
    ImageIcon,
    Loader2Icon,
    SaveIcon,
    TagIcon,
    UserCircleIcon,
    XIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { PostData, PostSchema, PostStatusEnum, PostCategoryEnum, PostFormSchema, PostFormData } from "./post-schema"; // Adjust path as needed

interface PostDetailViewerSheetProps {
    post: PostData;
    onUpdate: (updatedPost: Partial<PostData>) => void;
    triggerElement?: React.ReactNode; // Allow custom trigger
}

export const PostDetailViewerSheet: React.FC<PostDetailViewerSheetProps> = ({
                                                                                post,
                                                                                onUpdate,
                                                                                triggerElement,
                                                                            }) => {
    const [isEditing, setIsEditing] = React.useState(false);
    const [formData, setFormData] = React.useState<PostFormData>({
        ...post,
        tagsInput: post.tags?.join(", ") || "",
    });
    const [errors, setErrors] = React.useState<Partial<Record<keyof PostFormData, string>>>({});
    const [isSubmitting, setIsSubmitting] = React.useState(false);

    React.useEffect(() => {
        setFormData({
            ...post,
            tagsInput: post.tags?.join(", ") || "",
        });
        setIsEditing(false); // Reset editing state when post changes
        setErrors({});
    }, [post]);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (errors[name as keyof PostFormData]) {
            setErrors(prev => ({...prev, [name]: undefined}));
        }
    };

    const handleSelectChange = (name: keyof PostFormData) => (value: string) => {
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (errors[name as keyof PostFormData]) {
            setErrors(prev => ({...prev, [name]: undefined}));
        }
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setErrors({});
        setIsSubmitting(true);

        const postToSubmit: Partial<PostData> = {
            ...formData,
            id: post.id, // Ensure ID is included
            tags: formData.tagsInput?.split(",").map((t) => t.trim()).filter(Boolean) || [],
        };
        // Remove tagsInput as it's not part of PostSchema
        delete (postToSubmit as any).tagsInput;


        const validationResult = PostSchema.partial().safeParse(postToSubmit); // Partial for updates

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

        const updatePromise = new Promise((resolve) => setTimeout(resolve, 700))
            .then(() => {
                onUpdate(validationResult.data as Partial<PostData>); // Pass only validated & changed data
            });

        toast.promise(updatePromise, {
            loading: `Updating "${post.title}"...`,
            success: () => {
                setIsEditing(false);
                return `"${post.title}" updated successfully!`;
            },
            error: "Error updating post.",
            finally: () => setIsSubmitting(false)
        });
    };

    const renderInfoField = (label: string, value: string | undefined, icon?: React.ReactNode) => (
        value ? <div className="flex items-start gap-2">
            {icon || <div className="w-3.5 h-3.5"/>}
            <div>
                <span className="font-medium text-muted-foreground">{label}:</span> {value}
            </div>
        </div> : null
    );


    return (
        <Sheet onOpenChange={(open) => { if (!open) setIsEditing(false); }}>
            <SheetTrigger asChild>
                {triggerElement || (
                    <Button
                        variant="link"
                        className="w-fit px-0 py-0 h-fit text-left font-medium text-foreground hover:text-primary hover:no-underline whitespace-normal"
                    >
                        {post.title}
                    </Button>
                )}
            </SheetTrigger>
            <SheetContent side="right" className="flex flex-col w-full sm:max-w-xl md:max-w-2xl">
                <SheetHeader className="pb-4">
                    <div className="flex justify-between items-start">
                        <div>
                            <SheetTitle className="text-2xl">{isEditing ? "Edit Post" : post.title}</SheetTitle>
                            <SheetDescription>
                                {isEditing ? "Modify the details of the post." : post.description ? post.description : "No description provided."}
                            </SheetDescription>
                        </div>
                        {!isEditing && (
                            <Button onClick={() => setIsEditing(true)} variant="outline" size="sm">Edit Post</Button>
                        )}
                    </div>
                </SheetHeader>
                <Separator />

                {isEditing ? (
                    <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto py-4 space-y-4 pr-2">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <Label htmlFor="edit-title">Title</Label>
                                <Input id="edit-title" name="title" value={formData.title} onChange={handleChange} disabled={isSubmitting}/>
                                {errors.title && <p className="text-xs text-red-500">{errors.title}</p>}
                            </div>
                            <div className="space-y-1.5">
                                <Label htmlFor="edit-description">Description (Optional)</Label>
                                <Input id="edit-description" name="description" value={formData.description || ''} onChange={handleChange} disabled={isSubmitting}/>
                                {errors.description && <p className="text-xs text-red-500">{errors.description}</p>}
                            </div>
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="edit-content">Content</Label>
                            <Textarea id="edit-content" name="content" value={formData.content} onChange={handleChange} rows={10} disabled={isSubmitting}/>
                            {errors.content && <p className="text-xs text-red-500">{errors.content}</p>}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <Label htmlFor="edit-category">Category</Label>
                                <Select name="category" value={formData.category} onValueChange={handleSelectChange('category')} disabled={isSubmitting}>
                                    <SelectTrigger id="edit-category"><SelectValue placeholder="Select category" /></SelectTrigger>
                                    <SelectContent>
                                        {PostCategoryEnum.options.map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                                {errors.category && <p className="text-xs text-red-500">{errors.category}</p>}
                            </div>
                            <div className="space-y-1.5">
                                <Label htmlFor="edit-status">Status</Label>
                                <Select name="status" value={formData.status} onValueChange={handleSelectChange('status')} disabled={isSubmitting}>
                                    <SelectTrigger id="edit-status"><SelectValue placeholder="Select status" /></SelectTrigger>
                                    <SelectContent>
                                        {PostStatusEnum.options.map(stat => <SelectItem key={stat} value={stat}>{stat}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                                {errors.status && <p className="text-xs text-red-500">{errors.status}</p>}
                            </div>
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="edit-tagsInput">Tags (comma-separated)</Label>
                            <Input id="edit-tagsInput" name="tagsInput" value={formData.tagsInput} onChange={handleChange} placeholder="e.g., tech, news" disabled={isSubmitting}/>
                            {errors.tagsInput && <p className="text-xs text-red-500">{errors.tagsInput}</p>}
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="edit-featuredImage">Featured Image URL</Label>
                            <Input id="edit-featuredImage" name="featuredImage" value={formData.featuredImage || ""} onChange={handleChange} placeholder="https://example.com/image.png" disabled={isSubmitting}/>
                            {errors.featuredImage && <p className="text-xs text-red-500">{errors.featuredImage}</p>}
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="edit-publishedAt">Published Date (Optional)</Label>
                            <Input id="edit-publishedAt" name="publishedAt" type="datetime-local"
                                   value={formData.publishedAt ? new Date(formData.publishedAt).toISOString().substring(0, 16) : ""}
                                   onChange={(e) => {
                                       const dateVal = e.target.value ? new Date(e.target.value).toISOString() : undefined;
                                       setFormData(prev => ({...prev, publishedAt: dateVal }));
                                   }} disabled={isSubmitting}/>
                            {errors.publishedAt && <p className="text-xs text-red-500">{errors.publishedAt}</p>}
                        </div>

                        <SheetFooter className="mt-auto flex flex-col-reverse sm:flex-row sm:justify-end gap-2 pt-6">
                            <Button type="button" variant="outline" onClick={() => setIsEditing(false)} disabled={isSubmitting}>
                                <XIcon className="mr-2 h-4 w-4" /> Cancel
                            </Button>
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting ? <Loader2Icon className="mr-2 h-4 w-4 animate-spin"/> : <SaveIcon className="mr-2 h-4 w-4" />}
                                Save Changes
                            </Button>
                        </SheetFooter>
                    </form>
                ) : (
                    <div className="flex-1 overflow-y-auto py-4 space-y-5 text-sm pr-2">
                        {post.featuredImage && (
                            <div className="mb-4">
                                <img src={post.featuredImage} alt={post.title} className="rounded-md max-h-60 w-full object-cover" />
                            </div>
                        )}
                        <p className="text-base leading-relaxed whitespace-pre-wrap">{post.content}</p>
                        <Separator />
                        <div className="space-y-2">
                            {renderInfoField("Author", post.authorName, <UserCircleIcon className="h-4 w-4 text-muted-foreground"/>)}
                            {renderInfoField("Category", post.category, <TagIcon className="h-4 w-4 text-muted-foreground"/>)}
                            {renderInfoField("Status", post.status, <CheckIcon className="h-4 w-4 text-muted-foreground"/>)}
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
                        <Separator />
                        <div className="space-y-2 text-xs text-muted-foreground">
                            {renderInfoField("Created", new Date(post.createdAt).toLocaleString(), <CalendarDaysIcon className="h-3.5 w-3.5"/>)}
                            {renderInfoField("Last Updated", new Date(post.updatedAt).toLocaleString(), <CalendarDaysIcon className="h-3.5 w-3.5"/>)}
                            {post.publishedAt && renderInfoField("Published", new Date(post.publishedAt).toLocaleString(), <CalendarDaysIcon className="h-3.5 w-3.5"/>)}
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

