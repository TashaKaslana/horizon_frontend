import {FloatingBarAction} from "@/components/common/floating-bar";
import {Download, Trash} from "lucide-react"; // Changed Pencil to Eye for logs
import {exportToExcel} from "@/lib/utils";
import {LogEntryDto} from "@/api/client";

export const logTableActions = (items: LogEntryDto[]): FloatingBarAction[] => {
    return [
        {
            label: "Export",
            onClick: () => exportToExcel(items, "logs.xlsx", "Logs"),
            variant: "outline",
            icon: <Download/>
        },
        {
            label: "Archive", // Changed from Delete for logs, assuming logs are archived not deleted
            onClick: async () => {
                return new Promise<void>((resolve) =>
                    setTimeout(() => {
                        console.log("Archive log action clicked");
                        resolve();
                    }, 2000)
                );
            },
            variant: "destructive", // Consider changing variant based on action
            icon: <Trash/> // Consider changing icon (e.g., ArchiveIcon)
        },
    ];
};

