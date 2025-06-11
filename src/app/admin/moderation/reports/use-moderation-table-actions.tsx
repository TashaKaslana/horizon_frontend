import {FloatingBarAction} from "@/components/common/floating-bar";
import {Download, Edit, Trash} from "lucide-react";
import {exportToExcel} from "@/lib/utils";
import {ReportDto} from "@/api/client";
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from "@/components/ui/dropdown-menu";
import {useMemo, useState} from "react";
import {useModeration} from "@/app/admin/moderation/reports/useModeration";
import {useReportStore} from "@/app/admin/moderation/reports/useReportStore";

const Status = {
    RESOLVED: "Resolved",
    REVIEWED_APPROVED: "Approved",
    REVIEWED_REJECTED: "Rejected",
    ACTIONTAKEN_CONTENTREMOVED: "Content Removed",
    ACTIONTAKEN_USERBANNED: "User Banned",
    ACTIONTAKEN_USERWARNED: "User Warned",
    PENDING: "Pending",
}

export const useModerationTableActions = (items: ReportDto[]): FloatingBarAction[] => {
    const [isStatusLoading, setIsStatusLoading] = useState(false);
    const {bulkUpdateReportsAction, bulkDeleteReportsAction} = useModeration();
    const {currentType} = useReportStore();
    
    type StatusKey = keyof typeof Status;
    type StatusItem = { key: StatusKey; label: string };
    
    const status: StatusItem[] = useMemo(() => {
        const statusKeysByType: Record<typeof currentType, StatusKey[]> = {
            ALL: Object.keys(Status) as StatusKey[],
            COMMENT: ["REVIEWED_APPROVED", "REVIEWED_REJECTED", "ACTIONTAKEN_CONTENTREMOVED"],
            USER: ["REVIEWED_APPROVED", "ACTIONTAKEN_USERBANNED", "ACTIONTAKEN_USERWARNED", "REVIEWED_REJECTED"],
            POST: ["REVIEWED_APPROVED", "REVIEWED_REJECTED", "ACTIONTAKEN_CONTENTREMOVED"],
        }
        
        return statusKeysByType[currentType].map(key => ({
            key,
            label: Status[key],
        }))
    }, [currentType]);

    return [
        {
            render: () => {
                return <DropdownMenu>
                    <DropdownMenuTrigger disabled={isStatusLoading}
                                         className={'border py-1 px-2 rounded-md hover:bg-muted h-9'}>
                        Change Status
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        {
                            status.map((item, index) => (
                                <DropdownMenuItem
                                    key={index}
                                    onClick={async () => {
                                        setIsStatusLoading(true);
                                        try {
                                            const reportIds = items.map(item => item.id!);
                                            await bulkUpdateReportsAction({
                                                reportIds,
                                                status: item.key
                                            });
                                        } finally {
                                            setIsStatusLoading(false);
                                            close?.();
                                        }
                                    }}
                                >
                                    {item.label}
                                </DropdownMenuItem>
                            ))
                        }
                    </DropdownMenuContent>
                </DropdownMenu>
            },
            variant: "default",
            icon: <Edit/>
        },
        {
            label: "Export",
            onClick: () => exportToExcel(items, "moderation-reports.xlsx", "Reports"),
            variant: "outline",
            icon: <Download/>
        },
        {
            label: "Delete",
            onClick: async () => {
                const reportIds = items.map(item => item.id!);
                await bulkDeleteReportsAction(reportIds);
            },
            variant: "destructive",
            icon: <Trash/>
        },
    ];
}
