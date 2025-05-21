"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetDescription,
    SheetFooter,
    SheetClose
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { PermissionSchema } from "@/schemas/user-schema";

const CreatePermissionFormSchema = PermissionSchema.omit({ id: true, created_at: true });
type CreatePermissionFormValues = z.infer<typeof CreatePermissionFormSchema>;

interface AddPermissionSheetProps {
    onPermissionAdded?: (newPermission: CreatePermissionFormValues) => void;
    children: React.ReactNode;
}

export const AddPermissionSheet: React.FC<AddPermissionSheetProps> = ({ onPermissionAdded, children }) => {
    const [isOpen, setIsOpen] = useState(false);

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<CreatePermissionFormValues>({
        resolver: zodResolver(CreatePermissionFormSchema),
        defaultValues: {
            name: "",
            slug: "",
            description: "", // Added description field
            module: "",
        },
    });

    const onSubmit = async (data: CreatePermissionFormValues) => {
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            console.log("New permission data:", data);
            toast.success("Permission created successfully!");
            onPermissionAdded?.(data);
            reset();
            setIsOpen(false);
        } catch (error) {
            console.error("Failed to create permission:", error);
            toast.error("Failed to create permission. Please try again.");
        }
    };

    return (
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <div onClick={() => setIsOpen(true)} style={{ display: 'inline-block' }}>
                {children}
            </div>
            <SheetContent className="sm:max-w-lg">
                <SheetHeader>
                    <SheetTitle>Add New Permission</SheetTitle>
                    <SheetDescription>
                        Fill in the details below to create a new permission.
                    </SheetDescription>
                </SheetHeader>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 py-6">
                    <div className="space-y-2">
                        <Label htmlFor="name">Permission Name</Label>
                        <Controller
                            name="name"
                            control={control}
                            render={({ field }) => <Input id="name" {...field} placeholder="e.g., Create Posts" />}
                        />
                        {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="slug">Slug</Label>
                        <Controller
                            name="slug"
                            control={control}
                            render={({ field }) => <Input id="slug" {...field} placeholder="e.g., create-posts" />}
                        />
                        {errors.slug && <p className="text-sm text-red-500">{errors.slug.message}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="module">Module</Label>
                        <Controller
                            name="module"
                            control={control}
                            render={({ field }) => <Input id="module" {...field} placeholder="e.g., Posts, Users, Comments" />}
                        />
                        {errors.module && <p className="text-sm text-red-500">{errors.module.message}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Description (Optional)</Label>
                        <Controller
                            name="description"
                            control={control}
                            render={({ field }) => (
                                <Textarea
                                    id="description"
                                    {...field}
                                    placeholder="Briefly describe the permission."
                                    rows={3}
                                />
                            )}
                        />
                        {errors.description && <p className="text-sm text-red-500">{errors.description.message}</p>}
                    </div>

                    <SheetFooter className="mt-8">
                        <SheetClose asChild>
                            <Button type="button" variant="outline" onClick={() => reset()}>
                                Cancel
                            </Button>
                        </SheetClose>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? "Creating..." : "Create Permission"}
                        </Button>
                    </SheetFooter>
                </form>
            </SheetContent>
        </Sheet>
    );
};

