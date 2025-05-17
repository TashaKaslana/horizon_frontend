// src/components/common/table-actions-cell.tsx
import React from "react";
import { Row } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVerticalIcon } from "lucide-react";

// Define a type for your actions
export type TableActionItem<TData> = {
    label: string;
    onClick: (rowData: TData) => void;
    isDestructive?: boolean;
    icon?: React.ReactNode; // Optional icon
} | "separator";


interface TableActionsCellProps<TData> {
    row: Row<TData>;
    actions: TableActionItem<TData>[];
}

export function TableActionsCell<TData>({
                                            row,
                                            actions,
                                        }: TableActionsCellProps<TData>) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    className="flex size-8 p-0 data-[state=open]:bg-muted"
                >
                    <MoreVerticalIcon className="size-4" />
                    <span className="sr-only">Open actions</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[160px]">
                {actions.map((action, index) => {
                    if (action === "separator") {
                        return <DropdownMenuSeparator key={`sep-${index}`} />;
                    }
                    return (
                        <DropdownMenuItem
                            key={action.label}
                            onClick={() => action.onClick(row.original)}
                            className={action.isDestructive ? "text-red-600" : ""}
                        >
                            {action.icon && <span className="mr-2">{action.icon}</span>}
                            {action.label}
                        </DropdownMenuItem>
                    );
                })}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}