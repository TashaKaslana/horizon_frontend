import {UUID} from "node:crypto";
import {UserSummary} from "@/types/user";
import {AssetSummary} from "@/types/Asset";

export interface Post {
    id: UUID,
    createdAt: Date,
    updatedAt: Date,
    createdBy: UUID,
    updatedBy: UUID,
    user: UserSummary
    caption: string,
    description: string,
    visibility: "PUBLIC" | "PRIVATE" | "UNLISTED",
    duration: number,
    category: string,
    tags: string[],
    videoPlaybackUrl: string,
    videoThumbnailUrl: string,
    videoAsset: AssetSummary,
    isAuthorDeleted: boolean,
}