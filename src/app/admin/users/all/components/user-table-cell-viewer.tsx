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

type UserAdminData = UserRespondDto & DraggableItem

interface UserTableCellViewerProps {
    userId?: string;
    initialDisplayName?: string;
    onUpdate?: (updatedItem: Partial<UserAdminData>) => void;
}

export const UserTableCellViewer: React.FC<UserTableCellViewerProps> = ({userId, initialDisplayName, onUpdate}) => {
    const {selectedUserData, isSelectedUserLoading, isSelectedUserError} = useUsersManagement(userId);

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
            toast.error("User data not loaded yet.");
            return;
        }
        const changesToSubmit = {...formData, id: selectedUserData.data.id};
        onUpdate?.(changesToSubmit);
        toast.promise(new Promise((resolve) => setTimeout(resolve, 700)), {
            loading: `Updating ${selectedUserData.data.displayName}...`,
            success: `${selectedUserData.data.displayName} updated successfully! (Mock)`,
            error: "Error updating user. (Mock)",
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
                        <p>Loading user details...</p>
                    </div>
                )}
                {isSelectedUserError && !isSelectedUserLoading && (
                    <div className="flex flex-col items-center justify-center h-full">
                        <p className="text-red-500">Error loading user details.</p>
                        <p className="text-xs text-muted-foreground">Could not load user information.</p>
                    </div>
                )}
                {!isSelectedUserLoading && !isSelectedUserError && selectedUserData?.data && (
                    <>
                        <SheetHeader className="pb-4">
                            <div className="flex items-center gap-3">
                                <Avatar className="h-12 w-12">
                                    <AvatarImage src={selectedUserData.data.profileImage} alt={selectedUserData.data.displayName}/>
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
                                    <Label htmlFor="form-displayName">Full Name</Label>
                                    <Input id="form-displayName" name="displayName" value={formData?.displayName || ''}
                                           onChange={handleChange}/>
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <Label htmlFor="form-username">Username</Label>
                                    <Input id="form-username" name="username" value={formData?.username || ''}
                                           onChange={handleChange}/>
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <Label htmlFor="form-email">Email</Label>
                                    <Input id="form-email" type="email" name="email" value={formData?.email || ''}
                                           onChange={handleChange}/>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="flex flex-col gap-1.5">
                                        <Label htmlFor="form-role">Role / Type</Label>
                                        <Select name="role"
                                                value={formData?.role ? formData.role.name :  'N/A'}
                                                onValueChange={handleSelectChange('role')}>
                                            <SelectTrigger id="form-role"><SelectValue
                                                placeholder="Select role"/></SelectTrigger>
                                            <SelectContent>
                                                {UserRoleSchema.options.map(roleValue => (
                                                    <SelectItem key={roleValue}
                                                                value={roleValue}>{roleValue}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="flex flex-col gap-1.5">
                                        <Label htmlFor="form-status">Status</Label>
                                        <Select name="status" value={formData?.status || ''}
                                                onValueChange={handleSelectChange('status')}>
                                            <SelectTrigger id="form-status"><SelectValue
                                                placeholder="Select status"/></SelectTrigger>
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
                                    <Label htmlFor="form-profileImage">Profile Image URL</Label>
                                    <Input id="form-profileImage" name="profileImage"
                                           value={formData?.profileImage || ''} onChange={handleChange}/>
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <Label htmlFor="form-coverImage">Cover Image URL</Label>
                                    <Input id="form-coverImage" name="coverImage" value={formData?.coverImage || ''}
                                           onChange={handleChange}/>
                                </div>

                                <Separator className="my-2"/>

                                <div className="space-y-2 text-xs text-muted-foreground">
                                    <div className="flex items-center gap-2">
                                        <CalendarDaysIcon className="h-3.5 w-3.5"/>
                                        Joined: {selectedUserData.data.createdAt ? new Date(selectedUserData.data.createdAt).toLocaleDateString() : 'N/A'} ({selectedUserData.data.createdAt ? new Date(selectedUserData.data.createdAt).toLocaleTimeString() : 'N/A'})
                                    </div>
                                    {selectedUserData.data?.lastLogin && (
                                        <div className="flex items-center gap-2">
                                            <LogInIcon className="h-3.5 w-3.5"/>
                                            Last
                                            Login: {new Date(selectedUserData.data.lastLogin).toLocaleDateString()} ({new Date(selectedUserData.data.lastLogin).toLocaleTimeString()})
                                        </div>
                                    )}
                                </div>

                                <SheetFooter
                                    className="mt-auto flex flex-col gap-2 pt-6 sm:flex-row sm:justify-end sm:space-x-2">
                                    <SheetClose asChild>
                                        <Button variant="outline" className="w-full sm:w-auto"
                                                onClick={() => setIsSheetOpen(false)}>Cancel</Button>
                                    </SheetClose>
                                    <Button type="submit" className="w-full sm:w-auto">Save Changes</Button>
                                </SheetFooter>
                            </form>
                        </div>
                    </>
                )}
            </SheetContent>
        </Sheet>
    );
};

