import {UserSummary} from "@/types/user";
import {AssetSummary} from "@/types/Asset";

export interface Post {
    id: string,
    createdAt: string,
    updatedAt: string,
    createdBy: string,
    updatedBy: string,
    user: UserSummary
    caption: string,
    description: string,
    visibility: "PUBLIC" | "PRIVATE" | "UNLISTED",
    duration: number,
    categoryName: string,
    tags: string[],
    videoPlaybackUrl: string,
    videoThumbnailUrl: string,
    videoAsset: AssetSummary,
    isAuthorDeleted: boolean,
}

export type PostSummary = Omit<Post, 'videoAsset' | 'createdBy' | 'updatedBy' | 'isAuthorDeleted'>

export type UpdatePost = Pick<PostSummary, 'caption' | 'description' | 'visibility' | 'categoryName' | 'tags'>