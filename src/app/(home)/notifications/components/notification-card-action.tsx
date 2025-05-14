import {Button} from "@/components/ui/button";
import {MoreVertical, X} from "lucide-react";
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from "@/components/ui/dropdown-menu";
import React from "react";

export const NotificationCardAction = ({onToggleRead, isRead, onDismiss, type}: {
    onToggleRead: () => void;
    isRead: boolean;
    onDismiss: () => void;
    type: "post" | "like" | "comment" | "mention" | "follow" | "system";
}) => (
    <div className="flex gap-1">
        <Button variant="ghost" size="icon" onClick={onDismiss}>
            <X className="h-4 w-4"/>
            <span className="sr-only">Dismiss</span>
        </Button>
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                    <MoreVertical className="h-4 w-4"/>
                    <span className="sr-only">More options</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={onToggleRead}>{isRead ? "Mark as unread" : "Mark as read"}</DropdownMenuItem>
                <DropdownMenuItem onClick={onDismiss}>Dismiss</DropdownMenuItem>
                <DropdownMenuItem>Disable {type} notifications</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    </div>
);