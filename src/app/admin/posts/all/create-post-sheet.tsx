"use client";

import React from "react";
import {toast} from "sonner";
import {PlusIcon, SaveIcon, Loader2Icon, FileTextIcon, XIcon} from "lucide-react";

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
import {PostData, PostStatusEnum, PostCategoryEnum, PostFormData} from "./post-schema";
import {PostSchema} from "@/schemas/post-schema"; // Adjust path

interface CreatePostSheetProps {
    onCreateAction: (newPost: PostData) => void;
    currentAuthor?: { id: string; name: string };
}

export const CreatePostSheet: React.FC<CreatePostSheetProps> = ({onCreateAction}) => {
    const [isOpen, setIsOpen] = React.useState(false);
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const [errors, setErrors] = React.useState<Partial<Record<keyof PostFormData, string>>>({});

    const defaultFormState: PostFormData = {
        id: '2',
        createdAt: '2024-05-02T12:00:00Z',
        updatedAt: '2024-05-02T12:30:00Z',
        createdBy: 'user-2',
        updatedBy: 'user-2',
        user: {
            id: 'user-2',
            displayName: 'Bob The Builder',
            username: 'bobthebuilder',
            profileImage: 'https://picsum.photos/seed/bob/100/100',
            coverImage: 'https://picsum.photos/seed/cover2/400/200',
            createdAt: '2023-02-15T00:00:00Z',
        },
        caption: 'AI in Modern Art',
        description: 'How artificial intelligence is transforming creative expression.',
        visibility: 'PRIVATE',
        duration: 180,
        categoryName: 'Art',
        tags: ['AI', 'Creativity', 'Art'],
        videoPlaybackUrl: 'https://videos.example.com/ai-art.mp4',
        videoThumbnailUrl: 'https://picsum.photos/seed/video2/400/200',
        videoAsset: {
            id: 'asset-2',
            originalFilename: 'AI Art',
            resourceType: 'video/mp4',
            bytes: 654321,
            createdAt: '2024-05-02T11:00:00Z',
            createdBy: "",
            publicId: "",
            format: "",
            width: 0,
            height: 0
        },
        isAuthorDeleted: false,
        status: ""
    }

    const [formData, setFormData] = React.useState<PostFormData>(defaultFormState);

    const handleOpenChange = (open: boolean) => {
        setIsOpen(open);
        if (open) {
            setFormData(defaultFormState);
            setErrors({});
        }
    };

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

        const now = new Date().toISOString();
        const newPostPartial: PostData & { tagsInput?: string; description?: string } = {
            ...formData,
            id: crypto.randomUUID(),
            tags: formData.tagsInput?.split(",").map((t) => t.trim()).filter(Boolean) || [],
            createdAt: now,
            updatedAt: now,
        };
        if (newPostPartial.status === "Published" && !newPostPartial.createdAt) {
            newPostPartial.createdAt = now;
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
                    <PlusIcon className="size-4"/>
                    <span className="hidden lg:inline">Create Post</span>
                    <span className="lg:hidden">New</span>
                </Button>
            </SheetTrigger>
            <SheetContent side="right" className="flex flex-col w-full sm:max-w-xl md:max-w-2xl">
                <SheetHeader className="pb-4">
                    <div className="flex items-center gap-3">
                        <FileTextIcon className="size-6 text-primary"/>
                        <div>
                            <SheetTitle className="text-2xl">Create New Post</SheetTitle>
                            <SheetDescription>
                                Fill in the details to publish a new article.
                            </SheetDescription>
                        </div>
                    </div>
                </SheetHeader>
                <Separator/>
                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto py-4 space-y-4 pr-2">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <Label htmlFor="create-caption">caption</Label>
                            <Input id="create-caption" name="caption" value={formData.caption} onChange={handleChange}
                                   placeholder="My Awesome Post" disabled={isSubmitting}/>
                            {errors.caption && <p className="text-xs text-red-500">{errors.caption}</p>}
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="create-description">Description (Optional)</Label>
                            <Input id="create-description" name="description" value={formData.description || ''}
                                   onChange={handleChange} placeholder="A brief summary of the post"
                                   disabled={isSubmitting}/>
                            {errors.description && <p className="text-xs text-red-500">{errors.description}</p>}
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <Label htmlFor="create-categoryName">categoryName</Label>
                            <Select name="categoryName" value={formData.categoryName}
                                    onValueChange={handleSelectChange('categoryName')} disabled={isSubmitting}>
                                <SelectTrigger id="create-categoryName"><SelectValue
                                    placeholder="Select categoryName"/></SelectTrigger>
                                <SelectContent>
                                    {PostCategoryEnum.options.map(cat => <SelectItem key={cat}
                                                                                     value={cat}>{cat}</SelectItem>)}
                                </SelectContent>
                            </Select>
                            {errors.categoryName && <p className="text-xs text-red-500">{errors.categoryName}</p>}
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="create-status">Status</Label>
                            <Select name="status" value={formData.status} onValueChange={handleSelectChange('status')}
                                    disabled={isSubmitting}>
                                <SelectTrigger id="create-status"><SelectValue
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
                        <Label htmlFor="create-tagsInput">Tags (comma-separated)</Label>
                        <Input id="create-tagsInput" name="tagsInput" value={formData.tagsInput} onChange={handleChange}
                               placeholder="e.g., tech, news, updates" disabled={isSubmitting}/>
                        {errors.tagsInput && <p className="text-xs text-red-500">{errors.tagsInput}</p>}
                    </div>
                    <div className="space-y-1.5">
                        <Label htmlFor="create-videoPlaybackUrl">Featured Image URL (Optional)</Label>
                        <Input id="create-videoPlaybackUrl" name="videoPlaybackUrl"
                               value={formData.videoPlaybackUrl || ''} onChange={handleChange}
                               placeholder="https://example.com/image.png" disabled={isSubmitting}/>
                        {errors.videoPlaybackUrl && <p className="text-xs text-red-500">{errors.videoPlaybackUrl}</p>}
                    </div>
                    {/*<div className="space-y-1.5">*/}
                    {/*    <Label htmlFor="create-createdAt">Published Date (Optional)</Label>*/}
                    {/*    <Input id="create-createdAt" name="createdAt" type="datetime-local"*/}
                    {/*           value={formData.createdAt ? new Date(formData.createdAt).toISOString().substring(0, 16) : ""}*/}
                    {/*           onChange={(e) => {*/}
                    {/*               const dateVal = e.target.value ? new Date(e.target.value).toISOString() : undefined;*/}
                    {/*               setFormData(prev => ({...prev, createdAt: dateVal}));*/}
                    {/*           }} disabled={isSubmitting}/>*/}
                    {/*    {errors.createdAt && <p className="text-xs text-red-500">{errors.createdAt}</p>}*/}
                    {/*</div>*/}

                    <SheetFooter className="mt-auto flex flex-col-reverse sm:flex-row sm:justify-end gap-2 pt-6">
                        <SheetClose asChild>
                            <Button type="button" variant="outline" onClick={() => handleOpenChange(false)}
                                    disabled={isSubmitting}>
                                <XIcon className="mr-2 h-4 w-4"/> Cancel
                            </Button>
                        </SheetClose>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? <Loader2Icon className="mr-2 h-4 w-4 animate-spin"/> :
                                <SaveIcon className="mr-2 h-4 w-4"/>}
                            Create Post
                        </Button>
                    </SheetFooter>
                </form>
            </SheetContent>
        </Sheet>
    );
};
