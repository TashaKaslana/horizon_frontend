import UserOverviewHeader from "@/app/(home)/users/[userId]/components/UserOverviewHeader";
import UserOverviewMain from "@/app/(home)/users/[userId]/overview/UserOverviewMain";

const UserOverviewContainer = ({userId}: {userId: string}) => {
    return (
        <div>
            <UserOverviewHeader userId={userId}/>
            <UserOverviewMain/>
        </div>
    )
}

export default UserOverviewContainer;