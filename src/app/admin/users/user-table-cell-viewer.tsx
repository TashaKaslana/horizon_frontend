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
import {UserAdminData, UserAdminSchema} from "@/app/admin/users/user-admin-table";

interface TableCellViewerProps {
    item: UserAdminData;
    onUpdate: (updatedItem: Partial<UserAdminData>) => void;
}

export const UserTableCellViewer: React.FC<TableCellViewerProps> = ({item, onUpdate}) => {
    const [formData, setFormData] = React.useState<Partial<UserAdminData>>(item);

    React.useEffect(() => {
        setFormData(item);
    }, [item]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({...prev, [e.target.name]: e.target.value}));
    };

    const handleSelectChange = (name: keyof UserAdminData) => (value: string) => {
        setFormData(prev => ({...prev, [name]: value}));
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const changesToSubmit = {...formData, id: item.id};
        onUpdate(changesToSubmit);
        toast.promise(new Promise((resolve) => setTimeout(resolve, 700)), {
            loading: `Updating ${item.name}...`,
            success: `${item.name} updated successfully!`,
            error: "Error updating item.",
        });
    };

    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant="link"
                        className="w-fit px-0 py-0 h-fit text-left font-medium text-foreground hover:text-primary hover:no-underline">
                    {item.name} {/* Use item.name for the trigger */}
                </Button>
            </SheetTrigger>
            <SheetContent side="right" className="flex flex-col sm:max-w-md"> {/* Adjusted width slightly */}
                <SheetHeader className="pb-4">
                    <div className="flex items-center gap-3">
                        <Avatar className="h-12 w-12">
                            <AvatarImage src={item.profileImage} alt={item.name}/>
                            <AvatarFallback>{item.name.split(' ').map(n => n[0]).join('').toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div>
                            <SheetTitle>{item.name}</SheetTitle>
                            <SheetDescription>@{item.username} · {item.email}</SheetDescription>
                        </div>
                    </div>
                </SheetHeader>
                <Separator/>
                <div className="flex-1 overflow-y-auto py-4 text-sm">
                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        <div className="flex flex-col gap-1.5">
                            <Label htmlFor="form-name">Full Name</Label>
                            <Input id="form-name" name="name" value={formData.name || ''} onChange={handleChange}/>
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <Label htmlFor="form-username">Username</Label>
                            <Input id="form-username" name="username" value={formData.username || ''}
                                   onChange={handleChange}/>
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <Label htmlFor="form-email">Email</Label>
                            <Input id="form-email" type="email" name="email" value={formData.email || ''}
                                   onChange={handleChange}/>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex flex-col gap-1.5">
                                <Label htmlFor="form-type">Role / Type</Label>
                                <Select name="type" value={formData.type || ''}
                                        onValueChange={handleSelectChange('type')}>
                                    <SelectTrigger id="form-type"><SelectValue
                                        placeholder="Select role"/></SelectTrigger>
                                    <SelectContent>
                                        {UserAdminSchema.shape.type.options.map(type => (
                                            <SelectItem key={type} value={type}>{type}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <Label htmlFor="form-status">Status</Label>
                                <Select name="status" value={formData.status || ''}
                                        onValueChange={handleSelectChange('status')}>
                                    <SelectTrigger id="form-status"><SelectValue
                                        placeholder="Select status"/></SelectTrigger>
                                    <SelectContent>
                                        {UserAdminSchema.shape.status.options.map(status => (
                                            <SelectItem key={status} value={status}>{status}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <Separator className="my-2"/>

                        <div className="space-y-2 text-xs text-muted-foreground">
                            <div className="flex items-center gap-2">
                                <CalendarDaysIcon className="h-3.5 w-3.5"/>
                                Joined: {new Date(item.createdAt).toLocaleDateString()} ({new Date(item.createdAt).toLocaleTimeString()})
                            </div>
                            {item.lastLogin && (
                                <div className="flex items-center gap-2">
                                    <LogInIcon className="h-3.5 w-3.5"/>
                                    Last
                                    Login: {new Date(item.lastLogin).toLocaleDateString()} ({new Date(item.lastLogin).toLocaleTimeString()})
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