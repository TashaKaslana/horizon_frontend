'use client';

import {CommentCardList} from "./comment-admin-cards"
import {SiteHeader} from "@/app/admin/components/site-header";
import {CommentChart} from "@/app/admin/comments/all/comment-chart";
import {CommentAdminTable} from "@/app/admin/comments/all/comment-admin-table";
import useCommentsManagement from "@/app/admin/comments/all/hooks/useCommentsManagement";
import { useTranslations } from "next-intl";

const CommentAdminContainer = () => {
    const t = useTranslations('Home.comments');
    useCommentsManagement();

    return (
        <div className={'space-y-4'}>
            <SiteHeader text={t('title')}/>
            <CommentCardList/>
            <CommentChart/>
            <CommentAdminTable/>
        </div>
    )
}

export default CommentAdminContainer;
