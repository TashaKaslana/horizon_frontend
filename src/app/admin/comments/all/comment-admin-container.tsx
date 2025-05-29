'use client';

import {CommentCardList} from "./comment-admin-cards"
import {SiteHeader} from "@/app/admin/components/site-header";
import {CommentChart} from "@/app/admin/comments/all/comment-chart";
import {CommentAdminTable} from "@/app/admin/comments/all/comment-admin-table";
import useCommentsManagement from "@/app/admin/comments/all/hooks/useCommentsManagement";

const CommentAdminContainer = () => {
    useCommentsManagement()

    return (
        <div className={'space-y-4'}>
            <SiteHeader text={'Comments'}/>
            <CommentCardList/>
            <CommentChart/>
            <CommentAdminTable/>
        </div>
    )
}

export default CommentAdminContainer;