import {Post} from "@/types/Post";

export type Feed = {
    post: Post,
    statistic: Statistic
}

export type Statistic = {
    totalLikes: number,
    totalComments: number,
    totalBookmarks: number,
    totalViews: number,
    isLiked: boolean,
    isBookmarked: boolean,
}