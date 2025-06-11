import {FloatingBarAction} from "@/components/common/floating-bar";
import {Download, Edit, Trash} from "lucide-react";
import {exportToExcel} from "@/lib/utils";
import {ReportDto} from "@/api/client";
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from "@/components/ui/dropdown-menu";



export const moderationTableActions = (items: ReportDto[], type: 'ALL' | 'USER' | 'COMMENT' |'POST'): FloatingBarAction[] => {
    const Status = {
        RESOLVED: "Resolved",
        REVIEWED_APPROVED: "Approved",
        REVIEWED_REJECTED: "Rejected",
        ACTIONTAKEN_CONTENTREMOVED: "Content Removed",
        ACTIONTAKEN_USERBANNED: "User Banned",
        ACTIONTAKEN_USERWARNED: "User Warned",
        PENDING: "Pending",
    }
    let status: string[];

    if (type === 'ALL') {
        status = Object.values(Status);
    } else if (type === 'COMMENT') {
        status = [Status.REVIEWED_APPROVED, Status.REVIEWED_REJECTED, Status.ACTIONTAKEN_CONTENTREMOVED];
    } else if (type === 'USER') {
        status = [Status.REVIEWED_APPROVED, Status.ACTIONTAKEN_USERBANNED, Status.ACTIONTAKEN_USERWARNED, Status.REVIEWED_REJECTED];
    } else if (type === 'POST') {
        status = [Status.REVIEWED_APPROVED, Status.REVIEWED_REJECTED, Status.ACTIONTAKEN_CONTENTREMOVED];
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
                            status.map((status) => (
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


