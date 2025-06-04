"use client";

import * as React from "react";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetClose,
} from "@/components/ui/sheet";
import {Button} from "@/components/ui/button";

interface LogDetailSheetProps {
    log: unknown;
    open: boolean;
    onOpenChangeAction: (open: boolean) => void;
}

function syntaxHighlightJson(obj: unknown): React.ReactNode {
    if (typeof obj !== "object" || obj === null) {
        return <span className="text-green-600">{JSON.stringify(obj)}</span>;
    }

    if (Array.isArray(obj)) {
        return (
            <>
                <span>[</span>
                    {obj.map((item, idx) => (
                        <React.Fragment key={idx}>
                            {syntaxHighlightJson(item)}
                            {idx < obj.length - 1 ? <span>, </span> : null}
                        </React.Fragment>
                    ))}
                <span>]</span>
            </>
        );
    }
    
    return (
        <span>
            {"{"}
                {Object.entries(obj).map(([key, value], idx, arr) => (
                    <div key={key} style={{ paddingLeft: 16 }}>
                        <span className="text-blue-600">&#34;{key}&#34;</span>:{" "}
                        {typeof value === "object" && value !== null ? (
                            syntaxHighlightJson(value)
                        ) : (
                            <span className="text-green-600">
                              {typeof value === "string" ? `"${value}"` : String(value)}
                            </span>
                        )}
                        {idx < arr.length - 1 ? "," : ""}
                    </div>
                ))}
            {"}"}
        </span>
    );
}

export function LogDetailSheet({
                                   log,
                                   open,
                                   onOpenChangeAction,
                               }: LogDetailSheetProps) {
    return (
        <Sheet open={open} onOpenChange={onOpenChangeAction}>
            <SheetContent className="overflow-auto min-w-1/3">
                <SheetHeader>
                    <SheetTitle>Log Details</SheetTitle>
                </SheetHeader>
                <pre className="whitespace-pre-wrap break-words bg-muted p-4 rounded-md max-h-[70vh] overflow-auto font-mono text-sm">
                    {syntaxHighlightJson(log)}
                </pre>
                <SheetClose asChild>
                    <Button className="mx-10">Close</Button>
                </SheetClose>
            </SheetContent>
        </Sheet>
    );
}
