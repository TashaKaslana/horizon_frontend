'use client'

import {ModerationCardList} from "@/app/admin/moderation/reports/moderation-card-list";
import {ModerationChart} from "@/app/admin/moderation/reports/moderation-chart";
import {SiteHeader} from "@/app/admin/components/site-header";
import {ModerationTable} from "@/app/admin/components/moderation/moderation-table";
import {getAllReportsInfiniteOptions} from "@/api/client/@tanstack/react-query.gen";

const ModerationContainer = () => {
    return (
        <div className="space-y-4 size-full">
            <SiteHeader text={'Moderation'}/>
            <ModerationCardList/>
            <ModerationChart/>
            <ModerationTable
                options={{
                    options: getAllReportsInfiniteOptions(),
                }}
            />
        </div>
    );
}

export default ModerationContainer;