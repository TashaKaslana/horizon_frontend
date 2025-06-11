"use client";

import React, {useEffect} from "react";
import {toast} from "sonner";
import {DataTable} from "@/components/ui/data-table";
import {useModerationTableColumns} from "@/app/admin/moderation/reports/moderation-table-columns";
import {DraggableItem} from "@/components/common/dnd-table-components";
import {ModerationStatus} from "@/schemas/report-schema";
import {ReportDto} from "@/api/client";
import {useReportStore} from "@/app/admin/moderation/reports/useReportStore";
import {useModeration} from "@/app/admin/moderation/reports/useModeration";
import {PostDetailViewerSheet} from "../../posts/all/post-detail-viewer-sheet";
import {useTranslations} from "next-intl";
import {useModerationTableActions} from "./use-moderation-table-actions";

type ModerationItemData = ReportDto & DraggableItem

type ModerationTableProps = {
    isFull?: boolean;
    onUpdateStatusAction?: (itemIds: string[], newStatus: ModerationStatus) => void;
    onDeleteEntriesAction?: (itemIds: string[]) => void;
}

export function ModerationTable({
    onUpdateStatusAction,
    onDeleteEntriesAction
}: ModerationTableProps) {
    const t = useTranslations("Admin.moderation.all.table");
    const currentType = useReportStore(state => state.currentType);
    const reports = useReportStore(state => state.reports);
    const {fetchNextPage, isFetchingNextPage, hasNextPage, totalPages} = useModeration();

    const [data, setData] = React.useState<ModerationItemData[]>([]);
    const [selectedPostId, setSelectedPostId] = React.useState<string | null>(null);
    const [isPostSheetOpen, setIsPostSheetOpen] = React.useState(false);

    useEffect(() => {
        setData(reports.map((report) => ({
                ...report,
                id: report.id,
            })) as ModerationItemData[]
        )
    }, [reports]);

    const handleUpdateStatus = React.useCallback((itemIds: string[], newStatus: ModerationStatus) => {
        if (onUpdateStatusAction) {
            onUpdateStatusAction(itemIds, newStatus);
            return;
        }

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
        toast.success(t("statusUpdated"));
    }, [onUpdateStatusAction, t]);

    const handleDeleteModerationEntries = React.useCallback((itemIds: string[]) => {
        if (onDeleteEntriesAction) {
            onDeleteEntriesAction(itemIds);
            return;
        }

        setData(prev => prev.filter(item => !itemIds.includes(item.id)));
        toast.error(`${itemIds.length} ${itemIds.length > 1 ? t("deleteMultipleEntries") : t("deleteSingleEntry")}`);
    }, [onDeleteEntriesAction, t]);

    const handlePostSelection = React.useCallback((postId: string) => {
        setSelectedPostId(postId);
        setIsPostSheetOpen(true);
    }, []);

    const columns = useModerationTableColumns({
        onUpdateStatusAction: handleUpdateStatus,
        onDeleteEntriesAction: handleDeleteModerationEntries,
        onPostSelection: handlePostSelection
    });

    return (
        <div className="space-y-4 p-4">
            {currentType && (
                <div className="text-sm text-muted-foreground mb-2">
                    Current filter: {currentType}
                </div>
            )}
            <DataTable
                columns={columns}
                data={data}
                setData={setData}
                enableDnd={true}
                enableRowSelection={true}
                showGlobalFilter={true}
                filterPlaceholder={t("searchPlaceholder")}
                fetchNextPage={fetchNextPage}
                isFetchingNextPage={isFetchingNextPage}
                hasNextPage={hasNextPage}
                pageCount={totalPages ?? 0}
                initialColumnVisibility={{id: false}}
                floatingActions={useModerationTableActions}
            />
            {selectedPostId && (
                <PostDetailViewerSheet
                    postId={selectedPostId}
                    isOpen={isPostSheetOpen}
                    onSetIsOpenAction={setIsPostSheetOpen}
                />
            )}
        </div>
    );
}
