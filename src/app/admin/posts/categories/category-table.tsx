'use client'

import {DataTable} from "@/components/ui/data-table";
import {columns} from "@/app/admin/posts/categories/category-columns";
import {useCategoryManagement} from "@/app/admin/posts/categories/hooks/useCategoryManagement";
import useCategoryStore from "@/app/admin/posts/categories/store/useCategoryStore";

export const CategoryTable = () => {
    const {categories} = useCategoryStore()
    const {fetchNextPage, isFetchingNextPage, hasNextPage, totalPages} = useCategoryManagement()


    return (
        <div className={'p-4'}>
            <DataTable
                columns={columns}
                data={categories}
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
