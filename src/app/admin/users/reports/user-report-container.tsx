'use client'

import {SiteHeader} from "@/app/admin/components/site-header";
import {ModerationTable} from "@/app/admin/moderation/reports/moderation-table";
import {ModerationChart} from "@/app/admin/moderation/reports/moderation-chart";
import {UserModerationCardList} from "@/app/admin/moderation/reports/moderation-card-list";
import {useReportStore} from "@/app/admin/moderation/reports/useReportStore";
import {useEffect} from "react";
import {useTranslations} from "next-intl";

export const UserReportContainer = () => {
    const t = useTranslations('Admin.moderation.all.types');
    const {setCurrentType} = useReportStore()

    useEffect(() => {
        setCurrentType("USER")
    }, [setCurrentType]);

    return (
        <div className={'space-y-4 size-full'}>
            <SiteHeader text={t('user')}/>
            <UserModerationCardList/>
            <ModerationChart/>
            <ModerationTable/>
        </div>
    );
}