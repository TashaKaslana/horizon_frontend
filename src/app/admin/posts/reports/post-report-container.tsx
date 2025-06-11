'use client';

import {SiteHeader} from "@/app/admin/components/site-header";
import {ModerationTable} from "@/app/admin/moderation/reports/moderation-table";
import {PostModerationCardList} from "@/app/admin/moderation/reports/moderation-card-list";
import {ModerationChart} from "@/app/admin/moderation/reports/moderation-chart";
import {useReportStore} from "@/app/admin/moderation/reports/useReportStore";
import {useEffect} from "react";

export const PostReportContainer = () => {
    const {setCurrentType} = useReportStore()

    useEffect(() => {
        setCurrentType("POST")
    }, [setCurrentType]);

    return (
        <div className={'space-y-4 size-full'}>
            <SiteHeader text={'Post Reports'}/>
            <PostModerationCardList/>
            <ModerationChart/>
            <ModerationTable/>
        </div>
    );
}