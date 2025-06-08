import React from "react";
import {toast} from "sonner";
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger
} from "@/components/ui/sheet";
import {Button} from "@/components/ui/button";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {Separator} from "@/components/ui/separator";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {CalendarDaysIcon, LogInIcon} from "lucide-react";
import {UserStatusSchema, UserRoleSchema} from "@/schemas/user-schema";
import useUsersManagement from "@/app/admin/users/all/hooks/useUsersManagement";
import {UserRespondDto} from "@/api/client/types.gen";
import {DraggableItem} from "@/components/common/dnd-table-components";
import {useTranslations} from "next-intl";
import {formatDateTS} from "@/lib/utils";

type UserAdminData = UserRespondDto & DraggableItem

interface UserTableCellViewerProps {
    userId?: string;
    initialDisplayName?: string;
    onUpdate?: (updatedItem: Partial<UserAdminData>) => void;
}

export const UserTableCellViewer: React.FC<UserTableCellViewerProps> = ({userId, initialDisplayName, onUpdate}) => {
    const {selectedUserData, isSelectedUserLoading, isSelectedUserError} = useUsersManagement(userId);
    const t = useTranslations("Admin.users.all");

    const [formData, setFormData] = React.useState<Partial<UserAdminData>>({});
    const [isSheetOpen, setIsSheetOpen] = React.useState(false);

    React.useEffect(() => {
        if (selectedUserData?.data && isSheetOpen) {
            setFormData(selectedUserData.data);
        }
    }, [selectedUserData?.data, isSheetOpen]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({...prev, [e.target.name]: e.target.value}));
    };

    const handleSelectChange = (name: keyof UserAdminData) => (value: string) => {
        setFormData(prev => ({...prev, [name]: value}));
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!selectedUserData?.data) {
            toast.error(t("actions.userDataNotLoaded"));
            return;
        }
        const changesToSubmit = {...formData, id: selectedUserData.data.id};
        onUpdate?.(changesToSubmit);
        toast.promise(new Promise((resolve) => setTimeout(resolve, 700)), {
            loading: t("actions.updatingUser", {name: selectedUserData.data.displayName ?? ''}),
            success: t("actions.userUpdatedSuccess", {name: selectedUserData.data.displayName ?? ''}),
            error: t("actions.userUpdateError"),
        });
        setIsSheetOpen(false);
    };

    return (
        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetTrigger asChild>
                <Button variant="link"
                        className="w-fit px-0 py-0 h-fit text-left font-medium text-foreground hover:text-primary hover:no-underline truncate max-w-[150px] sm:max-w-[200px]">
                    {initialDisplayName}
                </Button>
            </SheetTrigger>
            <SheetContent side="right" className="flex flex-col sm:max-w-md">
                {isSelectedUserLoading && (
                    <div className="flex items-center justify-center h-full">
                        <p>{t("actions.loadingUserDetails")}</p>
                    </div>
                )}
                {isSelectedUserError && !isSelectedUserLoading && (
                    <div className="flex flex-col items-center justify-center h-full">
                        <p className="text-red-500">{t("errorLoadingUser")}</p>
                        <p className="text-xs text-muted-foreground">{t("actions.couldNotLoadInfo")}</p>
                    </div>
                )}
                {!isSelectedUserLoading && !isSelectedUserError && selectedUserData?.data && (
                    <>
                        <SheetHeader className="pb-4">
                            <div className="flex items-center gap-3">
                                <Avatar className="h-12 w-12">
                                    <AvatarImage src={selectedUserData.data.profileImage}
                                                 alt={selectedUserData.data.displayName}/>
                                    <AvatarFallback>{selectedUserData.data.displayName?.split(' ').map(n => n[0]).join('').toUpperCase()}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <SheetTitle>{selectedUserData.data.displayName}</SheetTitle>
                                    <SheetDescription>@{selectedUserData.data.username} · {selectedUserData.data.email}</SheetDescription>
                                </div>
                            </div>
                        </SheetHeader>
                        <Separator/>
                        <div className="flex-1 overflow-y-auto py-4 text-sm">
                            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                                <div className="flex flex-col gap-1.5">
                                    <Label htmlFor="form-displayName">{t("table.fullName")}</Label>
                                    <Input id="form-displayName" name="displayName" value={formData?.displayName || ''}
                                           onChange={handleChange}/>
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <Label htmlFor="form-username">{t("table.username")}</Label>
                                    <Input id="form-username" name="username" value={formData?.username || ''}
                                           onChange={handleChange}/>
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <Label htmlFor="form-email">{t("table.email")}</Label>
                                    <Input id="form-email" type="email" name="email" value={formData?.email || ''}
                                           onChange={handleChange}/>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="flex flex-col gap-1.5">
                                        <Label htmlFor="form-role">{t("table.role")}</Label>
                                        <Select name="role"
                                                value={formData?.role ? formData.role.name : 'N/A'}
                                                onValueChange={handleSelectChange('role')}>
                                            <SelectTrigger id="form-role"><SelectValue
                                                placeholder={t("table.selectRole")}/></SelectTrigger>
                                            <SelectContent>
                                                {UserRoleSchema.options.map(roleValue => (
                                                    <SelectItem key={roleValue}
                                                                value={roleValue}>{roleValue}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="flex flex-col gap-1.5">
                                        <Label htmlFor="form-status">{t("table.status")}</Label>
                                        <Select name="status" value={formData?.status || ''}
                                                onValueChange={handleSelectChange('status')}>
                                            <SelectTrigger id="form-status"><SelectValue
                                                placeholder={t("table.selectStatus")}/></SelectTrigger>
                                            <SelectContent>
                                                {UserStatusSchema.options.map(statusValue => (
                                                    <SelectItem key={statusValue}
                                                                value={statusValue}>{statusValue}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <Label htmlFor="form-profileImage">{t("table.profileImageUrl")}</Label>
                                    <Input id="form-profileImage" name="profileImage"
                                           value={formData?.profileImage || ''} onChange={handleChange}/>
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <Label htmlFor="form-coverImage">{t("table.coverImageUrl")}</Label>
                                    <Input id="form-coverImage" name="coverImage" value={formData?.coverImage || ''}
                                           onChange={handleChange}/>
                                </div>

                                <Separator className="my-2"/>

                                <div className="space-y-2 text-xs text-muted-foreground">
                                    <div className="flex items-center gap-2">
                                        <CalendarDaysIcon className="h-3.5 w-3.5"/>
                                        {t("table.joined")}: {selectedUserData.data.createdAt ? formatDateTS(new Date(selectedUserData.data.createdAt))
                                        : t("table.notAvailable")} ({selectedUserData.data.createdAt ? new Date(selectedUserData.data.createdAt).toLocaleTimeString() : t("table.notAvailable")})
                                    </div>
                                    {selectedUserData.data?.lastLogin && (
                                        <div className="flex items-center gap-2">
                                            <LogInIcon className="h-3.5 w-3.5"/>
                                            {t("table.lastLogin")}: {formatDateTS(new Date(selectedUserData.data.lastLogin))} ({new Date(selectedUserData.data.lastLogin).toLocaleTimeString()})
                                        </div>
                                    )}
                                </div>

                                <SheetFooter
                                    className="mt-auto flex flex-col gap-2 pt-6 sm:flex-row sm:justify-end sm:space-x-2">
                                    <SheetClose asChild>
                                        <Button variant="outline" className="w-full sm:w-auto"
                                                onClick={() => setIsSheetOpen(false)}>{t("table.cancel")}</Button>
                                    </SheetClose>
                                    <Button type="submit" className="w-full sm:w-auto">{t("table.saveChanges")}</Button>
                                </SheetFooter>
                            </form>
                        </div>
                    </>
                )}
            </SheetContent>
        </Sheet>
    );
};
