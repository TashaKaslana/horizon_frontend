"use client";

import React from "react";
import { toast } from "sonner";
import { PlusIcon, SaveIcon, Loader2Icon, FileTextIcon, XIcon } from "lucide-react";
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
    SheetTrigger,
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
import { PostStatusEnum, PostCategoryEnum } from "./post-schema";
import { zCreatePostRequest } from "@/api/client/zod.gen";

const createPostFormSchema = z.object({
    caption: z.string().min(1, "Caption is required."),
    description: z.string().optional(),
    visibility: z.enum(['PUBLIC', 'FRIENDS', 'PRIVATE']),
    tagsInput: z.string().optional(),
    categoryName: z.string().min(1, "Category is required."),
    status: z.enum(['DRAFT', 'PENDING_REVIEW', 'PUBLISHED', 'REJECTED', 'ARCHIVED']).optional(),
    videoThumbnailUrl: z.string().url("Must be a valid URL if provided.").optional(),
});

type CreatePostFormValues = z.infer<typeof createPostFormSchema>;

interface CreatePostSheetProps {
    onCreateAction: (newPost: z.infer<typeof zCreatePostRequest>) => Promise<unknown>;
}


export const CreatePostSheet: React.FC<CreatePostSheetProps> = ({
    onCreateAction
                                                                }) => {
    const [isOpen, setIsOpen] = React.useState(false);

    const form = useForm<CreatePostFormValues>({
        resolver: zodResolver(createPostFormSchema),
        defaultValues: {
            caption: "",
            description: "",
            visibility: "PUBLIC",
            tagsInput: "",
            categoryName: "",
            status: "DRAFT",
            videoThumbnailUrl: "",
        },
    });

    const handleOpenChange = (open: boolean) => {
        setIsOpen(open);
        if (open) {
            form.reset({
                caption: "",
                description: "",
                visibility: "PUBLIC",
                tagsInput: "",
                categoryName: "",
                status: "DRAFT",
                videoThumbnailUrl: "",
            });
        }
    };

    const onSubmit = async (values: CreatePostFormValues) => {
        const payload: z.infer<typeof zCreatePostRequest> = {
            caption: values.caption,
            description: values.description,
            visibility: values.visibility,
            tags: values.tagsInput?.split(",").map((t) => t.trim()).filter(Boolean) || [],
            categoryName: values.categoryName,
            status: values.status,
        };

        const validationResult = zCreatePostRequest.safeParse(payload);

        if (!validationResult.success) {
            console.error("Final payload validation error:", validationResult.error.flatten());
            toast.error("There was an issue with the post data. Please check console.");
            return;
        }
        
        const creationPromise = onCreateAction(validationResult.data);

        toast.promise(creationPromise, {
            loading: "Creating new post...",
            success: () => {
                handleOpenChange(false);
                return "Post created successfully!";
            },
            error: (err) => {
                return err.message || "Error creating post.";
            }
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
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="flex-1 overflow-y-auto py-4 space-y-4 pr-2">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="caption"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Caption</FormLabel>
                                        <FormControl>
                                            <Input placeholder="My Awesome Post" {...field} disabled={form.formState.isSubmitting} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="categoryName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Category</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value} disabled={form.formState.isSubmitting}>
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
                        </div>

                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description (Optional)</FormLabel>
                                    <FormControl>
                                        <Textarea placeholder="A brief summary of the post" {...field} value={field.value || ""} disabled={form.formState.isSubmitting} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="status"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Status</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value} disabled={form.formState.isSubmitting}>
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
                            <FormField
                                control={form.control}
                                name="visibility"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Visibility</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value} disabled={form.formState.isSubmitting}>
                                            <FormControl>
                                                <SelectTrigger><SelectValue placeholder="Select visibility" /></SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {(zCreatePostRequest.shape.visibility._def).values.map((vis: string) => (
                                                    <SelectItem key={vis} value={vis}>{vis.charAt(0).toUpperCase() + vis.slice(1).toLowerCase()}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="tagsInput"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Tags (comma-separated)</FormLabel>
                                    <FormControl>
                                        <Input placeholder="e.g., tech, news, updates" {...field} disabled={form.formState.isSubmitting} />
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
                                    <FormLabel>Featured Image URL (Optional)</FormLabel>
                                    <FormControl>
                                        <Input placeholder="https://example.com/image.png" {...field} value={field.value || ""} disabled={form.formState.isSubmitting} />
                                    </FormControl>
                                    <FormDescription>URL for the post&#39;s thumbnail or featured image.</FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <SheetFooter className="mt-auto flex flex-col-reverse sm:flex-row sm:justify-end gap-2 pt-6">
                            <SheetClose asChild>
                                <Button type="button" variant="outline" onClick={() => handleOpenChange(false)} disabled={form.formState.isSubmitting}>
                                    <XIcon className="mr-2 h-4 w-4" /> Cancel
                                </Button>
                            </SheetClose>
                            <Button type="submit" disabled={form.formState.isSubmitting}>
                                {form.formState.isSubmitting ? <Loader2Icon className="mr-2 h-4 w-4 animate-spin" /> :
                                    <SaveIcon className="mr-2 h-4 w-4" />}
                                Create Post
                            </Button>
                        </SheetFooter>
                    </form>
                </Form>
            </SheetContent>
        </Sheet>
    );
};
