"use client";

import React from "react";
import { toast } from "sonner";
import {
    CalendarDaysIcon,
    EditIcon,
    Loader2Icon,
    SaveIcon,
    TagIcon,
    TrashIcon,
    XIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sheet } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { PostCategory, PostCategorySchema } from "@/schemas/category-schema";
import { PostCategoryWithCountDto } from "@/api/client";

interface CategoryDetailViewerSheetProps {
    categoryInitial: PostCategoryWithCountDto;
    onUpdateAction: (updatedCategory: Partial<PostCategoryWithCountDto>) => void;
    onDeleteAction?: (categoryId: string) => void;
    children?: React.ReactNode;
}

type CategoryFormData = Pick<PostCategory, "name" | "slug" | "description">;

export const CategoryDetailViewerSheet: React.FC<CategoryDetailViewerSheetProps> = ({
    categoryInitial,
    onUpdateAction,
    onDeleteAction,
    children,
}) => {
    const [isEditing, setIsEditing] = React.useState(false);
    const [formData, setFormData] = React.useState<CategoryFormData>({
        name: categoryInitial.name ?? '',
        slug: categoryInitial.slug ?? '',
        description: categoryInitial.description ?? '',
    });
    const [errors, setErrors] = React.useState<Partial<Record<keyof CategoryFormData, string>>>({});
    const [isSubmitting, setIsSubmitting] = React.useState(false);

    React.useEffect(() => {
        setFormData({
            name: categoryInitial.name ?? '',
            slug: categoryInitial.slug ?? '',
            description: categoryInitial.description ?? '',
        });
        setIsEditing(false);
        setErrors({});
    }, [categoryInitial]);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (errors[name as keyof CategoryFormData]) {
            setErrors(prev => ({ ...prev, [name]: undefined }));
        }
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setErrors({});
        setIsSubmitting(true);

        const categoryToSubmit: Partial<CategoryFormData> = {
            name: formData.name,
            slug: formData.slug,
            description: formData.description,
        };

        const validationSchema = PostCategorySchema.pick({ name: true, slug: true, description: true });
        const validationResult = validationSchema.safeParse(categoryToSubmit);

        if (!validationResult.success) {
            const fieldErrors: Partial<Record<keyof CategoryFormData, string>> = {};
            validationResult.error.errors.forEach(err => {
                if (err.path.length > 0) {
                    const fieldName = err.path[0] as keyof CategoryFormData;
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
                onUpdateAction({ id: categoryInitial.id, ...validationResult.data });
            });

        toast.promise(updatePromise, {
            loading: `Updating category "${formData.name}"...`,
            success: () => {
                setIsEditing(false);
                return `category "${formData.name}" updated successfully!`;
            },
            error: "Error updating category.",
            finally: () => setIsSubmitting(false)
        });
    };

    const handleDelete = () => {
        if (onDeleteAction) {
            toast.warning(`Are you sure you want to delete "${categoryInitial.name}"?`, {
                action: {
                    label: "Delete",
                    onClick: () => {
                        onDeleteAction(categoryInitial.id!);
                        toast.success(`category "${categoryInitial.name}" delete process initiated.`);
                    }
                },
                cancel: {
                    label: "Cancel",
                    onClick: () => toast.dismiss(),
                }
            });
        } else {
            toast.info("Delete action not configured for this category.");
        }
    };

    const renderInfoField = (label: string, value: string | number | undefined | null, icon?: React.ReactNode) => (
        value !== undefined && value !== null && value !== '' ? <div className="flex items-start gap-2 py-1">
            {icon || <div className="w-4 h-4 flex-shrink-0"/>}
            <div>
                <span className="font-medium text-muted-foreground">{label}:</span> {String(value)}
            </div>
        </div> : null
    );

    return (
        <Sheet onOpenChange={(open) => {
            if (!open) {
                setIsEditing(false);
                setFormData({
                    name: categoryInitial.name || "",
                    slug: categoryInitial.slug || "",
                    description: categoryInitial.description || "",
                });
                setErrors({});
            }
        }}>
            <SheetTrigger asChild>
                {children || (
                    <Button variant="link" className="p-0 h-auto text-left">
                        {categoryInitial.name}
                    </Button>
                )}
            </SheetTrigger>
            <SheetContent side="right" className="flex flex-col w-full sm:max-w-md md:max-w-lg">
                <SheetHeader className="pb-4">
                    <div className="flex justify-between items-start">
                        <div>
                            <SheetTitle className="text-2xl">{isEditing ? "Edit category" : categoryInitial.name}</SheetTitle>
                            <SheetDescription>
                                {isEditing ? "Modify the details of the category." : categoryInitial.description || "No description."}
                            </SheetDescription>
                        </div>
                        {!isEditing && (
                            <Button onClick={() => setIsEditing(true)} variant="outline" size="sm" className="ml-auto">
                                <EditIcon className="mr-2 h-4 w-4"/>Edit category
                            </Button>
                        )}
                    </div>
                </SheetHeader>
                <Separator/>

                {isEditing ? (
                    <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto py-4 space-y-4 pr-2">
                        <div className="space-y-1.5">
                            <Label htmlFor="edit-category-name">Name</Label>
                            <Input id="edit-category-name" name="name" value={formData.name} onChange={handleChange} disabled={isSubmitting}/>
                            {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="edit-category-slug">Slug</Label>
                            <Input id="edit-category-slug" name="slug" value={formData.slug} onChange={handleChange} disabled={isSubmitting}/>
                            {errors.slug && <p className="text-xs text-red-500">{errors.slug}</p>}
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="edit-category-description">Description (Optional)</Label>
                            <Textarea id="edit-category-description"
                                      name="description"
                                      value={formData.description ?? 'No desc'}
                                      onChange={handleChange}
                                      disabled={isSubmitting}
                                      rows={4}
                            />
                            {errors.description && <p className="text-xs text-red-500">{errors.description}</p>}
                        </div>

                        <SheetFooter className="mt-auto flex flex-col-reverse sm:flex-row sm:justify-end gap-2 pt-6">
                            <Button type="button" variant="outline" onClick={() => setIsEditing(false)} disabled={isSubmitting}>
                                <XIcon className="mr-2 h-4 w-4"/> Cancel
                            </Button>
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting ? <Loader2Icon className="mr-2 h-4 w-4 animate-spin"/> : <SaveIcon className="mr-2 h-4 w-4"/>}
                                Save Changes
                            </Button>
                        </SheetFooter>
                    </form>
                ) : (
                    <div className="flex-1 overflow-y-auto py-4 space-y-3 text-sm pr-2">
                        {renderInfoField("Slug", categoryInitial.slug, <TagIcon className="h-4 w-4 text-muted-foreground"/>)}
                        {renderInfoField("Posts", Number(categoryInitial.postCount), <TagIcon className="h-4 w-4 text-muted-foreground"/>)}
                        {renderInfoField("Description", categoryInitial.description || "No description", <TagIcon className="h-4 w-4 text-muted-foreground"/>)}
                        <Separator />
                        {renderInfoField("Created At", categoryInitial.createdAt ? new Date(categoryInitial.createdAt).toLocaleString() : "N/A", <CalendarDaysIcon className="h-4 w-4 text-muted-foreground"/>)}
                        {renderInfoField("Last Updated", categoryInitial.updatedAt ? new Date(categoryInitial.updatedAt).toLocaleString() : "N/A", <CalendarDaysIcon className="h-4 w-4 text-muted-foreground"/>)}

                        <SheetFooter className="mt-auto pt-6 flex flex-col sm:flex-row justify-between items-center gap-2">
                             <Button variant="destructive" onClick={handleDelete} className="w-full sm:w-auto" disabled={!onDeleteAction}>
                                <TrashIcon className="mr-2 h-4 w-4"/> Delete category
                            </Button>
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
