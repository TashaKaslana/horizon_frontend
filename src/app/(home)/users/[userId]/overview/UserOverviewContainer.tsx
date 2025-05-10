import UserOverviewMain from "@/app/(home)/users/[userId]/overview/UserOverviewMain";

const UserOverviewContainer = ({userId}: {userId: string}) => {
    return (
        <div>
            <UserOverviewMain/>
        </div>
    )
}

export default UserOverviewContainer;