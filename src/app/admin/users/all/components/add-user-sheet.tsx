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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import useUsersManagement from "../hooks/useUsersManagement";
import { useTranslations } from "next-intl";
import { UserCreateDto } from "@/api/client/types.gen";
import { zUserCreateDto } from "@/api/client/zod.gen";

interface AddUserSheetProps {
    children: React.ReactNode;
}

export const AddUserSheet: React.FC<AddUserSheetProps> = ({ children }) => {
    const t = useTranslations("Admin.users.all.addUserSheet");
    const [isOpen, setIsOpen] = useState(false);
    const { createUser, isCreatingUser } = useUsersManagement();

    const { control, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<UserCreateDto>({
        resolver: zodResolver(zUserCreateDto),
        defaultValues: {
            auth0Id: "",
            username: "",
            email: "",
            status: "ACTIVE"
        }
    });

    const onSubmit = (data: UserCreateDto) => {
        createUser(data);
        reset();
        setIsOpen(false);
    };

    return (
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <div onClick={() => setIsOpen(true)} style={{ display: 'inline-block' }}>
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
                        <Label htmlFor="auth0Id">{t("formLabels.auth0Id")}</Label>
                        <Controller
                            name="auth0Id"
                            control={control}
                            render={({ field }) => (
                                <Input id="auth0Id" {...field} placeholder={t("placeholders.auth0Id")} />
                            )}
                        />
                        {errors.auth0Id && <p className="text-sm text-red-500">{errors.auth0Id.message}</p>}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="username">{t("formLabels.username")}</Label>
                        <Controller
                            name="username"
                            control={control}
                            render={({ field }) => (
                                <Input id="username" {...field} placeholder={t("placeholders.username")} />
                            )}
                        />
                        {errors.username && <p className="text-sm text-red-500">{errors.username.message}</p>}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="email">{t("formLabels.email")}</Label>
                        <Controller
                            name="email"
                            control={control}
                            render={({ field }) => (
                                <Input id="email" type="email" {...field} placeholder={t("placeholders.email")} />
                            )}
                        />
                        {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="status">{t("formLabels.status")}</Label>
                        <Controller
                            name="status"
                            control={control}
                            render={({ field }) => (
                                <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                                    <SelectTrigger id="status">
                                        <SelectValue placeholder={t("formLabels.status")} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="ACTIVE">ACTIVE</SelectItem>
                                        <SelectItem value="PENDING">PENDING</SelectItem>
                                        <SelectItem value="SUSPENDED">SUSPENDED</SelectItem>
                                        <SelectItem value="DEACTIVATED">DEACTIVATED</SelectItem>
                                    </SelectContent>
                                </Select>
                            )}
                        />
                        {errors.status && <p className="text-sm text-red-500">{errors.status.message}</p>}
                    </div>

                    <SheetFooter className="mt-8">
                        <SheetClose asChild>
                            <Button type="button" variant="outline" onClick={() => reset()}>
                                {t("buttons.cancel")}
                            </Button>
                        </SheetClose>
                        <Button type="submit" disabled={isSubmitting || isCreatingUser}>
                            {isSubmitting || isCreatingUser ? "..." : t("buttons.create")}
                        </Button>
                    </SheetFooter>
                </form>
            </SheetContent>
        </Sheet>
    );
};

export default AddUserSheet;
