import UserOverviewMain from "@/app/(home)/users/[userId]/overview/UserOverviewMain";

const UserOverviewContainer = ({userId}: {userId: string}) => {
    return (
        <div>
            <UserOverviewMain userId={userId}/>
        </div>
    )
}

export default UserOverviewContainer;