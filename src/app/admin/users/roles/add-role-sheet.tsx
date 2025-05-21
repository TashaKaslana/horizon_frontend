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
import { RoleSchema } from "@/schemas/user-schema";

const CreateRoleFormSchema = RoleSchema.omit({ id: true, created_at: true });
type CreateRoleFormValues = z.infer<typeof CreateRoleFormSchema>;

interface AddRoleSheetProps {
    onRoleAdded?: (newRole: CreateRoleFormValues) => void;
    children: React.ReactNode;
}

export const AddRoleSheet: React.FC<AddRoleSheetProps> = ({ onRoleAdded, children }) => {
    const [isOpen, setIsOpen] = useState(false);

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<CreateRoleFormValues>({
        resolver: zodResolver(CreateRoleFormSchema),
        defaultValues: {
            name: "",
            slug: "",
            description: "",
        },
    });

    const onSubmit = async (data: CreateRoleFormValues) => {
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            console.log("New role data:", data);
            toast.success("Role created successfully!");
            onRoleAdded?.(data);
            reset();
            setIsOpen(false);
        } catch (error) {
            console.error("Failed to create role:", error);
            toast.error("Failed to create role. Please try again.");
        }
    };

    return (
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <div onClick={() => setIsOpen(true)} style={{ display: 'inline-block' }}>
                {children}
            </div>
            <SheetContent className="sm:max-w-lg">
                <SheetHeader>
                    <SheetTitle>Add New Role</SheetTitle>
                    <SheetDescription>
                        Fill in the details below to create a new user role.
                    </SheetDescription>
                </SheetHeader>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 py-6">
                    <div className="space-y-2">
                        <Label htmlFor="name">Role Name</Label>
                        <Controller
                            name="name"
                            control={control}
                            render={({ field }) => <Input id="name" {...field} placeholder="e.g., Content Moderator" />}
                        />
                        {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="slug">Slug</Label>
                        <Controller
                            name="slug"
                            control={control}
                            render={({ field }) => <Input id="slug" {...field} placeholder="e.g., content-moderator" />}
                        />
                        {errors.slug && <p className="text-sm text-red-500">{errors.slug.message}</p>}
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
                                    placeholder="Briefly describe the role's purpose and permissions."
                                    rows={4}
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
                            {isSubmitting ? "Creating..." : "Create Role"}
                        </Button>
                    </SheetFooter>
                </form>
            </SheetContent>
        </Sheet>
    );
};

