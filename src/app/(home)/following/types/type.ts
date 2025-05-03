import {UserSummary} from "@/types/user";


// beginner < a month
// moderator < 6-month
// expert > 6-month
export type RankType = "beginner" | "intermediate" | "expert";

export type FollowCardProps = {
    user: UserSummary
    createdAt: string
}