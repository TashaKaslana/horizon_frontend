// features/admin/UserAdminTable.tsx
"use client";

import React from "react";
import { ColumnDef } from "@tanstack/react-table";
import {
    CheckCircle2Icon,
    LoaderIcon,
    MoreVerticalIcon,
    PlusIcon,
    MailIcon, // For email
    CalendarDaysIcon, // For dates
    LogInIcon, // For last login
} from "lucide-react";
// Removed TrendingUpIcon, Area, AreaChart, CartesianGrid, XAxis as the chart is less relevant now
// import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import { toast } from "sonner";
import { z } from "zod";

import { useIsMobile } from "@/hooks/use-mobile"; // Assuming this hook exists
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
// import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"; // Chart removed
import { Checkbox } from "@/components/ui/checkbox";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"; // For profile images

// Main DataTable component
// Assuming DataTable is in components/ui based on user's path
import { DataTable } from "@/components/ui/data-table";
// DND specific components and types
import {
    DraggableItem,
    DragHandleCell,
    DraggableCellContextExtensions,
} from "@/components/common/dnd-table-components";
// Table utility components
import { DataTableColumnHeader } from "@/components/common/data-table-components";


// New Schema
export const UserAdminSchema = z.object({
    id: z.number(),
    profileImage: z.string().optional(),
    name: z.string(),
    username: z.string(),
    email: z.string().email(),
    type: z.enum(["Admin", "Editor", "Viewer", "Support", "Billing"]),
    status: z.enum(["Active", "Pending", "Suspended", "Deactivated"]),
    createdAt: z.string(), // ISO date string
    lastLogin: z.string().optional(), // ISO date string
});

export type UserAdminData = z.infer<typeof UserAdminSchema> & DraggableItem;

// Mock Data - 15 users
const mockUserAdminData: UserAdminData[] = [
    { id: 1, profileImage: "https://avatar.vercel.sh/alice.png", name: "Alice Wonderland", username: "alicew", email: "alice@example.com", type: "Admin", status: "Active", createdAt: "2023-01-15T10:00:00Z", lastLogin: "2024-03-10T10:00:00Z" },
    { id: 2, profileImage: "https://avatar.vercel.sh/bob.png", name: "Bob The Builder", username: "bobthebuilder", email: "bob@example.com", type: "Editor", status: "Pending", createdAt: "2023-02-20T11:30:00Z", lastLogin: "2024-03-09T11:30:00Z" },
    { id: 3, name: "Charlie Brown", username: "charlieb", email: "charlie@example.com", type: "Viewer", status: "Active", createdAt: "2023-03-10T09:15:00Z", lastLogin: "2024-03-10T09:15:00Z" },
    { id: 4, profileImage: "https://avatar.vercel.sh/diana.png", name: "Diana Prince", username: "wonderwoman", email: "diana@example.com", type: "Admin", status: "Suspended", createdAt: "2023-04-05T16:45:00Z" },
    { id: 5, name: "Edward Scissorhands", username: "edwardscissor", email: "edward@example.com", type: "Editor", status: "Active", createdAt: "2023-05-12T14:00:00Z", lastLogin: "2024-03-08T14:00:00Z" },
    { id: 6, profileImage: "https://avatar.vercel.sh/fiona.png", name: "Fiona Gallagher", username: "fionag", email: "fiona@example.com", type: "Support", status: "Active", createdAt: "2023-06-18T10:00:00Z", lastLogin: "2024-03-10T08:00:00Z" },
    { id: 7, name: "George Costanza", username: "georgec", email: "george@example.com", type: "Billing", status: "Deactivated", createdAt: "2023-07-22T11:00:00Z" },
    { id: 8, profileImage: "https://avatar.vercel.sh/harry.png", name: "Harry Potter", username: "hpotter", email: "harry@example.com", type: "Admin", status: "Active", createdAt: "2023-08-01T12:00:00Z", lastLogin: "2024-03-10T12:00:00Z" },
    { id: 9, name: "Irene Adler", username: "ireneadler", email: "irene@example.com", type: "Editor", status: "Pending", createdAt: "2023-09-10T13:00:00Z" },
    { id: 10, profileImage: "https://avatar.vercel.sh/jack.png", name: "Jack Sparrow", username: "captainjack", email: "jack@example.com", type: "Viewer", status: "Active", createdAt: "2023-10-15T14:00:00Z", lastLogin: "2024-03-05T14:00:00Z" },
    { id: 11, name: "Kevin McCallister", username: "kevinhome", email: "kevin@example.com", type: "Support", status: "Suspended", createdAt: "2023-11-20T15:00:00Z", lastLogin: "2024-02-20T15:00:00Z" },
    { id: 12, profileImage: "https://avatar.vercel.sh/lucy.png", name: "Lucy Pevensie", username: "lucyp", email: "lucy@example.com", type: "Billing", status: "Active", createdAt: "2023-12-01T16:00:00Z", lastLogin: "2024-03-10T10:30:00Z" },
    { id: 13, name: "Michael Scott", username: "michaelscott", email: "michael@example.com", type: "Admin", status: "Active", createdAt: "2024-01-05T17:00:00Z", lastLogin: "2024-03-10T17:00:00Z" },
    { id: 14, profileImage: "https://avatar.vercel.sh/neo.png", name: "Neo Anderson", username: "theone", email: "neo@example.com", type: "Editor", status: "Pending", createdAt: "2024-02-10T18:00:00Z" },
    { id: 15, name: "Olivia Benson", username: "oliviab", email: "olivia@example.com", type: "Viewer", status: "Active", createdAt: "2024-03-01T19:00:00Z", lastLogin: "2024-03-09T19:00:00Z" },
];

