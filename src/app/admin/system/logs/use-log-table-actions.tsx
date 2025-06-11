import {FloatingBarAction} from "@/components/common/floating-bar";
import {Download, Trash} from "lucide-react"; // Changed Pencil to Eye for logs
import {exportToExcel} from "@/lib/utils";
import {LogEntryDto} from "@/api/client";
import {useLoggingManagement} from "@/app/admin/system/logs/useLoggingManagement";

export const useLogTableActions = (items: LogEntryDto[]): FloatingBarAction[] => {
    const {bulkDeleteLogEntries} = useLoggingManagement()

    return [
        {
            label: "Export",
            onClick: () => exportToExcel(items, "logs.xlsx", "Logs"),
            variant: "outline",
            icon: <Download/>
        },
        // {
        //     label: "Archive", // Changed from Delete for logs, assuming logs are archived not deleted
        //     onClick: async () => {
        //         return new Promise<void>((resolve) =>
        //             setTimeout(() => {
        //                 console.log("Archive log action clicked");
        //                 resolve();
        //             }, 2000)
        //         );
        //     },
        //     variant: "destructive", // Consider changing variant based on action
        //     icon: <Trash/> // Consider changing icon (e.g., ArchiveIcon)
        // },
        {
            label: "Delete",
            onClick: async () => bulkDeleteLogEntries(items.map(item => item.id!)),
            variant: "destructive",
            icon: <Trash/>
        }
    ];
};

