'use client';

import {SiteHeader} from "@/app/admin/components/site-header";
import {PostCardList} from "@/app/admin/posts/all/post-card-list";
import {PostChart} from "@/app/admin/posts/all/post-chart";
import {PostTable} from "@/app/admin/posts/all/post-table";
import {useTranslations} from "next-intl";
import {usePostsRealtime} from "@/app/admin/posts/all/hooks/usePostsRealtime";

const PostAdminContainer = () => {
    const t = useTranslations('Admin.posts');
    usePostsRealtime()

    return (
        <div className={'space-y-4 size-full'}>
            <SiteHeader text={t('title')}/>
            <PostCardList/>
            <PostChart/>
            <PostTable/>
        </div>
    )
}

export default PostAdminContainer
