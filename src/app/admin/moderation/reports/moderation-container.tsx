'use client'

import {ModerationCardList} from "@/app/admin/moderation/reports/moderation-card-list";
import {ModerationChart} from "@/app/admin/moderation/reports/moderation-chart";
import {SiteHeader} from "@/app/admin/components/site-header";
import {ModerationTable} from "@/app/admin/components/moderation/moderation-table";

const ModerationContainer = () => {
    return (
        <div className="space-y-4 size-full">
            <SiteHeader text={'Moderation'}/>
            <ModerationCardList/>
            <ModerationChart/>
            <ModerationTable isFull/>
        </div>
    );
}

export default ModerationContainer;