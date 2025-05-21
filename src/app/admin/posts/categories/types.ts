import {DraggableItem} from "@/components/common/dnd-table-components";
import {PostCategory} from "@/schemas/category-schema";

export type Category = PostCategory & DraggableItem & {
    postsCount: number;
};