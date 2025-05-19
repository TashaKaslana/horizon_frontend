"use client";

import React from "react";
import {
    CheckCircle2Icon,
    LoaderIcon,
    Trash2Icon,
    ShieldQuestionIcon,
    FileTextIcon,
    MessageSquareIcon,
    UserIcon,
    AlertTriangleIcon,
    ShieldCheckIcon,
    ShieldXIcon,
} from "lucide-react";
import {toast} from "sonner";

import {Button} from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {DataTable} from "@/components/ui/data-table";
import {getModerationTableColumns} from "@/app/admin/moderation/all/moderation-table-columns";
import {ModerationItemTypeSchema, ModerationStatus, ModerationStatusSchema, Report} from "@/schemas/report-schema";
import {DraggableItem} from "@/components/common/dnd-table-components";
import {reportData} from "@/app/admin/components/mockData";

type ModerationItemData = Report & DraggableItem

ModerationStatusSchema.options.map(status => ({
    value: status,
    label: status.replace(/_/g, ' '),
    icon: (() => {
        switch (status) {
            case "Pending":
                return LoaderIcon;
            case "Reviewed_Approved":
                return ShieldCheckIcon;
            case "Reviewed_Rejected":
                return ShieldXIcon;
            case "ActionTaken_ContentRemoved":
            case "ActionTaken_UserWarned":
            case "ActionTaken_UserBanned":
                return AlertTriangleIcon;
            case "Resolved":
                return CheckCircle2Icon;
            default:
                return ShieldQuestionIcon;
        }
    })()
}));

ModerationItemTypeSchema.options.map(type => ({
    value: type,
    label: type,
    icon: (() => {
        switch (type) {
            case "Post":
                return FileTextIcon;
            case "Comment":
                return MessageSquareIcon;
            case "User":
                return UserIcon;
            default:
                return ShieldQuestionIcon;
        }
    })()
}));

export function ModerationTable() {
    const [data, setData] = React.useState<ModerationItemData[]>(reportData);
    const [rowSelection, setRowSelection] = React.useState<any>({});


    const handleUpdateStatus = React.useCallback((itemIds: string[], newStatus: ModerationStatus) => {
        setData(currentData =>
            currentData.map(item =>
                itemIds.includes(item.id) ? {...item, status: newStatus, updatedAt: new Date().toISOString()} : item
            )
        );
        toast.success(`Selected item(s) status updated to ${newStatus.replace(/_/g, ' ')}`);
    }, []);

    const handleDeleteModerationEntries = React.useCallback((itemIds: string[]) => {
        setData(prev => prev.filter(item => !itemIds.includes(item.id)));
        toast.error(`${itemIds.length} moderation entr${itemIds.length > 1 ? 'ies' : 'y'} removed.`);
        setRowSelection({});
    }, []);

    const columns = getModerationTableColumns({
        onUpdateStatusAction: handleUpdateStatus,
        onDeleteEntriesAction: handleDeleteModerationEntries
    });
    const selectedRowIds = () => Object.keys(rowSelection).filter(key => rowSelection[key]);

    return (
        <div className="space-y-4 p-4">
            <DataTable
                columns={columns}
                data={data}
                setData={setData}
                enableDnd={true}
                enableRowSelection={true}
                showGlobalFilter={true}
                filterPlaceholder="Search user, post, comment reports..."
            />
            {selectedRowIds().length > 0 && (
                <div className="fixed bottom-4 right-4 z-50 rounded-md border bg-background p-3 shadow-lg">
                    <p className="mb-2 text-sm font-medium">
                        {selectedRowIds().length} item(s) selected.
                    </p>
                    <div className="flex flex-wrap gap-2">
                        <Button size="sm" variant="outline"
                                onClick={() => handleDeleteModerationEntries(selectedRowIds())}>
                            <Trash2Icon className="mr-2 h-4 w-4"/> Delete Selected Reports
                        </Button>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button size="sm" variant="outline">
                                    <ShieldQuestionIcon className="mr-2 h-4 w-4"/> Change Status
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                {ModerationStatusSchema.options.map(status => (
                                    <DropdownMenuItem key={status}
                                                      onSelect={() => handleUpdateStatus(selectedRowIds(), status)}>
                                        {status.replace(/_/g, ' ')}
                                    </DropdownMenuItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            )}
        </div>
    );
}


