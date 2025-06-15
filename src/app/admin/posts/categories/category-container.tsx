'use client'

import {SiteHeader} from "@/app/admin/components/site-header";
import {CategoryTable} from "@/app/admin/posts/categories/category-table";
import {useCategoryManagement} from "@/app/admin/posts/categories/hooks/useCategoryManagement";
import {OverviewList} from "@/app/admin/components/overview-list";
import useCategoryStore from "@/app/admin/posts/categories/store/useCategoryStore";
import {CategoryChart} from "@/app/admin/posts/categories/catageory-chart";
import {useTranslations} from "next-intl";
import {ChannelProvider} from "ably/react";

export const CategoryContainer = () => {
    const {overviewData} = useCategoryStore()
    const {isOverviewLoading} = useCategoryManagement()
    const t = useTranslations("Admin.posts.categories");

    return (
        <div className={'space-y-4 size-full'}>
            <SiteHeader text={t('title')}/>
            <OverviewList overviewData={overviewData} isLoading={isOverviewLoading}/>
            <CategoryChart/>
            <ChannelProvider channelName={'categories'}>
                <CategoryTable/>
            </ChannelProvider>
        </div>
    )
}