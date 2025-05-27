'use client'

import {SiteHeader} from "@/app/admin/components/site-header";
import {CategoryTable} from "@/app/admin/posts/categories/category-table";
import {useCategoryManagement} from "@/app/admin/posts/categories/hooks/useCategoryManagement";

export const CategoryContainer = () => {
    useCategoryManagement()

    return (
        <div className={'space-y-4 size-full'}>
            <SiteHeader text={'Category'}/>
            <CategoryTable/>
        </div>
    )
}