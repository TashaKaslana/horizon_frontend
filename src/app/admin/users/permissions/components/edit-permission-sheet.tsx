"use client";

import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { PermissionSchema } from "@/schemas/user-schema";
import { PermissionDto } from "@/api/client";
import { useTranslations } from "next-intl";
import usePermissionsManagement from "@/app/admin/users/permissions/hooks/usePermissionsManagement";

const EditPermissionFormSchema = PermissionSchema.omit({ createdAt: true });

type EditPermissionFormValues = z.infer<typeof EditPermissionFormSchema>;

interface EditPermissionSheetProps {
  permission: PermissionDto;
  open: boolean;
  onOpenChangeAction: (open: boolean) => void;
}

export const EditPermissionSheet = ({
  permission,
  open,
  onOpenChangeAction,
}: EditPermissionSheetProps) => {
  const t = useTranslations("Admin.users.permissions");
  const { updatePermission } = usePermissionsManagement();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<EditPermissionFormValues>({
    resolver: zodResolver(EditPermissionFormSchema),
    defaultValues: {
      id: permission.id,
      name: permission.name,
      slug: permission.slug,
      description: permission.description ?? "",
      module: permission.module,
    },
  });

  useEffect(() => {
    if (open) {
      reset({
        id: permission.id,
        name: permission.name,
        slug: permission.slug,
        description: permission.description ?? "",
        module: permission.module,
      });
    }
  }, [open, permission, reset]);

  const onSubmit = async (data: EditPermissionFormValues) => {
    try {
      await updatePermission(data as PermissionDto);
      toast.success(t("notifications.permissionUpdated"));
      onOpenChangeAction(false);
    } catch (error) {
      console.error("Failed to update permission:", error);
      toast.error(t("notifications.error"));
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChangeAction}>
      <SheetContent className="sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>{t("table.editPermission")}</SheetTitle>
          <SheetDescription>
            {t("addPermissionSheet.description")}
          </SheetDescription>
        </SheetHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 py-6">
          <div className="space-y-2">
            <Label htmlFor="name">
              {t("addPermissionSheet.formLabels.name")}
            </Label>
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <Input
                  id="name"
                  {...field}
                  placeholder={t("addPermissionSheet.placeholders.name")}
                />
              )}
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="slug">
              {t("addPermissionSheet.formLabels.slug")}
            </Label>
            <Controller
              name="slug"
              control={control}
              render={({ field }) => (
                <Input
                  id="slug"
                  {...field}
                  placeholder={t("addPermissionSheet.placeholders.slug")}
                />
              )}
            />
            {errors.slug && (
              <p className="text-sm text-red-500">{errors.slug.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="module">
              {t("addPermissionSheet.formLabels.module")}
            </Label>
            <Controller
              name="module"
              control={control}
              render={({ field }) => (
                <Input
                  id="module"
                  {...field}
                  placeholder={t("addPermissionSheet.placeholders.module")}
                />
              )}
            />
            {errors.module && (
              <p className="text-sm text-red-500">{errors.module.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">
              {t("addPermissionSheet.formLabels.description")}
            </Label>
            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <Textarea
                  id="description"
                  {...field}
                  placeholder={t("addPermissionSheet.placeholders.description")}
                />
              )}
            />
            {errors.description && (
              <p className="text-sm text-red-500">
                {errors.description.message}
              </p>
            )}
          </div>

          <SheetFooter className="mt-8">
            <SheetClose asChild>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChangeAction(false)}
              >
                {t("addPermissionSheet.buttons.cancel")}
              </Button>
            </SheetClose>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "..." : t("table.edit")}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
};

export default EditPermissionSheet;
