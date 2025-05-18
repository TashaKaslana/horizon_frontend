"use client";

import React from "react";
import { toast } from "sonner";
import { PlusIcon, SaveIcon, Loader2Icon, FileTextIcon, XIcon } from "lucide-react";

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
import { PostData, PostSchema, PostStatusEnum, PostCategoryEnum, PostFormData } from "./post-schema"; // Adjust path

interface CreatePostSheetProps {
    onCreateAction: (newPost: PostData) => void;
    currentAuthor?: { id: string; name: string };
}

export const CreatePostSheet: React.FC<CreatePostSheetProps> = ({ onCreateAction, currentAuthor }) => {
    const [isOpen, setIsOpen] = React.useState(false);
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const [errors, setErrors] = React.useState<Partial<Record<keyof PostFormData, string>>>({});

    const defaultFormState: PostFormData = {
        id: '',
        title: "",
        description: "",
        content: "",
        authorId: currentAuthor?.id || "",
        authorName: currentAuthor?.name || "",
        category: PostCategoryEnum.options[0],
        status: "Draft",
        tagsInput: "",
        tags: [],
        featuredImage: "",
        publishedAt: undefined,
        createdAt: '',
        updatedAt: '',
        viewCount: 0
    };
    const [formData, setFormData] = React.useState<PostFormData>(defaultFormState);

    const handleOpenChange = (open: boolean) => {
        setIsOpen(open);
        if (open) {
            setFormData({
                ...defaultFormState,
                authorId: currentAuthor?.id || "",
                authorName: currentAuthor?.name || ""
            });
            setErrors({});
        }
    };

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

        const now = new Date().toISOString();
        const newPostPartial: Omit<PostData, 'tags' | 'slug'> & { tagsInput?: string; description?: string } = {
            ...formData,
            id: crypto.randomUUID(),
            tags: formData.tagsInput?.split(",").map((t) => t.trim()).filter(Boolean) || [],
            createdAt: now,
            updatedAt: now,
        };
        if (newPostPartial.status === "Published" && !newPostPartial.publishedAt) {
            newPostPartial.publishedAt = now;
        }
        delete (newPostPartial as any).tagsInput;

        const validationResult = PostSchema.safeParse(newPostPartial);

        if (!validationResult.success) {
            const fieldErrors: Partial<Record<keyof PostFormData, string>> = {};
            validationResult.error.errors.forEach(err => {
                if (err.path.length > 0) {
                    const fieldName = err.path[0] as keyof PostFormData;
                    fieldErrors[fieldName] = err.message;
                }
            });
            setErrors(fieldErrors);
            toast.error("Please correct the form errors.");
            setIsSubmitting(false);
            return;
        }

        const creationPromise = new Promise((resolve) => setTimeout(resolve, 700))
            .then(() => {
                onCreateAction(validationResult.data as PostData);
            });

        toast.promise(creationPromise, {
            loading: "Creating new post...",
            success: () => {
                handleOpenChange(false);
                return "Post created successfully!";
            },
            error: "Error creating post.",
            finally: () => setIsSubmitting(false)
        });
    };

    return (
        <Sheet open={isOpen} onOpenChange={handleOpenChange}>
            <SheetTrigger asChild>
                <Button variant="default" size="sm" className="gap-1.5">
                    <PlusIcon className="size-4" />
                    <span className="hidden lg:inline">Create Post</span>
                    <span className="lg:hidden">New</span>
                </Button>
            </SheetTrigger>
            <SheetContent side="right" className="flex flex-col w-full sm:max-w-xl md:max-w-2xl">
                <SheetHeader className="pb-4">
                    <div className="flex items-center gap-3">
                        <FileTextIcon className="size-6 text-primary" />
                        <div>
                            <SheetTitle className="text-2xl">Create New Post</SheetTitle>
                            <SheetDescription>
                                Fill in the details to publish a new article.
                            </SheetDescription>
                        </div>
                    </div>
                </SheetHeader>
                <Separator />
                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto py-4 space-y-4 pr-2">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <Label htmlFor="create-title">Title</Label>
                            <Input id="create-title" name="title" value={formData.title} onChange={handleChange} placeholder="My Awesome Post" disabled={isSubmitting}/>
                            {errors.title && <p className="text-xs text-red-500">{errors.title}</p>}
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="create-description">Description (Optional)</Label>
                            <Input id="create-description" name="description" value={formData.description || ''} onChange={handleChange} placeholder="A brief summary of the post" disabled={isSubmitting}/>
                            {errors.description && <p className="text-xs text-red-500">{errors.description}</p>}
                        </div>
                    </div>
                    <div className="space-y-1.5">
                        <Label htmlFor="create-content">Content</Label>
                        <Textarea id="create-content" name="content" value={formData.content} onChange={handleChange} rows={10} placeholder="Start writing your amazing content here..." disabled={isSubmitting}/>
                        {errors.content && <p className="text-xs text-red-500">{errors.content}</p>}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <Label htmlFor="create-category">Category</Label>
                            <Select name="category" value={formData.category} onValueChange={handleSelectChange('category')} disabled={isSubmitting}>
                                <SelectTrigger id="create-category"><SelectValue placeholder="Select category" /></SelectTrigger>
                                <SelectContent>
                                    {PostCategoryEnum.options.map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
                                </SelectContent>
                            </Select>
                            {errors.category && <p className="text-xs text-red-500">{errors.category}</p>}
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="create-status">Status</Label>
                            <Select name="status" value={formData.status} onValueChange={handleSelectChange('status')} disabled={isSubmitting}>
                                <SelectTrigger id="create-status"><SelectValue placeholder="Select status" /></SelectTrigger>
                                <SelectContent>
                                    {PostStatusEnum.options.map(stat => <SelectItem key={stat} value={stat}>{stat}</SelectItem>)}
                                </SelectContent>
                            </Select>
                            {errors.status && <p className="text-xs text-red-500">{errors.status}</p>}
                        </div>
                    </div>
                    <div className="space-y-1.5">
                        <Label htmlFor="create-tagsInput">Tags (comma-separated)</Label>
                        <Input id="create-tagsInput" name="tagsInput" value={formData.tagsInput} onChange={handleChange} placeholder="e.g., tech, news, updates" disabled={isSubmitting}/>
                        {errors.tagsInput && <p className="text-xs text-red-500">{errors.tagsInput}</p>}
                    </div>
                    <div className="space-y-1.5">
                        <Label htmlFor="create-featuredImage">Featured Image URL (Optional)</Label>
                        <Input id="create-featuredImage" name="featuredImage" value={formData.featuredImage || ''} onChange={handleChange} placeholder="https://example.com/image.png" disabled={isSubmitting}/>
                        {errors.featuredImage && <p className="text-xs text-red-500">{errors.featuredImage}</p>}
                    </div>
                    <div className="space-y-1.5">
                        <Label htmlFor="create-publishedAt">Published Date (Optional)</Label>
                        <Input id="create-publishedAt" name="publishedAt" type="datetime-local"
                               value={formData.publishedAt ? new Date(formData.publishedAt).toISOString().substring(0, 16) : ""}
                               onChange={(e) => {
                                   const dateVal = e.target.value ? new Date(e.target.value).toISOString() : undefined;
                                   setFormData(prev => ({...prev, publishedAt: dateVal }));
                               }} disabled={isSubmitting}/>
                        {errors.publishedAt && <p className="text-xs text-red-500">{errors.publishedAt}</p>}
                    </div>

                    <SheetFooter className="mt-auto flex flex-col-reverse sm:flex-row sm:justify-end gap-2 pt-6">
                        <SheetClose asChild>
                            <Button type="button" variant="outline" onClick={() => handleOpenChange(false)} disabled={isSubmitting}>
                                <XIcon className="mr-2 h-4 w-4" /> Cancel
                            </Button>
                        </SheetClose>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? <Loader2Icon className="mr-2 h-4 w-4 animate-spin"/> : <SaveIcon className="mr-2 h-4 w-4" />}
                            Create Post
                        </Button>
                    </SheetFooter>
                </form>
            </SheetContent>
        </Sheet>
    );
};
