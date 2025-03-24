import FollowingContainer from "@/app/(home)/following/FollowingContainer";
import {UserCardProps} from "@/app/(home)/following/types/type";

const Page = () => {
    const usersData : UserCardProps[] = [
        {
            avatarUrl: "https://i.pravatar.cc/150?img=5",
            displayName: "Follow",
            username: "AlexCoder",
            bio: "Building the future, one line at a time.",
            rank: "beginner",
            followingCount: 100,
            followersCount: 200,
        },
        {
            avatarUrl: "https://i.pravatar.cc/150?img=8",
            displayName: 'Pravatar',
            username: "TechGuru",
            bio: "Moderator | Helping devs since 2015.",
            rank: "moderator",
            followersCount: 450,
            followingCount: 130,
        },
        {
            avatarUrl: "https://i.pravatar.cc/150?img=12",
            displayName: "Moderator",
            username: "CodeMaster",
            bio: "Full-stack dev & AI enthusiast.",
            rank: "expert",
            followersCount: 1050,
            followingCount: 300,
        }
    ]

    return (
        <>
            <FollowingContainer initialFollowing={usersData} initialFollowers={usersData}/>
        </>
    )
}

export default Page;