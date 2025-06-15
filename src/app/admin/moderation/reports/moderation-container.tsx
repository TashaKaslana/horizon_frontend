'use client'

import {ModerationCardList} from "@/app/admin/moderation/reports/moderation-card-list";
import {ModerationChart} from "@/app/admin/moderation/reports/moderation-chart";
import {SiteHeader} from "@/app/admin/components/site-header";
import {ModerationTable} from "@/app/admin/moderation/reports/moderation-table";
import {useTranslations} from "next-intl";
import {ChannelProvider} from "ably/react";

const ModerationContainer = () => {
    const t = useTranslations("Admin.moderation");

    return (
        <div className="space-y-4 size-full">
            <SiteHeader text={t('title')}/>
            <ModerationCardList/>
            <ModerationChart isSpecific={false}/>
            <ChannelProvider channelName={'reports'}>
                <ModerationTable/>
            </ChannelProvider>
        </div>
    );
}

export default ModerationContainer;