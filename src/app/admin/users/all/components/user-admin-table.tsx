"use client";

import React, {useEffect} from "react";
import {ColumnDef, RowSelectionState} from "@tanstack/react-table";
import {CheckCircle2Icon, LoaderIcon, MailIcon, MoreVerticalIcon, PlusIcon,} from "lucide-react";
import {useTranslations} from "next-intl";

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
import {UserTableCellViewer} from "@/app/admin/users/all/components/user-table-cell-viewer";
import {UserIntroduction} from "@/api/client";
import useUsersStore from "@/app/admin/users/all/store/useUsersStore";
import useUsersManagement from "../hooks/useUsersManagement";
import {useUserTableActions} from "@/app/admin/users/all/components/use-user-table-actions";
import AddUserSheet from "./add-user-sheet";

export type UserAdminData = UserIntroduction & DraggableItem;

export function UserAdminTable() {
    const {fetchNextPage, isFetchingNextPage, hasNextPage, isLoading} = useUsersManagement()
    const {users} = useUsersStore()
    const [data, setData] = React.useState<UserAdminData[]>([]);
    const t = useTranslations('Admin.users.all');
    const [rowSelections, setRowSelections] = React.useState<RowSelectionState>({});


    useEffect(() => {
        if (users) {
            setData(users.map(user => ({
                    ...user,
                    id: user.id ?? '',
                })
            ));
        }
    }, [users]);

    const handleUpdateItem = React.useCallback((updatedItem: Partial<UserAdminData>) => {
        setData(currentData =>
            currentData.map(item =>
                item.id === updatedItem.id ? {...item, ...updatedItem} : item
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
            header: ({table}) => (
                <div className="flex items-center justify-center px-1">
                    <Checkbox
                        checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
                        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                        aria-label="Select all" onClick={(e) => e.stopPropagation()}
                    />
                </div>
            ),
            cell: ({row}) => (
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
            header: ({column}) => <DataTableColumnHeader column={column} title={t('table.user')}/>,
            cell: ({row}) => {
                const user = row.original;
                return (
                    <div className="flex items-center gap-1 py-0.5 min-w-[200px]">
                        <Avatar className="h-9 w-9 flex-shrink-0">
                            <AvatarImage src={user.profileImage} alt={user.displayName}/>
                            <AvatarFallback>{user?.displayName?.split(' ').map(n => n[0]).join('').toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col gap-1">
                            <UserTableCellViewer userId={user.id} onUpdate={handleUpdateItem}
                                                 initialDisplayName={user?.displayName}/>
                            <span className="text-xs text-muted-foreground italic">@{user.username}</span>
                        </div>
                    </div>
                );
            },
            enableHiding: false,
        },
        {
            accessorKey: "email",
            header: ({column}) => <DataTableColumnHeader column={column} title={t('table.email')}/>,
            cell: ({row}) => (
                <div className="flex items-center gap-2 text-sm">
                    <MailIcon className="h-3.5 w-3.5 text-muted-foreground"/>
                    <a href={`mailto:${row.original.email}`} className="hover:underline"
                       onClick={e => e.stopPropagation()}>
                        {row.original.email}
                    </a>
                </div>
            ),
        },
        {
            accessorKey: "type",
            header: ({column}) => <DataTableColumnHeader column={column} title={t('table.role')}/>,
            cell: ({row}) => <Badge variant="outline" className="px-2 py-0.5 text-xs">{row.original.role?.name}</Badge>,
        },
        {
            accessorKey: "status",
            header: ({column}) => <DataTableColumnHeader column={column} title={t('table.status')}/>,
            cell: ({row}) => {
                const status = row.original.status;
                let icon = <div className="size-2.5 rounded-full bg-slate-400"/>;
                if (status === "ACTIVE") icon = <CheckCircle2Icon className="size-3.5 text-green-500"/>;
                else if (status === "PENDING") icon = <LoaderIcon className="size-3.5 animate-spin text-amber-500"/>;
                else if (status === "SUSPENDED") icon = <LoaderIcon className="size-3.5 text-red-500"/>; // Using Loader as placeholder for suspended

                return (
                    <Badge variant={status === "ACTIVE" ? "default" : "secondary"}
                           className="flex w-fit items-center gap-1.5 px-2 py-1 text-xs">
                        {icon} {status}
                    </Badge>
                );
            },
        },
        {
            accessorKey: "lastLogin",
            header: ({column}) => <DataTableColumnHeader column={column} title={t('table.lastLogin')}/>,
            cell: ({row}) => row.original.lastLogin ?
                <div
                    className="text-xs text-muted-foreground min-w-[90px]">{new Date(row.original.lastLogin).toLocaleDateString()}</div> :
                <span className="text-xs text-muted-foreground/70">Never</span>,
        },
        {
            id: "actions",
            header: ({column}) => <DataTableColumnHeader column={column} title={t('table.actions')}/>,
            cell: ({row}) => {
                const user = row.original;
                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">{t('table.actions')}</span>
                                <MoreVerticalIcon className="h-4 w-4"/>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => window.open(`/users/${user.id}`, '_blank')}>
                                {t('table.viewProfile')}
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                {t('table.editUser')}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator/>
                            <DropdownMenuItem className="text-red-600">
                                {t('table.banUser')}
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                );
            },
        },
    ], [t, handleUpdateItem]);

    return (
        <Tabs defaultValue="userList" className="flex w-full flex-col justify-start gap-6 p-4 md:p-6">
            <div className="flex flex-wrap items-center justify-between gap-2">
                <TabsList className="hidden md:flex">
                    <TabsTrigger value="userList">{t('title')}</TabsTrigger>
                    <TabsTrigger value="activityLog" className="gap-1">
                        Activity Log {" "}
                        <Badge variant="secondary"
                               className="flex h-5 w-5 items-center justify-center rounded-full bg-muted-foreground/20">
                            {data?.length}
                        </Badge>
                    </TabsTrigger>
                </TabsList>
                <div className="flex items-center gap-2">
                    <AddUserSheet>
                        <Button variant="default" size="sm" className="gap-1.5">
                            <PlusIcon className="size-4"/>
                            <span className="hidden lg:inline">{t('table.addUser')}</span>
                            <span className="lg:hidden">{t('table.add')}</span>
                        </Button>
                    </AddUserSheet>
                </div>
            </div>

            <TabsContent value="userList" className="relative flex flex-col gap-4 overflow-auto">
                <DataTable
                    columns={columns}
                    data={data}
                    setData={setData}
                    enableDnd={true}
                    enableRowSelection={true}
                    rowSelection={rowSelections}
                    setRowSelectionFn={setRowSelections}
                    filterPlaceholder={t('table.searchPlaceholder')}
                    fetchNextPage={fetchNextPage}
                    isFetchingNextPage={isFetchingNextPage}
                    hasNextPage={hasNextPage}
                    isLoading={isLoading}
                    floatingActions={useUserTableActions}
                />
            </TabsContent>

            <TabsContent value="activityLog" className="flex flex-col">
                <div
                    className="flex aspect-[16/7] w-full flex-1 items-center justify-center rounded-lg border border-dashed p-4">
                    <p className="text-center text-muted-foreground">Activity Log Content - Placeholder</p>
                </div>
            </TabsContent>
        </Tabs>
    );
}