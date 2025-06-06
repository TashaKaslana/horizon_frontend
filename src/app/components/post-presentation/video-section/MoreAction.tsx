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
import {useTranslations} from "next-intl";

export const MoreAction = ({postId}: { postId: string }) => {
    const actionsT = useTranslations("Home.posts.actions");
    const reportT = useTranslations("Home.posts.report");
    const {handleShareLink, handleReportPost} = useFeedActions();

    const reportReasons = [
        { key: "sexual_content", value: reportT("sexual_content") },
        { key: "graphic_content", value: reportT("graphic_content") },
        { key: "hate_speech", value: reportT("hate_speech") },
        { key: "harassment", value: reportT("harassment") },
        { key: "false_information", value: reportT("false_information") },
        { key: "spam_or_misleading", value: reportT("spam_or_misleading") }
    ];

    return <Tooltip delayDuration={500}>
        <TooltipTrigger asChild>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button className="size-12 rounded-full">
                        <MoreVertical/>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => handleShareLink()}>
                        {actionsT("shareLink")}
                    </DropdownMenuItem>
                    <DropdownMenuGroup>
                        <DropdownMenuSub>
                            <DropdownMenuSubTrigger>
                                {actionsT("reportPost")}
                            </DropdownMenuSubTrigger>
                            <DropdownMenuPortal>
                                <DropdownMenuSubContent>
                                    {reportReasons.map(({key, value}) => (
                                        <DropdownMenuItem
                                            key={key}
                                            onClick={() => handleReportPost(postId, value)}
                                        >
                                            {value}
                                        </DropdownMenuItem>
                                    ))}
                                </DropdownMenuSubContent>
                            </DropdownMenuPortal>
                        </DropdownMenuSub>
                    </DropdownMenuGroup>
                </DropdownMenuContent>
            </DropdownMenu>
        </TooltipTrigger>
        <TooltipContent>{actionsT("more")}</TooltipContent>
    </Tooltip>
}