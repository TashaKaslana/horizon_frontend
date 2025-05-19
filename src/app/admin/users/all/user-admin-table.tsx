"use client";

import React from "react";
import {ColumnDef} from "@tanstack/react-table";
import {CheckCircle2Icon, LoaderIcon, MailIcon, MoreVerticalIcon, PlusIcon,} from "lucide-react";
import {toast} from "sonner";

import {Badge} from "@/components/ui/badge";
import {Button} from "@/components/ui/button";
import {Checkbox} from "@/components/ui/checkbox";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {Tabs, TabsContent, TabsList, TabsTrigger,} from "@/components/ui/tabs";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {DataTable} from "@/components/ui/data-table";
import {DraggableItem, DragHandleCell,} from "@/components/common/dnd-table-components";
import {DataTableColumnHeader} from "@/components/common/data-table-components";
import {UserTableCellViewer} from "@/app/admin/users/all/user-table-cell-viewer";
import {UserSummaryAdmin} from "@/schemas/user-schema";

export type UserAdminData = UserSummaryAdmin & DraggableItem;

const mockUserAdminData: UserSummaryAdmin[] = [
    { id: '1', profileImage: "https://avatar.vercel.sh/alice.png", displayName: "Alice Wonderland", username: "alicew", email: "alice@example.com", role: "Admin", status: "Active", createdAt: "2023-01-15T10:00:00Z", lastLogin: "2024-03-10T10:00:00Z", coverImage: "" },
    { id: '2', profileImage: "https://avatar.vercel.sh/bob.png", displayName: "Bob The Builder", username: "bobthebuilder", email: "bob@example.com", role: "Editor", status: "Pending", createdAt: "2023-02-20T11:30:00Z", lastLogin: "2024-03-09T11:30:00Z", coverImage: "" },
    { id: '3', profileImage: "https://avatar.vercel.sh/diana.png",displayName: "Charlie Brown", username: "charlieb", email: "charlie@example.com", role: "Viewer", status: "Active", createdAt: "2023-03-10T09:15:00Z", lastLogin: "2024-03-10T09:15:00Z", coverImage: "" },
    { id: '4', profileImage: "https://avatar.vercel.sh/diana.png", displayName: "Diana Prince", username: "wonderwoman", email: "diana@example.com", role: "Admin", status: "Suspended", createdAt: "2023-04-05T16:45:00Z", coverImage: "" },
    { id: '5', profileImage: "https://avatar.vercel.sh/diana.png",displayName: "Edward Scissorhands", username: "edwardscissor", email: "edward@example.com", role: "Editor", status: "Active", createdAt: "2023-05-12T14:00:00Z", lastLogin: "2024-03-08T14:00:00Z" , coverImage: ""},
    { id: '6', profileImage: "https://avatar.vercel.sh/fiona.png", displayName: "Fiona Gallagher", username: "fionag", email: "fiona@example.com", role: "Support", status: "Active", createdAt: "2023-06-18T10:00:00Z", lastLogin: "2024-03-10T08:00:00Z", coverImage: "" },
    { id: '7', profileImage: "https://avatar.vercel.sh/diana.png",displayName: "George Costanza", username: "georgec", email: "george@example.com", role: "Billing", status: "Deactivated", createdAt: "2023-07-22T11:00:00Z" , coverImage: ""},
    { id: '8', profileImage: "https://avatar.vercel.sh/harry.png", displayName: "Harry Potter", username: "hpotter", email: "harry@example.com", role: "Admin", status: "Active", createdAt: "2023-08-01T12:00:00Z", lastLogin: "2024-03-10T12:00:00Z", coverImage: "" },
    { id: '9', profileImage: "https://avatar.vercel.sh/diana.png",displayName: "Irene Adler", username: "ireneadler", email: "irene@example.com", role: "Editor", status: "Pending", createdAt: "2023-09-10T13:00:00Z" , coverImage: ""},
    { id: '10', profileImage: "https://avatar.vercel.sh/jack.png", displayName: "Jack Sparrow", username: "captainjack", email: "jack@example.com", role: "Viewer", status: "Active", createdAt: "2023-10-15T14:00:00Z", lastLogin: "2024-03-05T14:00:00Z", coverImage: "" },
    { id: '11', profileImage: "https://avatar.vercel.sh/diana.png",displayName: "Kevin McCallister", username: "kevinhome", email: "kevin@example.com", role: "Support", status: "Suspended", createdAt: "2023-11-20T15:00:00Z", lastLogin: "2024-02-20T15:00:00Z" , coverImage: ""},
    { id: '12', profileImage: "https://avatar.vercel.sh/lucy.png", displayName: "Lucy Pevensie", username: "lucyp", email: "lucy@example.com", role: "Billing", status: "Active", createdAt: "2023-12-01T16:00:00Z", lastLogin: "2024-03-10T10:30:00Z", coverImage: "" },
    { id: '13', profileImage: "https://avatar.vercel.sh/diana.png",displayName: "Michael Scott", username: "michaelscott", email: "michael@example.com", role: "Admin", status: "Active", createdAt: "2024-01-05T17:00:00Z", lastLogin: "2024-03-10T17:00:00Z", coverImage: "" },
    { id: '14', profileImage: "https://avatar.vercel.sh/neo.png", displayName: "Neo Anderson", username: "theone", email: "neo@example.com", role: "Editor", status: "Pending", createdAt: "2024-02-10T18:00:00Z" , coverImage: ""},
    { id: '15', profileImage: "https://avatar.vercel.sh/diana.png", displayName: "Olivia Benson", username: "oliviab", email: "olivia@example.com", role: "Viewer", status: "Active", createdAt: "2024-03-01T19:00:00Z", lastLogin: "2024-03-09T19:00:00Z" , coverImage: ""},
];

export function UserAdminTable() {
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
            accessorKey: "name",
            header: ({ column }) => <DataTableColumnHeader column={column} title="User" />,
            cell: ({ row }) => {
                const user = row.original;
                return (
                    <div className="flex items-center gap-1 py-0.5 min-w-[200px]">
                        <Avatar className="h-9 w-9 flex-shrink-0">
                            <AvatarImage src={user.profileImage} alt={user.displayName} />
                            <AvatarFallback>{user.displayName.split(' ').map(n=>n[0]).join('').toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col gap-1">
                            {/* TableCellViewer provides its own trigger (user.displayName) */}
                            <UserTableCellViewer userId={user.id} onUpdate={handleUpdateItem} initialDisplayName={'Halle'}/>
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
            cell: ({ row }) => <Badge variant="outline" className="px-2 py-0.5 text-xs">{row.original.role}</Badge>,
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
                            <DropdownMenuItem onSelect={() => toast.info(`Editing ${row.original.displayName}`)}>Edit</DropdownMenuItem>
                            <DropdownMenuItem onSelect={() => toast.info(`Viewing details for ${row.original.displayName}`)}>View Details</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600 hover:!text-red-600 hover:!bg-red-100 dark:hover:!bg-red-700/50" onSelect={() => {
                                toast.error(`Deleting ${row.original.displayName}`);
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

