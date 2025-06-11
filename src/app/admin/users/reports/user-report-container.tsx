'use client'

import {SiteHeader} from "@/app/admin/components/site-header";
import {ModerationTable} from "@/app/admin/moderation/reports/moderation-table";
import {ModerationChart} from "@/app/admin/moderation/reports/moderation-chart";
import {UserModerationCardList} from "@/app/admin/moderation/reports/moderation-card-list";
import {useReportStore} from "@/app/admin/moderation/reports/useReportStore";
import {useEffect} from "react";

export const UserReportContainer = () => {
    const {setCurrentType} = useReportStore()

    useEffect(() => {
        setCurrentType("USER")
    }, [setCurrentType]);

    return (
        <div className={'space-y-4 size-full'}>
            <SiteHeader text={'User Reports'}/>
            <UserModerationCardList/>
            <ModerationChart/>
            <ModerationTable/>
        </div>
    );
}