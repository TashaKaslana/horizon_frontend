'use client';

import {CommentCardList} from "./comment-admin-cards"
import {SiteHeader} from "@/app/admin/components/site-header";
import {CommentChart} from "@/app/admin/comments/all/comment-chart";
import {CommentAdminTable} from "@/app/admin/comments/all/comment-admin-table";
import { useTranslations } from "next-intl";
import {ChannelProvider} from "ably/react";

const CommentAdminContainer = () => {
    const t = useTranslations('Home.comments');

    return (
        <div className={'space-y-4'}>
            <SiteHeader text={t('title')}/>
            <CommentCardList/>
            <CommentChart/>
            <ChannelProvider channelName={'comments'}>
                <CommentAdminTable/>
            </ChannelProvider>
        </div>
    )
}

export default CommentAdminContainer;
