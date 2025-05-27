'use client'

import {SiteHeader} from "@/app/admin/components/site-header";
import {TagsTable} from "@/app/admin/posts/tags/tags-table";
import {useTagManagement} from "@/app/admin/posts/tags/hooks/useTagManagement";

export const TagsContainer = () => {
    useTagManagement()

    return (
        <div className={'space-y-4 size-full'}>
            <SiteHeader text={'Tags'}/>
            <TagsTable/>
        </div>
    )
}

