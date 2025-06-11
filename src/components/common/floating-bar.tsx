import {createPortal} from "react-dom";
import {Button} from "@/components/ui/button";
import {Spinner} from "@/components/ui/spinner";
import {ReactNode, useState} from "react";
import {X} from "lucide-react";
import {useFloatingDialogActions} from "@/hooks/use-floating-dialog-actions";

export interface FloatingBarAction {
    label?: string;
    render?: ReactNode | ((close: () => void) => ReactNode);
    onClick?: () => Promise<void> | void;
    variant?: "default" | "outline" | "destructive";
    icon?: ReactNode;
    renderDialog?: (
        close: () => void,
        setIsLoading: (isLoading: boolean) => void,
    ) => ReactNode;
}

export interface FloatingBarProps {
    selectedCount: number,
    actions: FloatingBarAction[],
    disabled?: boolean,
    onClearSelection?: () => void
}

export const FloatingBar = ({
                                selectedCount,
                                actions,
                                disabled,
                                onClearSelection
                            }: FloatingBarProps) => {
    const [loadingSet, setLoadingSet] = useState<Set<number>>(new Set());
    const {
        openDialogIndex, // Get the state
        openDialog,
        closeDialog
    } = useFloatingDialogActions();

    if (selectedCount === 0 || actions.length === 0) return null;
    if (typeof document === "undefined") return null;

    const handleActionClick = async (action: FloatingBarAction, index: number) => {
        if (disabled || loadingSet.has(index)) return;

        if (action.renderDialog) {
            openDialog(index);
            return;
        }

        const result = action.onClick?.();
        if (result instanceof Promise) {
            setLoadingSet(currentSet => new Set(currentSet).add(index));

            try {
                await result;
            } finally {
                setLoadingSet(currentSet => {
                    const updatedSet = new Set(currentSet);
                    updatedSet.delete(index);
                    return updatedSet;
                });
            }
        }
    };

    const activeAction = openDialogIndex !== null ? actions[openDialogIndex] : null;
    const dialogNode = activeAction?.renderDialog?.(
        closeDialog,
        (isLoading: boolean) => {
            setLoadingSet(currentSet => {
                const updatedSet = new Set(currentSet);
                if (isLoading) {
                    updatedSet.add(openDialogIndex!);
                } else {
                    updatedSet.delete(openDialogIndex!);
                }
                return updatedSet;
            });
        }
    );

    return createPortal(
        <div
            role="region"
            aria-live="polite"
            aria-label={`${selectedCount} items selected`}
            className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 shadow-lg bg-white border rounded-xl px-4 py-3 flex items-center gap-3 animate-in slide-in-from-bottom fade-in"
        >
            <span className="text-sm font-medium sr-only">{selectedCount} selected</span>
            {actions.map((action, idx) => (
                <Button
                    key={idx}
                    variant={action.variant ?? "default"}
                    onClick={() => handleActionClick(action, idx)}
                    className="flex items-center gap-2 min-w-24"
                    disabled={disabled || loadingSet.has(idx)}
                >
                    {loadingSet.has(idx) ? (
                        <Spinner size={'small'}/>
                    ) : (
                        action.render ? (
                            typeof action.render === 'function' ? action.render(closeDialog) : action.render
                        ) : (
                            <span className="flex gap-x-2 items-center">
                                {action.icon}
                                {action.label}
                            </span>
                        )
                    )}
                </Button>
            ))}
            {onClearSelection && (
                <>
                    <span className={'sr-only'}>Exit</span>
                    <X
                        onClick={onClearSelection}
                        size={24}
                        className={'hover:bg-gray-200 p-1 rounded-xl transition-color'}
                    />
                </>
            )}
            {dialogNode}
        </div>,
        document.body
    );
};
