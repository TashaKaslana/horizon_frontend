'use client'

import {SiteHeader} from "@/app/admin/components/site-header";
import {TagsTable} from "@/app/admin/posts/tags/tags-table";
import {useTagManagement} from "@/app/admin/posts/tags/hooks/useTagManagement";
import {OverviewList} from "@/app/admin/components/overview-list";
import useTagStore from "@/app/admin/posts/tags/store/useTagStore";
import {TagChart} from "@/app/admin/posts/tags/tag-chart";

export const TagContainer = () => {
    const {overviewData} = useTagStore()
    const {isOverviewLoading} = useTagManagement()

    return (
        <div className={'space-y-4 size-full'}>
            <SiteHeader text={'Tags'}/>
            <OverviewList overviewData={overviewData} isLoading={isOverviewLoading}/>
            <TagChart/>
            <TagsTable/>
        </div>
    )
}
