'use client'

import {DataTable} from "@/components/ui/data-table";
import {columns} from "@/app/admin/posts/tags/tags-columns";
import {useTagManagement} from "@/app/admin/posts/tags/hooks/useTagManagement";
import useTagStore from "@/app/admin/posts/tags/store/useTagStore";

export const TagsTable = () => {
    const {tags} = useTagStore();
    const {fetchNextPage, isFetchingNextPage, hasNextPage, totalPages} = useTagManagement();

    return (
        <div className={'p-4'}>
            <DataTable
                columns={columns}
                data={tags}
                enableDnd={true}
                enableRowSelection={true}
                filterPlaceholder={"Search tags by slug, name, or description..."}
                fetchNextPage={fetchNextPage}
                isFetchingNextPage={isFetchingNextPage}
                hasNextPage={hasNextPage}
                totalPages={totalPages}
                enablePagination={true}
                initialColumnVisibility={{id: false}}
            />
        </div>
    )
}
