// components/common/dnd-table-components.tsx
"use client";

import React, { HTMLAttributes } from "react";
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    MouseSensor,
    TouchSensor,
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
import { Row, flexRender, RowData, CellContext } from "@tanstack/react-table";

import { TableRow, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { GripVerticalIcon } from "lucide-react";

type UseSortableAttributes = ReturnType<typeof useSortable>['attributes'];

// Base type for data that supports DND, used by DraggableRow and DataTable
export type DraggableItem = RowData & {
    id: UniqueIdentifier;
};

// Context for DndKit
interface DndTableContextProps<TItem extends DraggableItem> {
    items: TItem[];
    onDragEndAction: (event: DragEndEvent) => void;
    children: React.ReactNode;
}

export function DndTableContext<TItem extends DraggableItem>({
                                                                 items,
                                                                 onDragEndAction,
                                                                 children,
                                                             }: DndTableContextProps<TItem>) {
    const sensors = useSensors(
        useSensor(MouseSensor, {
            activationConstraint: { distance: 5 },
        }),
        useSensor(TouchSensor, {
            activationConstraint: { delay: 100, tolerance: 5 },
        }),
        useSensor(KeyboardSensor, {})
    );

    const itemIds = React.useMemo(() => items.map(item => item.id), [items]);

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            modifiers={[restrictToVerticalAxis]}
            onDragEnd={onDragEndAction}
        >
            <SortableContext items={itemIds} strategy={verticalListSortingStrategy}>
                {children}
            </SortableContext>
        </DndContext>
    );
}

// Interface for passing DND attributes/listeners to the cell rendering the handle
export interface DraggableCellContextExtensions {
    dndAttributes?: HTMLAttributes<UseSortableAttributes>;
    dndListeners?: ReturnType<typeof useSortable>['listeners'];
}

// DraggableRow component
interface DraggableRowProps<TData extends DraggableItem> {
    row: Row<TData>;
}

export function DraggableRow<TData extends DraggableItem>({ row }: DraggableRowProps<TData>) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
        id: row.original.id,
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition: transition,
    };

    return (
        <TableRow
            ref={setNodeRef}
            style={style}
            data-state={row.getIsSelected() && "selected"}
            data-dragging={isDragging}
            className="relative z-0 data-[dragging=true]:z-10 data-[dragging=true]:bg-muted data-[dragging=true]:opacity-80"
        >
            {row.getVisibleCells().map((cell) => {
                const cellContext = cell.getContext();
                let augmentedContext: CellContext<TData, unknown> & DraggableCellContextExtensions = cellContext;

                // Pass dnd attributes and listeners to the cell designated as the drag handle
                // This assumes the drag handle column has an id of 'drag'
                if (cell.column.id === "drag") {
                    augmentedContext = {
                        ...cellContext,
                        dndAttributes: attributes,
                        dndListeners: listeners,
                    };
                }

                return (
                    <TableCell
                        key={cell.id}
                        style={{ width: cell.column.getSize() !== 150 ? cell.column.getSize() : undefined }}
                    >
                        {flexRender(cell.column.columnDef.cell, augmentedContext)}
                    </TableCell>
                );
            })}
        </TableRow>
    );
}

// Standard DragHandle Cell Renderer (consumes context from DraggableRow)
// To be used in column definitions.
export function DragHandleCell<TData extends DraggableItem, TValue = unknown>(
    props: CellContext<TData, TValue> & DraggableCellContextExtensions
) {
    return (
        <Button
            {...(props.dndAttributes as React.ButtonHTMLAttributes<HTMLButtonElement>)}
            {...props.dndListeners}
            variant="ghost"
            size="icon"
            className="size-7 cursor-grab text-muted-foreground hover:bg-transparent active:cursor-grabbing"
            onClick={(e) => e.stopPropagation()} // Prevent row click if handle is clicked
            aria-label="Drag to reorder"
        >
            <GripVerticalIcon className="size-4 text-muted-foreground" />
            <span className="sr-only">Drag to reorder</span>
        </Button>
    );
}