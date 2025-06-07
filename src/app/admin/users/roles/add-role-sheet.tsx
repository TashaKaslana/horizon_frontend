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
import {useTranslations} from "next-intl";

interface AddRoleSheetProps {
    children: React.ReactNode;
}

export const AddRoleSheet: React.FC<AddRoleSheetProps> = ({children}) => {
    const t = useTranslations("Admin.users.roles.addRoleSheet");
    const [isOpen, setIsOpen] = useState(false);
    const [isPermissionDialogOpen, setIsPermissionDialogOpen] = useState(false);
    const {createRole} = useRolesManagement();

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
                    <SheetTitle>{t("title")}</SheetTitle>
                    <SheetDescription>
                        {t("description")}
                    </SheetDescription>
                </SheetHeader>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 py-6">
                    <div className="space-y-2">
                        <Label htmlFor="name">{t("formLabels.name")}</Label>
                        <Controller
                            name="name"
                            control={control}
                            render={({field}) => <Input id="name" {...field} placeholder={t("placeholders.name")}/>}
                        />
                        {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="slug">{t("formLabels.slug")}</Label>
                        <Controller
                            name="slug"
                            control={control}
                            render={({field}) => <Input id="slug" {...field} placeholder={t("placeholders.slug")}/>}
                        />
                        {errors.slug && <p className="text-sm text-red-500">{errors.slug.message}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">{t("formLabels.description")}</Label>
                        <Controller
                            name="description"
                            control={control}
                            render={({field}) => (
                                <Textarea
                                    id="description"
                                    {...field}
                                    placeholder={t("placeholders.description")}
                                    rows={4}
                                />
                            )}
                        />
                        {errors.description && <p className="text-sm text-red-500">{errors.description.message}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="permissionIds">{t("formLabels.permissions")}</Label>
                        <Button type="button" variant="outline" onClick={() => setIsPermissionDialogOpen(true)}>
                            {t("buttons.selectPermissions", { count: currentPermissionIds?.length || 0 })}
                        </Button>
                        {errors.permissionIds && <p className="text-sm text-red-500">{errors.permissionIds.message}</p>}
                    </div>

                    <SheetFooter className="mt-8">
                        <SheetClose asChild>
                            <Button type="button" variant="outline" onClick={() => reset()}>
                                {t("buttons.cancel")}
                            </Button>
                        </SheetClose>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? "Creating..." : t("buttons.create")}
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
