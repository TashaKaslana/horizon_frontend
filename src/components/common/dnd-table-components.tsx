import React from "react";
import {
    DndContext,
    KeyboardSensor,
    MouseSensor,
    TouchSensor,
    closestCenter,
    useSensor,
    useSensors,
    type DragEndEvent,
    type UniqueIdentifier,
} from "@dnd-kit/core";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import {
    SortableContext,
    useSortable,
    verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { flexRender, Row, RowData } from "@tanstack/react-table";
import { TableRow, TableCell } from "@/components/ui/table"; // Your existing ui/table
import { Button } from "@/components/ui/button";
import { GripVerticalIcon } from "lucide-react";

// --- DndTableContext ---
interface DndTableContextProps<TData extends { id: UniqueIdentifier }> {
    items: TData[];
    onDragEnd: (event: DragEndEvent) => void;
    children: React.ReactNode;
}

export function DndTableContext<TData extends { id: UniqueIdentifier }>({
                                                                            items,
                                                                            onDragEnd,
                                                                            children,
                                                                        }: DndTableContextProps<TData>) {
    const sensors = useSensors(
        useSensor(MouseSensor, {}),
        useSensor(TouchSensor, {}),
        useSensor(KeyboardSensor, {})
    );

    const itemIds = React.useMemo(() => items.map(item => item.id), [items]);

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            modifiers={[restrictToVerticalAxis]}
            onDragEnd={onDragEnd}
        >
            <SortableContext items={itemIds} strategy={verticalListSortingStrategy}>
                {children}
            </SortableContext>
        </DndContext>
    );
}


// --- DraggableRow ---
// This is similar to your existing DraggableRow but more tightly coupled with the assumption
// that it's used within the DndTableContext and for tanstack-table rows.
// It also assumes `row.original` has an `id` property.
interface DraggableRowProps<TData extends { id: UniqueIdentifier } & RowData> {
    row: Row<TData>;
}

export function DraggableRow<TData extends { id: UniqueIdentifier } & RowData>({
                                                                                   row,
                                                                               }: DraggableRowProps<TData>) {
    const {
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({
        id: row.original.id,
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.8 : 1,
        zIndex: isDragging ? 1 : 0,
    };

    return (
        <TableRow
            ref={setNodeRef}
            style={style}
            data-state={row.getIsSelected() && "selected"}
            data-dragging={isDragging}
            // {...attributes} // Listeners are usually on the drag handle, not the whole row
        >
            {/* Render a drag handle cell if configured, or apply listeners to a specific cell */}
            {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id} style={{ touchAction: 'none' /* For touch on specific handle */ }}>
                    {/* Conditionally render drag handle or apply listeners here */}
                    {/* For now, assuming a dedicated drag handle column */}
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
            ))}
        </TableRow>
    );
}

// --- DragHandleCell ---
// A simple component to be used in a column definition for the drag handle
interface DragHandleCellProps {
    rowId: UniqueIdentifier;
}
export function DragHandleCell({ rowId }: DragHandleCellProps) {
    const { attributes, listeners, setActivatorNodeRef } = useSortable({ id: rowId });
    return (
        <Button
            ref={setActivatorNodeRef}
            variant="ghost"
            size="icon"
            className="size-7 cursor-grab text-muted-foreground hover:bg-transparent"
            {...attributes}
            {...listeners}
        >
            <GripVerticalIcon className="size-4" />
            <span className="sr-only">Drag to reorder</span>
        </Button>
    );
}