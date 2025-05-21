import {Tag as SchemaTag} from "@/schemas/tag-schema";
import {DraggableItem} from "@/components/common/dnd-table-components";

export type TagRowData = SchemaTag & DraggableItem & {
    postsCount: number;
};