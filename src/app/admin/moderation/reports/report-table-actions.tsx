import { FloatingBarAction } from "@/components/common/floating-bar";
import { Download, Pencil, Trash } from "lucide-react";
import { exportToExcel } from "@/lib/utils";

// TODO: Replace with actual ReportAdminData type import
// import { ReportAdminData } from "./report-admin-table";
type ReportAdminData = any;

export const reportTableActions = (items: ReportAdminData[]): FloatingBarAction[] => {
    return [
        {
            label: "View Details", // Changed from Edit for reports
            onClick: () => console.log("View report details action clicked", items),
            variant: "default",
            icon: <Pencil />
        },
        {
            label: "Export",
            onClick: () => exportToExcel(items, "reports.xlsx", "Reports"),
            variant: "outline",
            icon: <Download />
        },
        {
            label: "Resolve", // Changed from Delete for reports
            onClick: async () => {
                return new Promise<void>((resolve) =>
                    setTimeout(() => {
                        console.log("Resolve report action clicked");
                        resolve();
                    }, 2000)
                );
            },
            variant: "destructive", // Consider changing variant based on action
            icon: <Trash /> // Consider changing icon based on action (e.g., CheckSquare)
        },
    ];
};

