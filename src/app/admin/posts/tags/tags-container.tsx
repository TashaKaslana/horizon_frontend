'use client'

import {SiteHeader} from "@/app/admin/components/site-header";
import {TagsTable} from "@/app/admin/posts/tags/tags-table";

export const TagsContainer = () => {
  return (
    <div className={'space-y-4 size-full'}>
        <SiteHeader text={'Tags'}/>
        <TagsTable/>
    </div>
  )
}