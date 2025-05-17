"use client";

import React from "react";
import { z } from "zod";
import { ColumnDef } from "@tanstack/react-table"; // Row is implicitly used by ColumnDef's cell context
import { DataTable, DraggableItem } from "@/components/ui/data-table";
import {
    TableSelectHeader,
    TableSelectCell,
} from "@/components/common/table-select-components";
import { DragHandleCell } from "@/components/common/dnd-table-components";
import { SheetCellRenderer } from "@/components/common/sheet-cell-renderer";
import { DataTableColumnHeader } from "@/components/common/data-table-components";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { CheckCircle2Icon, LoaderIcon, TrashIcon, UserPlusIcon } from "lucide-react"; // Added UserPlusIcon
import { toast } from "sonner";
import {TableActionItem, TableActionsCell} from "@/components/common/table-action-cell"; // Import arrayMove at the top

// 1. Define your schema
const UserSchema = z.object({
    id: z.union([z.string(), z.number()]),
    name: z.string().min(1, "Name is required"),
    username: z.string().optional(),
    email: z.string().email("Invalid email address"), // Added email
    avatarUrl: z.string().url("Invalid URL").nullable().optional(), // Added avatarUrl
    type: z.enum(["Admin", "Editor", "Viewer", "Guest"]),
    status: z.enum(["Active", "Pending", "Disabled", "Invited"]),
    createdAt: z.string(),
    lastLogin: z.string().nullable(),
});

// Ensure User type is compatible with DraggableItem
type UserInput = z.input<typeof UserSchema>; // For initial data before parsing
type User = z.output<typeof UserSchema> & DraggableItem; // For parsed data used in the table

// 2. --- Mock Data & State ---
// Initial data should match the input type of the schema if you parse it
const initialUsersData: UserInput[] = [
    {
        id: 1, name: "Alice Wonderland", username: "alice", email: "alice@example.com",
        avatarUrl: "https://i.pravatar.cc/48?u=alice", // Using pravatar for placeholders
        type: "Admin", status: "Active", createdAt: new Date().toISOString(), lastLogin: new Date().toISOString()
    },
    {
        id: 2, name: "Bob The Builder", username: "bob", email: "bob@example.com",
        avatarUrl: null, // No avatar
        type: "Editor", status: "Pending", createdAt: new Date().toISOString(), lastLogin: null
    },
    {
        id: 3, name: "Charlie Chaplin", username: "charlie", email: "charlie@example.com",
        avatarUrl: "https://i.pravatar.cc/48?u=charlie",
        type: "Viewer", status: "Disabled", createdAt: new Date().toISOString(), lastLogin: new Date().toISOString()
    },
    {
        id: 4, name: "Diana Prince", username: "diana", email: "diana@example.com",
        avatarUrl: "https://i.pravatar.cc/48?u=diana",
        type: "Admin", status: "Invited", createdAt: new Date().toISOString(), lastLogin: null
    },
];

const getInitials = (name?: string) => {
    if (!name) return 'U';
    const names = name.split(' ');
    const initials = names.map(n => n[0]).join('');
    return initials.substring(0, 2).toUpperCase();
};

