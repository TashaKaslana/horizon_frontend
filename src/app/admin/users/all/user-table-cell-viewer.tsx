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
import {UserAdminData} from "@/app/admin/users/all/user-admin-table";
import {UserStatusSchema, UserRoleSchema} from "@/schemas/user-schema";

interface TableCellViewerProps {
    onUpdate: (updatedItem: Partial<UserAdminData>) => void;
}

export const UserTableCellViewer: React.FC<TableCellViewerProps> = ({onUpdate}) => {
    const [formData, setFormData] = React.useState<Partial<UserAdminData>>();
    const [user, setUser] = React.useState<UserAdminData>(
        { id: '1', profileImage: "https://avatar.vercel.sh/alice.png", displayName: "Alice Wonderland", username: "alicew", email: "alice@example.com", role: "Admin", status: "Active", createdAt: "2023-01-15T10:00:00Z", lastLogin: "2024-03-10T10:00:00Z", coverImage: "" },
    );

    React.useEffect(() => {
        setFormData(user);
    }, [user]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({...prev, [e.target.name]: e.target.value}));
    };

    const handleSelectChange = (name: keyof UserAdminData) => (value: string) => {
        setFormData(prev => ({...prev, [name]: value}));
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const changesToSubmit = {...formData, id: user.id};
        onUpdate(changesToSubmit);
        toast.promise(new Promise((resolve) => setTimeout(resolve, 700)), {
            loading: `Updating ${user.displayName}...`,
            success: `${user.displayName} updated successfully!`,
            error: "Error updating user.",
        });
    };

    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant="link"
                        className="w-fit px-0 py-0 h-fit text-left font-medium text-foreground hover:text-primary hover:no-underline">
                    {user.displayName}
                </Button>
            </SheetTrigger>
            <SheetContent side="right" className="flex flex-col sm:max-w-md">
                <SheetHeader className="pb-4">
                    <div className="flex items-center gap-3">
                        <Avatar className="h-12 w-12">
                            <AvatarImage src={user.profileImage} alt={user.displayName}/>
                            <AvatarFallback>{user.displayName.split(' ').map(n => n[0]).join('').toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div>
                            <SheetTitle>{user.displayName}</SheetTitle>
                            <SheetDescription>@{user.username} · {user.email}</SheetDescription>
                        </div>
                    </div>
                </SheetHeader>
                <Separator/>
                <div className="flex-1 overflow-y-auto py-4 text-sm">
                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        <div className="flex flex-col gap-1.5">
                            <Label htmlFor="form-name">Full Name</Label>
                            <Input id="form-name" name="displayName" value={formData?.displayName || ''} onChange={handleChange}/>
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
                                <Label htmlFor="form-type">Role / Type</Label>
                                <Select name="role" value={formData?.role || ''}
                                        onValueChange={handleSelectChange('role')}>
                                    <SelectTrigger id="form-type"><SelectValue
                                        placeholder="Select role"/></SelectTrigger>
                                    <SelectContent>
                                        {UserRoleSchema.options.map(roleValue => (
                                            <SelectItem key={roleValue} value={roleValue}>{roleValue}</SelectItem>
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
                                            <SelectItem key={statusValue} value={statusValue}>{statusValue}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <Separator className="my-2"/>

                        <div className="space-y-2 text-xs text-muted-foreground">
                            <div className="flex items-center gap-2">
                                <CalendarDaysIcon className="h-3.5 w-3.5"/>
                                Joined: {new Date(user.createdAt).toLocaleDateString()} ({new Date(user.createdAt).toLocaleTimeString()})
                            </div>
                            {user.lastLogin && (
                                <div className="flex items-center gap-2">
                                    <LogInIcon className="h-3.5 w-3.5"/>
                                    Last
                                    Login: {new Date(user.lastLogin).toLocaleDateString()} ({new Date(user.lastLogin).toLocaleTimeString()})
                                </div>
                            )}
                        </div>

                        <SheetFooter
                            className="mt-auto flex flex-col gap-2 pt-6 sm:flex-row sm:justify-end sm:space-x-2">
                            <SheetClose asChild>
                                <Button variant="outline" className="w-full sm:w-auto">Cancel</Button>
                            </SheetClose>
                            <Button type="submit" className="w-full sm:w-auto">Save Changes</Button>
                        </SheetFooter>
                    </form>
                </div>
            </SheetContent>
        </Sheet>
    );
};
