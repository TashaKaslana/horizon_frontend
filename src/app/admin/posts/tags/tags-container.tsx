'use client'

import {SiteHeader} from "@/app/admin/components/site-header";
import {TagsTable} from "@/app/admin/posts/tags/tags-table";
import {useTagManagement} from "@/app/admin/posts/tags/hooks/useTagManagement";
import {OverviewList} from "@/app/admin/components/overview-list";
import useTagStore from "@/app/admin/posts/tags/store/useTagStore";
import {TagsChart} from "@/app/admin/posts/tags/tags-chart";
import {useTranslations} from "next-intl";

export const TagsContainer = () => {
    const {overviewData} = useTagStore()
    const {isOverviewLoading} = useTagManagement()
    const t = useTranslations("Admin.posts.tags");

    return (
        <div className={'space-y-4 size-full'}>
            <SiteHeader text={t('title')}/>
            <OverviewList overviewData={overviewData} isLoading={isOverviewLoading}/>
            <TagsChart/>
            <TagsTable/>
        </div>
    )
}
