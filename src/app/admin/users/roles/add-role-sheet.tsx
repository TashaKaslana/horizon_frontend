"use client";

import React, {useState} from "react";
import {Button} from "@/components/ui/button";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetDescription,
    SheetFooter,
    SheetClose
} from "@/components/ui/sheet";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {Textarea} from "@/components/ui/textarea";
import {useForm, Controller} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {CreateRoleRequest} from "@/api/client";
import {zCreateRoleRequest} from "@/api/client/zod.gen";
import {useRolesManagement} from "@/app/admin/users/roles/hooks/useRolesManagement";
import { PermissionsSelectionDialog } from "./components/permissions-selection-dialog";

interface AddRoleSheetProps {
    children: React.ReactNode;
}

export const AddRoleSheet: React.FC<AddRoleSheetProps> = ({children}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isPermissionDialogOpen, setIsPermissionDialogOpen] = useState(false); // Fixed: Added semicolon
    const {createRole} = useRolesManagement(); // Fixed: Added semicolon for consistency

    const {
        control,
        handleSubmit,
        reset,
        setValue,
        watch,
        formState: {errors, isSubmitting},
    } = useForm<CreateRoleRequest>({
        resolver: zodResolver(zCreateRoleRequest),
        defaultValues: {
            name: "",
            slug: "",
            description: "",
            permissionIds: [],
        },
    });

    const currentPermissionIds = watch("permissionIds");

    const onSubmit = async (data: CreateRoleRequest) => {
        createRole(data)
    };

    const handlePermissionsConfirm = (selectedIds: string[]) => {
        setValue("permissionIds", selectedIds, { shouldValidate: true });
    };

    return (
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <div onClick={() => setIsOpen(true)} style={{display: 'inline-block'}}>
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
                            render={({field}) => <Input id="name" {...field} placeholder="e.g., Content Moderator"/>}
                        />
                        {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="slug">Slug</Label>
                        <Controller
                            name="slug"
                            control={control}
                            render={({field}) => <Input id="slug" {...field} placeholder="e.g., content-moderator"/>}
                        />
                        {errors.slug && <p className="text-sm text-red-500">{errors.slug.message}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Description (Optional)</Label>
                        <Controller
                            name="description"
                            control={control}
                            render={({field}) => (
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

                    <div className="space-y-2">
                        <Label htmlFor="permissionIds">Permissions</Label>
                        <Button type="button" variant="outline" onClick={() => setIsPermissionDialogOpen(true)}>
                            Select Permissions ({currentPermissionIds?.length || 0} selected)
                        </Button>
                        {errors.permissionIds && <p className="text-sm text-red-500">{errors.permissionIds.message}</p>}
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
            <PermissionsSelectionDialog
                open={isPermissionDialogOpen}
                onOpenChangeAction={setIsPermissionDialogOpen}
                onConfirmAction={handlePermissionsConfirm}
                currentPermissionIds={currentPermissionIds}
            />
        </Sheet>
    );
};

