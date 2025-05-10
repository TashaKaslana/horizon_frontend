'use client'
import {Separator} from "@/components/ui/separator";
import {UserOverviewAppearance} from "@/app/(home)/users/[userId]/components/UserOverviewAppearance";
import {UserOverviewNav} from "@/app/(home)/users/[userId]/components/UserOverviewNav";

interface UserOverviewContainerProps {
    userId: string
}

const UserOverviewHeader = ({userId}: UserOverviewContainerProps) => {
    //TODO: refactor this
    return (
        <div className={'px-10 py-3'}>
            <UserOverviewAppearance userId={userId}/>
            <UserOverviewNav userId={userId}/>
            <Separator className={'mt-3'}/>
        </div>
    )
}

export default UserOverviewHeader