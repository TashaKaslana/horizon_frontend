import {ModerationCardList} from "@/app/admin/moderation/all/moderation-card-list";
import {ModerationChart} from "@/app/admin/moderation/all/moderation-chart";
import {SiteHeader} from "@/app/admin/components/site-header";
import {ModerationTable} from "@/app/admin/moderation/all/moderation-table";

const ModerationContainer = () => {
    return (
        <div className="space-y-4 size-full">
            <SiteHeader text={'Moderation'}/>
            <ModerationCardList/>
            <ModerationChart/>
            <ModerationTable/>
        </div>
    );
}

export default ModerationContainer;