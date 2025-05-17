// src/components/common/sheet-cell-renderer.tsx
import React from "react";
import { Row } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetDescription,
    SheetFooter,
    SheetClose,
    SheetTrigger,
} from "@/components/ui/sheet";

interface SheetCellRendererProps<TData> {
    row: Row<TData>;
    triggerText?: string | ((rowData: TData) => string); // e.g., row.original.name
    sheetTitle?: string | ((rowData: TData) => string);
    sheetDescription?: string | ((rowData: TData) => string);
    children: (
        rowData: TData,
        closeSheet: () => void
    ) => React.ReactNode; // Function to render sheet body content
    sheetFooter?: (
        rowData: TData,
        closeSheet: () => void
    ) => React.ReactNode; // Optional custom footer
    onOpenChange?: (open: boolean) => void;
}

export function SheetCellRenderer<TData>({
                                             row,
                                             triggerText,
                                             sheetTitle,
                                             sheetDescription,
                                             children,
                                             sheetFooter,
                                             onOpenChange,
                                         }: SheetCellRendererProps<TData>) {
    const [isOpen, setIsOpen] = React.useState(false);

    const resolvedTriggerText = typeof triggerText === 'function'
        ? triggerText(row.original)
        : triggerText || "Open"; // Fallback trigger text

    const resolvedSheetTitle = typeof sheetTitle === 'function'
        ? sheetTitle(row.original)
        : sheetTitle || "Details";

    const resolvedSheetDescription = typeof sheetDescription === 'function'
        ? sheetDescription(row.original)
        : sheetDescription;

    const handleOpenChange = (open: boolean) => {
        setIsOpen(open);
        if (onOpenChange) {
            onOpenChange(open);
        }
    };

    const closeSheet = () => handleOpenChange(false);

    return (
        <Sheet open={isOpen} onOpenChange={handleOpenChange}>
            <SheetTrigger asChild>
                <Button variant="link" className="h-auto p-0 text-left font-normal text-foreground">
                    {resolvedTriggerText}
                </Button>
            </SheetTrigger>
            <SheetContent className="flex flex-col sm:max-w-lg"> {/* Or other desired width */}
                <SheetHeader className="gap-1">
                    <SheetTitle>{resolvedSheetTitle}</SheetTitle>
                    {resolvedSheetDescription && (
                        <SheetDescription>{resolvedSheetDescription}</SheetDescription>
                    )}
                </SheetHeader>

                <div className="flex-1 overflow-y-auto py-4">
                    {children(row.original, closeSheet)}
                </div>

                {sheetFooter ? (
                    sheetFooter(row.original, closeSheet)
                ) : (
                    <SheetFooter className="mt-auto pt-4">
                        <SheetClose asChild>
                            <Button variant="outline" className="w-full sm:w-auto">Done</Button>
                        </SheetClose>
                    </SheetFooter>
                )}
            </SheetContent>
        </Sheet>
    );
}