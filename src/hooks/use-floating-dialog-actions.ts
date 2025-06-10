import { useState } from "react";
import {FloatingBarAction} from "@/components/common/floating-bar";

export function useFloatingDialogActions() {
    const [openDialogIndex, setOpenDialogIndex] = useState<number | null>(null);

    const openDialog = (index: number) => setOpenDialogIndex(index);
    const closeDialog = () => setOpenDialogIndex(null);

    const getDialogNode = (actions: FloatingBarAction[]) => {
        if (openDialogIndex === null) return null;
        const action = actions[openDialogIndex];
        return action.renderDialog?.(closeDialog) ?? null;
    };

    return {
        openDialogIndex,
        openDialog,
        closeDialog,
        getDialogNode,
    };
}
