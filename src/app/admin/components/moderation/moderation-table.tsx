"use client";

import React, {useEffect} from "react";
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
import {getModerationTableColumns} from "@/app/admin/components/moderation/moderation-table-columns";
import {DraggableItem} from "@/components/common/dnd-table-components";
import {ModerationItemTypeSchema, ModerationStatus, ModerationStatusSchema} from "@/schemas/report-schema";
import {ReportDto} from "@/api/client";
import useReportStore from "@/app/admin/moderation/reports/useReportStore";
import {ModerationProps, useModeration} from "@/app/admin/moderation/reports/useModeration";

type ModerationItemData = ReportDto & DraggableItem

ModerationStatusSchema.options.map(status => ({
    value: status,
    label: status.replace(/_/g, ' '),
    icon: (() => {
        switch (status) {
            case "PENDING":
                return LoaderIcon;
            case "REVIEWED_APPROVED":
                return ShieldCheckIcon;
            case "REVIEWED_REJECTED":
                return ShieldXIcon;
            case "ACTIONTAKEN_CONTENTREMOVED":
            case "ACTIONTAKEN_USERWARNED":
            case "ACTIONTAKEN_USERBANNED":
                return AlertTriangleIcon;
            case "RESOLVED":
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
            case "POST":
                return FileTextIcon;
            case "COMMENT":
                return MessageSquareIcon;
            case "USER":
                return UserIcon;
            default:
                return ShieldQuestionIcon;
        }
    })()
}));

type ModerationTableProps = {
    options: ModerationProps
    onUpdateStatusAction?: (itemIds: string[], newStatus: ModerationStatus) => void;
    onDeleteEntriesAction?: (itemIds: string[]) => void;
}

export function ModerationTable({options}: ModerationTableProps) {
    const {reports} = useReportStore()
    const {fetchNextPage, isFetchingNextPage, hasNextPage, totalPages} = useModeration(options);
    const [data, setData] = React.useState<ModerationItemData[]>([]);
    const [rowSelection, setRowSelection] = React.useState<any>({});

    useEffect(() => {
        setData(reports.map(report => ({
                ...report,
                id: report.id,
            })) as ModerationItemData[]
        )
        console.log(options)
    }, [options, reports]);

    const handleUpdateStatus = React.useCallback((itemIds: string[], newStatus: ModerationStatus) => {
        setData(prev => {
            return prev.map(item => {
                if (itemIds.includes(item.id)) {
                    return {
                        ...item,
                        status: newStatus,
                        updatedAt: new Date(),
                    };
                }
                return item;
            });
        });
        // setRowSelection({});
        toast.success(`Selected item(s) status updated to ${newStatus.replace(/_/g, ' ')}`);
    }, []);

    const handleDeleteModerationEntries = React.useCallback((itemIds: string[]) => {
        setData(prev => prev.filter(item => !itemIds.includes(item.id)));
        toast.error(`${itemIds.length} moderation entr${itemIds.length > 1 ? 'ies' : 'y'} removed.`);
        // setRowSelection({});
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
                fetchNextPage={fetchNextPage}
                isFetchingNextPage={isFetchingNextPage}
                hasNextPage={hasNextPage}
                pageCount={totalPages}
                initialColumnVisibility={{id: false}}
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


