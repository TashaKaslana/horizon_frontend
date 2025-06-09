import { createPortal } from "react-dom";
import { Button } from "@/components/ui/button";
import {Spinner} from "@/components/ui/spinner";
import {ReactNode} from "react";

export interface FloatingBarAction {
    label: string;
    onClick: () => void;
    variant?: "default" | "outline" | "destructive";
    icon?: ReactNode;
}

export interface FloatingBarProps<T> {
    selectedItems?: T[];
    actions: FloatingBarAction[];
    disabled?: boolean;
    isLoading?: boolean;
}

export const FloatingBar = <T,>({ selectedItems, actions, disabled, isLoading }: FloatingBarProps<T>) => {
    if (selectedItems === undefined || selectedItems.length === 0 || actions.length === 0) return null;

    if (typeof document === "undefined") return null;

    return createPortal(
        <div
            role="region"
            aria-live="polite"
            aria-label={`${selectedItems.length} items selected`}
            className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 shadow-lg bg-white border rounded-xl px-4 py-3 flex items-center gap-3 animate-in slide-in-from-bottom fade-in">
            <span className="text-sm font-medium">{selectedItems.length} selected</span>
            {actions.map((action, idx) => {
                return (
                    <Button
                        key={idx}
                        variant={action.variant ?? "default"}
                        onClick={action.onClick}
                        className="flex items-center gap-2 min-w-24"
                        disabled={disabled || isLoading}
                    >
                        {isLoading ? (
                            <Spinner/>
                        ) : (
                            <span className={'flex gap-x-2 items-center'}>
                                {action.icon}
                                {action.label}
                            </span>
                        )}
                    </Button>
                );
            })}
        </div>,
        document.body
    );
};
