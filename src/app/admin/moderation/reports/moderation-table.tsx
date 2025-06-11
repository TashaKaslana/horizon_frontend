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
import { RowSelectionState } from "@tanstack/react-table";
import {PostDetailViewerSheet} from "../../posts/all/post-detail-viewer-sheet";
import {useTranslations} from "next-intl";
import { moderationTableActions } from "./moderation-table-actions";

type ModerationItemData = ReportDto & DraggableItem

type ModerationTableProps = {
    type?: 'USER' | 'POST' | 'COMMENT';
    isFull?: boolean;
    onUpdateStatusAction?: (itemIds: string[], newStatus: ModerationStatus) => void;
    onDeleteEntriesAction?: (itemIds: string[]) => void;
}

export function ModerationTable({
    type,
    isFull,
    onUpdateStatusAction,
    onDeleteEntriesAction
}: ModerationTableProps) {
    const t = useTranslations("Admin.moderation.all.table");

    const {reports} = useReportStore()
    const {fetchNextPage, isFetchingNextPage, hasNextPage, totalPages} = useModeration({type, isFull});
    const [data, setData] = React.useState<ModerationItemData[]>([]);
    const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({});
    const [selectedPostId, setSelectedPostId] = React.useState<string | null>(null);
    const [isPostSheetOpen, setIsPostSheetOpen] = React.useState(false);

    useEffect(() => {
        setData(reports.map(report => ({
                ...report,
                id: report.id,
            })) as ModerationItemData[]
        )
    }, [type, reports]);

    const handleUpdateStatus = React.useCallback((itemIds: string[], newStatus: ModerationStatus) => {
        // Use the passed handler if provided, otherwise handle internally
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
        // Use the passed handler if provided, otherwise handle internally
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
            <DataTable
                columns={columns}
                data={data}
                setData={setData}
                enableDnd={true}
                enableRowSelection={true}
                setRowSelectionFn={setRowSelection}
                rowSelection={rowSelection}
                showGlobalFilter={true}
                filterPlaceholder={t("searchPlaceholder")}
                fetchNextPage={fetchNextPage}
                isFetchingNextPage={isFetchingNextPage}
                hasNextPage={hasNextPage}
                pageCount={totalPages ?? 0}
                initialColumnVisibility={{id: false}}
                floatingActions={(selected) => moderationTableActions(selected, type ?? 'ALL')}
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
