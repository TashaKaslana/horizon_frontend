import {UserSummary} from "@/types/user";


// beginner < 3-month
// moderator 3 months - 1-year
// expert > 1 year
export type RankType = "beginner" | "moderator" | "expert";

export type FollowCardProps = {
    user: UserSummary
    createdAt: string
}