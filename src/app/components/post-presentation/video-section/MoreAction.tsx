import {useFeedActions} from "@/app/(home)/foryou/hooks/useFeedAction";
import {Tooltip, TooltipContent, TooltipTrigger} from "@/components/ui/tooltip";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuPortal,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {Button} from "@/components/ui/button";
import {MoreVertical} from "lucide-react";
import React from "react";
import reportReason from '../../../../../public/locales/en/reportReason.json';

export const MoreAction = ({postId}: { postId: string }) => {
    const {handleShareLink, handleReportPost} = useFeedActions();
    const reason = Object.values(reportReason.post)

    return <Tooltip delayDuration={500}>
        <TooltipTrigger asChild>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button className="size-12 rounded-full">
                        <MoreVertical/>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => handleShareLink(postId)}>
                        Share Link
                    </DropdownMenuItem>
                    <DropdownMenuGroup>
                        <DropdownMenuSub>
                            <DropdownMenuSubTrigger>
                                Report Post
                            </DropdownMenuSubTrigger>
                            <DropdownMenuPortal>
                                <DropdownMenuSubContent>
                                    {reason.map((reason: string) => (
                                        <DropdownMenuItem
                                            key={reason}
                                            onClick={() => handleReportPost(postId, reason)}
                                        >
                                            {reason}
                                        </DropdownMenuItem>
                                    ))}
                                </DropdownMenuSubContent>
                            </DropdownMenuPortal>
                        </DropdownMenuSub>
                    </DropdownMenuGroup>
                </DropdownMenuContent>
            </DropdownMenu>
        </TooltipTrigger>
        <TooltipContent>More</TooltipContent>
    </Tooltip>
}