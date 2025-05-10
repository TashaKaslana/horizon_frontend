import {UserIntroduction} from "@/types/user";


// beginner < a month
// moderator < 6-month
// expert > 6-month
export type RankType = "beginner" | "intermediate" | "expert";

export type FollowCardProps = {
    user: UserIntroduction
    createdAt: string
}

export type FollowOverview = {
    isMeFollowing: boolean,
    totalFollowers: number,
    totalFollowing: number,
}