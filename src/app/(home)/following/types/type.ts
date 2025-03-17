export type RankType = "beginner" | "moderator" | "expert";

export type UserCardProps = {
    avatarUrl: string;
    displayName: string;
    username: string;
    bio: string;
    rank: RankType;
    followersCount: number;
    followingCount: number;
}