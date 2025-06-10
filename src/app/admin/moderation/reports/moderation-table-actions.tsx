import {FloatingBarAction} from "@/components/common/floating-bar";
import {Download, Edit, Trash} from "lucide-react";
import {exportToExcel} from "@/lib/utils";
import {ReportDto} from "@/api/client";
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from "@/components/ui/dropdown-menu";



export const moderationTableActions = (items: ReportDto[]): FloatingBarAction[] => {
    const Status = {
        Resolved: "Resolved",
        REVIEWED_APPROVED: "Approved",
        REVIEWED_REJECTED: "Rejected",
        ACTIONTAKEN_CONTENTREMOVED: "Content Removed",
        ACTIONTAKEN_USERBANNED: "User Banned",
        ACTIONTAKEN_USERWARNED: "User Warned",
        PENDING: "Pending",
    }

    return [
        {
            render: (close) => {
                return <DropdownMenu>
                    <DropdownMenuTrigger>
                        Change Status
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        {
                            Object.values(Status).map((status) => (
                                <DropdownMenuItem
                                    key={status}
                                    onClick={() => {
                                        console.log(`Change status to ${status}`);
                                        close();
                                    }}
                                >
                                    {status}
                                </DropdownMenuItem>
                            ))
                        }
                    </DropdownMenuContent>
                </DropdownMenu>
            },
            icon: <Edit/>
        },
        {
            label: "Export",
            onClick: () => exportToExcel(items, "reports.xlsx", "Reports"),
            variant: "outline",
            icon: <Download/>
        },
        {
            label: "Delete",
            onClick: async () => {
                return new Promise<void>((resolve) =>
                    setTimeout(() => {
                        console.log("Resolve report action clicked");
                        resolve();
                    }, 2000)
                );
            },
            variant: "destructive",
            icon: <Trash/>
        },
    ];
};


