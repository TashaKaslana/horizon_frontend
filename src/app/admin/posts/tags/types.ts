import {DraggableItem} from "@/components/common/dnd-table-components";
import {TagResponse} from "@/api/client";

export type TagRowData = TagResponse & DraggableItem & {
    postsCount: number;
};