// TableCellViewer - Updated for the new schema
interface TableCellViewerProps {
    item: UserAdminData;
    onUpdate: (updatedItem: Partial<UserAdminData>) => void;
}

const TableCellViewer: React.FC<TableCellViewerProps> = ({ item, onUpdate }) => {
    const [formData, setFormData] = React.useState<Partial<UserAdminData>>(item);

    React.useEffect(() => {
        setFormData(item);
    }, [item]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSelectChange = (name: keyof UserAdminData) => (value: string) => {
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const changesToSubmit = { ...formData, id: item.id };
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
                <Button variant="link" className="w-fit px-0 py-0 h-fit text-left font-medium text-foreground hover:text-primary hover:no-underline">
                    {item.name} {/* Use item.name for the trigger */}
                </Button>
            </SheetTrigger>
            <SheetContent side="right" className="flex flex-col sm:max-w-md"> {/* Adjusted width slightly */}
                <SheetHeader className="pb-4">
                    <div className="flex items-center gap-3">
                        <Avatar className="h-12 w-12">
                            <AvatarImage src={item.profileImage} alt={item.name} />
                            <AvatarFallback>{item.name.split(' ').map(n=>n[0]).join('').toUpperCase()}</AvatarFallback>
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
                            <Input id="form-name" name="name" value={formData.name || ''} onChange={handleChange} />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <Label htmlFor="form-username">Username</Label>
                            <Input id="form-username" name="username" value={formData.username || ''} onChange={handleChange} />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <Label htmlFor="form-email">Email</Label>
                            <Input id="form-email" type="email" name="email" value={formData.email || ''} onChange={handleChange} />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex flex-col gap-1.5">
                                <Label htmlFor="form-type">Role / Type</Label>
                                <Select name="type" value={formData.type || ''} onValueChange={handleSelectChange('type')}>
                                    <SelectTrigger id="form-type"><SelectValue placeholder="Select role" /></SelectTrigger>
                                    <SelectContent>
                                        {UserAdminSchema.shape.type.options.map(type => (
                                            <SelectItem key={type} value={type}>{type}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <Label htmlFor="form-status">Status</Label>
                                <Select name="status" value={formData.status || ''} onValueChange={handleSelectChange('status')}>
                                    <SelectTrigger id="form-status"><SelectValue placeholder="Select status" /></SelectTrigger>
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
                                    Last Login: {new Date(item.lastLogin).toLocaleDateString()} ({new Date(item.lastLogin).toLocaleTimeString()})
                                </div>
                            )}
                        </div>

                        <SheetFooter className="mt-auto flex flex-col gap-2 pt-6 sm:flex-row sm:justify-end sm:space-x-2">
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


// User Admin Table Component
export function UserAdminTable() { // Renamed from UserAdminTablePage for consistency
    const [data, setData] = React.useState<UserAdminData[]>(() => mockUserAdminData);

    const handleUpdateItem = React.useCallback((updatedItem: Partial<UserAdminData>) => {
        setData(currentData =>
            currentData.map(item =>
                item.id === updatedItem.id ? { ...item, ...updatedItem } : item
            )
        );
    }, []);

    const columns = React.useMemo<ColumnDef<UserAdminData>[]>(() => [
        {
            id: "drag",
            header: () => null,
            cell: (props) => <DragHandleCell {...props} />,
            size: 40, enableSorting: false, enableHiding: false,
        },
        {
            id: "select",
            header: ({ table }) => (
                <div className="flex items-center justify-center px-1">
                    <Checkbox
                        checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
                        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                        aria-label="Select all" onClick={(e) => e.stopPropagation()}
                    />
                </div>
            ),
            cell: ({ row }) => (
                <div className="flex items-center justify-center px-1">
                    <Checkbox
                        checked={row.getIsSelected()}
                        onCheckedChange={(value) => row.toggleSelected(!!value)}
                        aria-label="Select row" onClick={(e) => e.stopPropagation()}
                    />
                </div>
            ),
            enableSorting: false, enableHiding: false, size: 40,
        },
        {
            accessorKey: "name", // Used for sorting by name
            header: ({ column }) => <DataTableColumnHeader column={column} title="User" />,
            cell: ({ row }) => {
                const user = row.original;
                return (
                    <div className="flex items-center gap-1 py-0.5 min-w-[200px]">
                        <Avatar className="h-9 w-9 flex-shrink-0">
                            <AvatarImage src={user.profileImage} alt={user.name} />
                            <AvatarFallback>{user.name.split(' ').map(n=>n[0]).join('').toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col gap-1">
                            {/* TableCellViewer provides its own trigger (user.name) */}
                            <TableCellViewer item={user} onUpdate={handleUpdateItem} />
                            <span className="text-xs text-muted-foreground italic">@{user.username}</span>
                        </div>
                    </div>
                );
            },
            enableHiding: false,
        },
        {
            accessorKey: "email",
            header: ({ column }) => <DataTableColumnHeader column={column} title="Email" />,
            cell: ({ row }) => (
                <div className="flex items-center gap-2 text-sm">
                    <MailIcon className="h-3.5 w-3.5 text-muted-foreground"/>
                    <a href={`mailto:${row.original.email}`} className="hover:underline" onClick={e => e.stopPropagation()}>
                        {row.original.email}
                    </a>
                </div>
            ),
        },
        {
            accessorKey: "type",
            header: ({ column }) => <DataTableColumnHeader column={column} title="Role" />,
            cell: ({ row }) => <Badge variant="outline" className="px-2 py-0.5 text-xs">{row.original.type}</Badge>,
        },
        {
            accessorKey: "status",
            header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
            cell: ({ row }) => {
                const status = row.original.status;
                let icon = <div className="size-2.5 rounded-full bg-slate-400" />;
                if (status === "Active") icon = <CheckCircle2Icon className="size-3.5 text-green-500" />;
                else if (status === "Pending") icon = <LoaderIcon className="size-3.5 animate-spin text-amber-500" />;
                else if (status === "Suspended") icon = <LoaderIcon className="size-3.5 text-red-500" />; // Using Loader as placeholder for suspended

                return (
                    <Badge variant={status === "Active" ? "default" : "secondary"} className="flex w-fit items-center gap-1.5 px-2 py-1 text-xs">
                        {icon} {status}
                    </Badge>
                );
            },
        },
        {
            accessorKey: "lastLogin",
            header: ({ column }) => <DataTableColumnHeader column={column} title="Last Login" />,
            cell: ({ row }) => row.original.lastLogin ?
                <div className="text-xs text-muted-foreground min-w-[90px]">{new Date(row.original.lastLogin).toLocaleDateString()}</div> :
                <span className="text-xs text-muted-foreground/70">Never</span>,
        },
        {
            id: "actions",
            cell: ({ row }) => (
                <div className="flex justify-end">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="flex size-8 p-0 data-[state=open]:bg-muted" onClick={(e) => e.stopPropagation()}>
                                <MoreVerticalIcon className="size-4" /> <span className="sr-only">Open menu</span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-32">
                            <DropdownMenuItem onSelect={() => toast.info(`Editing ${row.original.name}`)}>Edit</DropdownMenuItem>
                            <DropdownMenuItem onSelect={() => toast.info(`Viewing details for ${row.original.name}`)}>View Details</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600 hover:!text-red-600 hover:!bg-red-100 dark:hover:!bg-red-700/50" onSelect={() => {
                                toast.error(`Deleting ${row.original.name}`);
                                setData(prev => prev.filter(item => item.id !== row.original.id));
                            }}>
                                Delete
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            ),
            size: 50, enableSorting: false, enableHiding: false,
        },
    ], [handleUpdateItem]);

    return (
        <Tabs defaultValue="userList" className="flex w-full flex-col justify-start gap-6 p-4 md:p-6">
            <div className="flex flex-wrap items-center justify-between gap-2">
                <TabsList className="hidden md:flex">
                    <TabsTrigger value="userList">User List</TabsTrigger>
                    <TabsTrigger value="activityLog" className="gap-1">
                        Activity Log{" "}
                        <Badge variant="secondary" className="flex h-5 w-5 items-center justify-center rounded-full bg-muted-foreground/20">
                            {data?.length}
                        </Badge>
                    </TabsTrigger>
                </TabsList>
                <div className="flex items-center gap-2">
                    <Button variant="default" size="sm" className="gap-1.5" onClick={() => toast.success("Add User Clicked!")}>
                        <PlusIcon className="size-4" />
                        <span className="hidden lg:inline">Add User</span>
                        <span className="lg:hidden">Add</span>
                    </Button>
                </div>
            </div>

            <TabsContent value="userList" className="relative flex flex-col gap-4 overflow-auto">
                <DataTable
                    columns={columns}
                    data={data}
                    setData={setData}
                    enableDnd={true}
                    enableRowSelection={true}
                    filterPlaceholder="Search users, emails, roles..."
                />
            </TabsContent>

            <TabsContent value="activityLog" className="flex flex-col">
                <div className="flex aspect-[16/7] w-full flex-1 items-center justify-center rounded-lg border border-dashed p-4">
                    <p className="text-center text-muted-foreground">Activity Log Content - Placeholder</p>
                </div>
            </TabsContent>
        </Tabs>
    );
}