'use client'

import {DataTable} from "@/components/ui/data-table";
import {useTagsColumns} from "@/app/admin/posts/tags/tags-columns";
import {useTagManagement} from "@/app/admin/posts/tags/hooks/useTagManagement";
import useTagStore from "@/app/admin/posts/tags/store/useTagStore";
import {useState} from "react";
import {RowSelectionState} from "@tanstack/react-table";
import {useTranslations} from "next-intl";
import {tagTableActions} from "@/app/admin/posts/tags/tags-table-actions";

export const TagsTable = () => {
    const {tags} = useTagStore();
    const {fetchNextPage, isFetchingNextPage, hasNextPage, totalPages, isLoading} = useTagManagement();
    const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
    const t = useTranslations("Admin.posts.tags.table");
    const columns = useTagsColumns();

    return (
        <div className={'p-4'}>
            <DataTable
                columns={columns}
                data={tags}
                enableRowSelection={true}
                rowSelection={rowSelection}
                setRowSelectionFn={setRowSelection}
                filterPlaceholder={t("searchPlaceholder")}
                fetchNextPage={fetchNextPage}
                isFetchingNextPage={isFetchingNextPage}
                isLoading={isLoading}
                hasNextPage={hasNextPage}
                pageCount={totalPages}
                initialColumnVisibility={{id: false}}
                floatingActions={tagTableActions}
            />
        </div>
    )
}
