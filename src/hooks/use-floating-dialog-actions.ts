import {useCallback, useState} from "react";

export function useFloatingDialogActions() {
    const [openDialogIndex, setOpenDialogIndex] = useState<number | null>(null);

    const openDialog = useCallback((index: number) => {
        setOpenDialogIndex(index);
    }, []);

    const closeDialog = useCallback(() => {
        setOpenDialogIndex(null);
    }, []);

    return {
        openDialogIndex,
        openDialog,
        closeDialog,
    };
}
