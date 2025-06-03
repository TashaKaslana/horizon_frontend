import {TagResponse} from "@/api/client";

export type TagRowData = TagResponse & {
    postsCount: number;
};
