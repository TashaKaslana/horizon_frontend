import { FloatingBarAction } from "@/components/common/floating-bar";
import { Download, Eye, Trash } from "lucide-react"; // Changed Pencil to Eye for logs
import { exportToExcel } from "@/lib/utils";

// TODO: Replace with actual LogAdminData type import
// import { LogAdminData } from "./log-admin-table";
type LogAdminData = any;

export const logTableActions = (items: LogAdminData[]): FloatingBarAction[] => {
    return [
        {
            label: "View Details", // Changed from Edit for logs
            onClick: () => console.log("View log details action clicked", items),
            variant: "default",
            icon: <Eye />
        },
        {
            label: "Export",
            onClick: () => exportToExcel(items, "logs.xlsx", "Logs"),
            variant: "outline",
            icon: <Download />
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
            icon: <Trash /> // Consider changing icon (e.g., ArchiveIcon)
        },
    ];
};

