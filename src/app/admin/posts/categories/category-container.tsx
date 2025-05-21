'use client'

import {SiteHeader} from "@/app/admin/components/site-header";
import {CategoryTable} from "@/app/admin/posts/categories/category-table";

export const CategoryContainer = () => {
  return (
    <div className={'space-y-4 size-full'}>
        <SiteHeader text={'Category'}/>
        <CategoryTable/>
    </div>
  )
}