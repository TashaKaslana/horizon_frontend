'use client'

import {DataTable} from "@/components/ui/data-table";
import {useCategoriesColumns} from "@/app/admin/posts/categories/category-columns";
import {useCategoryManagement} from "@/app/admin/posts/categories/hooks/useCategoryManagement";
import useCategoryStore from "@/app/admin/posts/categories/store/useCategoryStore";
import {useState} from "react";
import {RowSelectionState} from "@tanstack/react-table";
import {useTranslations} from "next-intl";

export const CategoryTable = () => {
    const {categories} = useCategoryStore();
    const {fetchNextPage, isFetchingNextPage, hasNextPage, totalPages, isLoading} = useCategoryManagement();
    const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
    const t = useTranslations("Admin.posts.categories.table");
    const columns = useCategoriesColumns();

    return (
        <div className={'p-4'}>
            <DataTable
                columns={columns}
                data={categories}
                enableDnd={true}
                enableRowSelection={true}
                rowSelection={rowSelection}
                setRowSelectionFn={setRowSelection}
                filterPlaceholder={t("searchPlaceholder")}
                fetchNextPage={fetchNextPage}
                isLoading={isLoading}
                isFetchingNextPage={isFetchingNextPage}
                hasNextPage={hasNextPage}
                pageCount={totalPages}
                initialColumnVisibility={{id: false}}
            />
        </div>
    )
}