// 3. --- User Form for Sheet ---
const UserForm = ({ user, onSave, closeSheet }: { user: User, onSave: (updatedUser: User) => void, closeSheet: () => void }) => {
    // Initialize form with data that matches the User type (parsed)
    const [formData, setFormData] = React.useState<Partial<User>>({
        ...user,
        // Dates are already strings in the User type if not transformed by Zod for output
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSelectChange = (name: keyof User, value: string) => {
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const updatedUserData = UserSchema.partial().parse(formData);
            onSave({ ...user, ...updatedUserData } as User);
            toast.success(`${formData.name || user.name} updated!`);
            closeSheet();
        } catch (error) {
            if (error instanceof z.ZodError) {
                error.errors.forEach(err => toast.error(`${err.path.join('.')}: ${err.message}`));
                console.error("Validation errors:", error.flatten());
            } else {
                toast.error("An unexpected error occurred.");
            }
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <Label htmlFor="avatarUrl">Avatar URL</Label>
                <Input
                    id="avatarUrl"
                    name="avatarUrl"
                    type="url"
                    value={formData.avatarUrl || ""}
                    onChange={handleChange}
                    placeholder="https://example.com/image.png"
                />
                {(formData.avatarUrl || user.avatarUrl) && ( // Show preview if URL exists
                    <Avatar className="mt-2 h-20 w-20">
                        <AvatarImage src={formData.avatarUrl || user.avatarUrl || undefined} alt={formData.name || user.name} />
                        <AvatarFallback>{getInitials(formData.name || user.name)}</AvatarFallback>
                    </Avatar>
                )}
            </div>
            <div>
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" name="name" value={formData.name || ""} onChange={handleChange} required />
            </div>
            <div>
                <Label htmlFor="email">Email Address</Label>
                <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email || ""}
                    onChange={handleChange}
                    required
                />
            </div>
            <div>
                <Label htmlFor="username">Username</Label>
                <Input id="username" name="username" value={formData.username || ""} onChange={handleChange} />
            </div>
            <div>
                <Label htmlFor="type">Type</Label>
                <Select name="type" value={formData.type || ""} onValueChange={(val) => handleSelectChange('type', val)}>
                    <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                    <SelectContent>
                        {UserSchema.shape.type.options.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
                    </SelectContent>
                </Select>
            </div>
            <div>
                <Label htmlFor="status">Status</Label>
                <Select name="status" value={formData.status || ""} onValueChange={(val) => handleSelectChange('status', val)}>
                    <SelectTrigger><SelectValue placeholder="Select status" /></SelectTrigger>
                    <SelectContent>
                        {UserSchema.shape.status.options.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
                    </SelectContent>
                </Select>
            </div>
            <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={closeSheet}>Cancel</Button>
                <Button type="submit">Save Changes</Button>
            </div>
        </form>
    );
};


// 4. This component now just renders the User Table and its controls
export function UserTableSection() {
    const [users, setUsers] = React.useState<User[]>(() =>
        initialUsersData.map(uInput => {
            try {
                // Parse raw input data to conform to the User (output) schema
                // The Zod schema itself doesn't have .transform for createdAt/lastLogin anymore
                // So User type will have string dates as defined in UserSchema
                return UserSchema.parse(uInput) as User;
            } catch (e) {
                console.error("Failed to parse initial user data:", uInput, e);
                // Fallback: ensure an ID for DraggableItem compatibility
                const fallbackId = uInput.id ?? `fallback-${Math.random().toString(36).substring(2, 9)}`;
                return { ...uInput, id: fallbackId } as unknown as User; // Be careful with casting
            }
        })
    );
    const [isLoading, setIsLoading] = React.useState(false); // For demo

    const handleSaveUser = (updatedUser: User) => {
        setUsers(prevUsers => prevUsers.map(u => u.id === updatedUser.id ? updatedUser : u));
    };

    const handleDeleteUser = (userId: User['id']) => {
        setUsers(prevUsers => prevUsers.filter(u => u.id !== userId));
        toast.error("User deleted (demo)");
    };

    const handleAddUser = () => {
        // Example: Open a modal or navigate to a new user page
        // For this demo, let's add a placeholder user directly
        const newId = Math.max(0, ...users.map(u => typeof u.id === 'number' ? u.id : 0)) + 1;
        const newUserInput: UserInput = {
            id: newId,
            name: "New User",
            username: `user${newId}`,
            email: 'example@gmail.com',
            type: "Viewer",
            status: "Pending",
            createdAt: new Date().toISOString(),
            lastLogin: null,
        };
        try {
            const newUser = UserSchema.parse(newUserInput) as User;
            setUsers(prev => [newUser, ...prev]);
            toast.success("New user added (placeholder)");
        } catch (e) {
            console.error("Error adding new user:", e);
            toast.error("Could not add new user.");
        }
    };

    const userActions = (rowData: User): TableActionItem<User>[] => [
        { label: "Delete", onClick: () => handleDeleteUser(rowData.id), isDestructive: true, icon: <TrashIcon size={14}/> },
    ];

    // Define columns for the DataTable
    const columns: ColumnDef<User, any>[] = [
        {
            id: "drag",
            header: () => null,
            cell: ({ row }) => <DragHandleCell rowId={row.original.id} />,
            size: 30,
        },
        {
            id: "select",
            header: ({ table }) => <TableSelectHeader table={table} />,
            cell: ({ row }) => <TableSelectCell row={row} />,
            enableSorting: false,
            enableHiding: false,
            size: 30,
        },
        {
            accessorKey: "name", // This column will now include the avatar
            header: ({ column }) => <DataTableColumnHeader column={column} title="Name" />,
            cell: ({ row }) => (
                <div className="flex items-center gap-3"> {/* Increased gap for avatar */}
                    <Avatar className="h-9 w-9"> {/* Slightly larger avatar in table */}
                        <AvatarImage src={row.original.avatarUrl ?? undefined} alt={row.original.name} />
                        <AvatarFallback>{getInitials(row.original.name)}</AvatarFallback>
                    </Avatar>
                    <SheetCellRenderer<User>
                        row={row}
                        triggerText={row.original.name}
                        sheetTitle={`Edit User: ${row.original.name}`}
                        sheetDescription="Make changes to the user profile below."
                    >
                        {(rowData, closeSheet) => (
                            <UserForm user={rowData} onSave={handleSaveUser} closeSheet={closeSheet} />
                        )}
                    </SheetCellRenderer>
                </div>
            ),
            size: 250, // Adjust size if needed for avatar + name
        },
        {
            accessorKey: "email",
            header: ({ column }) => <DataTableColumnHeader column={column} title="Email" />,
            cell: ({ row }) => (
                <a
                    href={`mailto:${row.original.email}`}
                    className="hover:underline text-sm" // Added text-sm for consistency
                    onClick={(e) => e.stopPropagation()}
                >
                    {row.original.email}
                </a>
            ),
            size: 220,
        },
        {
            accessorKey: "username",
            header: ({ column }) => <DataTableColumnHeader column={column} title="Username" />,
            cell: ({ row }) => <span className="text-sm">{row.original.username || "N/A"}</span>, // Added text-sm
            size: 120, // Adjusted size
        },
        {
            accessorKey: "type",
            header: ({ column }) => <DataTableColumnHeader column={column} title="Type" />,
            cell: ({ row }) => <Badge variant="outline">{row.original.type}</Badge>,
            size: 100,
        },
        {
            accessorKey: "status",
            header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
            cell: ({ row }) => (
                <Badge
                    variant={row.original.status === "Active" ? "default" : "secondary"}
                    className="gap-1 items-center"
                >
                    {row.original.status === "Active" ? <CheckCircle2Icon size={14} className="text-green-500 mr-1" /> :
                        row.original.status === "Pending" ? <LoaderIcon size={14} className="animate-spin mr-1"/> : null}
                    {row.original.status}
                </Badge>
            ),
            size: 120,
        },
        {
            accessorKey: "createdAt",
            header: ({ column }) => <DataTableColumnHeader column={column} title="Created" />,
            cell: ({ row }) => <span className="text-sm">{new Date(row.original.createdAt).toLocaleDateString()}</span>, // Added text-sm
            size: 110, // Adjusted size
        },
        {
            accessorKey: "lastLogin",
            header: ({ column }) => <DataTableColumnHeader column={column} title="Last Login" />,
            cell: ({ row }) => <span className="text-sm">{row.original.lastLogin ? new Date(row.original.lastLogin).toLocaleString() : "Never"}</span>, // Added text-sm
            size: 160, // Adjusted size
        },
        {
            id: "actions",
            cell: ({ row }) => <TableActionsCell row={row} actions={userActions(row.original)} />,
            size: 50,
        },
    ];

    // Removed `handleTableDragEnd` because the default `onDragEnd` in `DataTable`
    // should work if `setData` is provided and `arrayMove` is imported at the top of `DataTable.tsx`.
    // If you still need custom logic, you can re-add it and pass it to `onDragEnd` prop.

    return (
        // This div is the container for THIS SPECIFIC table instance and its controls
        <div className="space-y-6 px-2 pb-2"> {/* Added some spacing */}
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">User List</h2> {/* Title for this table section */}
                <Button onClick={handleAddUser} size="sm">
                    <UserPlusIcon className="mr-2 h-4 w-4" /> Add User
                </Button>
            </div>
            <DataTable<User, any>
                columns={columns}
                data={users}
                setData={setUsers} // Crucial for DND state updates
                isLoading={isLoading}
                enableDnd={true}
                filterPlaceholder="Search users by name, type, status..."
                enableRowSelection={true}
                initialSort={[{id: 'name', desc: false}]} // Example initial sort
            />
        </div>
    );
}