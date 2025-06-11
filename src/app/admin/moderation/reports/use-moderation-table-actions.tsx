import {FloatingBarAction} from "@/components/common/floating-bar";
import {Download, Edit, Trash} from "lucide-react";
import {exportToExcel} from "@/lib/utils";
import {ReportDto} from "@/api/client";
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from "@/components/ui/dropdown-menu";
import {useMemo, useState} from "react";
import {useModeration} from "@/app/admin/moderation/reports/useModeration";
import {useReportStore} from "@/app/admin/moderation/reports/useReportStore";
import {useTranslations} from "next-intl";

export const useModerationTableActions = (items: ReportDto[]): FloatingBarAction[] => {
    const [isStatusLoading, setIsStatusLoading] = useState(false);
    const {bulkUpdateReportsAction, bulkDeleteReportsAction} = useModeration();
    const {currentType} = useReportStore();
    const t = useTranslations("Admin.moderation.all");
    const reportIds = items.map(item => item.id!);

    type StatusKey = 'RESOLVED' | 'REVIEWED_APPROVED' | 'REVIEWED_REJECTED' | 'ACTIONTAKEN_CONTENTREMOVED' | 'ACTIONTAKEN_USERBANNED' | 'ACTIONTAKEN_USERWARNED' | 'PENDING';
    type StatusItem = { key: StatusKey; label: string };
    
    const status: StatusItem[] = useMemo(() => {
        const statusKeysByType: Record<typeof currentType, StatusKey[]> = {
            ALL: ['RESOLVED', 'REVIEWED_APPROVED', 'REVIEWED_REJECTED', 'ACTIONTAKEN_CONTENTREMOVED', 'ACTIONTAKEN_USERBANNED', 'ACTIONTAKEN_USERWARNED', 'PENDING'],
            COMMENT: ['REVIEWED_APPROVED', 'REVIEWED_REJECTED', 'ACTIONTAKEN_CONTENTREMOVED'],
            USER: ['REVIEWED_APPROVED', 'ACTIONTAKEN_USERBANNED', 'ACTIONTAKEN_USERWARNED', 'REVIEWED_REJECTED'],
            POST: ['REVIEWED_APPROVED', 'REVIEWED_REJECTED', 'ACTIONTAKEN_CONTENTREMOVED'],
        }
        
        return statusKeysByType[currentType].map(key => ({
            key,
            label: t(`status.${key.toLowerCase()}`),
        }))
    }, [currentType, t]);

    return [
        {
            render: () => {
                return <DropdownMenu>
                    <DropdownMenuTrigger disabled={isStatusLoading}
                                         className={'border py-1 px-2 rounded-md hover:bg-muted h-9'}>
                        {t('table.changeStatus')}
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        {
                            status.map((item, index) => (
                                <DropdownMenuItem
                                    key={index}
                                    onClick={async () => {
                                        setIsStatusLoading(true);
                                        try {
                                            await bulkUpdateReportsAction({
                                                reportIds: reportIds,
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
            label: t("table.export"),
            onClick: () => exportToExcel(items, "moderation-reports.xlsx", t("table.reportsExportFileName")),
            variant: "outline",
            icon: <Download/>
        },
        {
            label: t("table.delete"),
            onClick: () => bulkDeleteReportsAction(reportIds),
            variant: "destructive",
            icon: <Trash/>
        },
    ];
}
