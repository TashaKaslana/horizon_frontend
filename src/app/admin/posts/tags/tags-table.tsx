'use client'

import {DataTable} from "@/components/ui/data-table";
import {columns} from "@/app/admin/posts/tags/tags-columns";
import {useTagManagement} from "@/app/admin/posts/tags/hooks/useTagManagement";
import useTagStore from "@/app/admin/posts/tags/store/useTagStore";
import {useState} from "react";
import {RowSelectionState} from "@tanstack/react-table";

export const TagsTable = () => {
    const {tags} = useTagStore();
    const {fetchNextPage, isFetchingNextPage, hasNextPage, totalPages, isLoading} = useTagManagement();
    const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

    return (
        <div className={'p-4'}>
            <DataTable
                columns={columns}
                data={tags}
                enableRowSelection={true}
                rowSelection={rowSelection}
                setRowSelectionFn={setRowSelection}
                filterPlaceholder={"Search tags by slug, name, or description..."}
                fetchNextPage={fetchNextPage}
                isFetchingNextPage={isFetchingNextPage}
                isLoading={isLoading}
                hasNextPage={hasNextPage}
                pageCount={totalPages}
                initialColumnVisibility={{id: false}}
            />
        </div>
    )
}
