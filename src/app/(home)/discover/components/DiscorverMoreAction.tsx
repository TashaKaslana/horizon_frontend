import {
    DropdownMenu,
    DropdownMenuContent, DropdownMenuGroup,
    DropdownMenuItem, DropdownMenuPortal,
    DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {MoreVertical} from "lucide-react";
import {useFeedActions} from "@/app/(home)/foryou/hooks/useFeedAction";
import React from "react";
import {toast} from "sonner";
import Link from "next/link";
import {useTranslations} from "next-intl";

export const DiscoverMoreAction = ({postId} : {postId: string}) => {
    const actionsT = useTranslations("Home.posts.actions");
    const reportT = useTranslations("Home.posts.report");
    const {handleBookmark, handleReportPost} = useFeedActions();

    // Get report reasons from translations
    const reportReasons = [
        { key: "sexual_content", value: reportT("sexual_content") },
        { key: "graphic_content", value: reportT("graphic_content") },
        { key: "hate_speech", value: reportT("hate_speech") },
        { key: "harassment", value: reportT("harassment") },
        { key: "false_information", value: reportT("false_information") },
        { key: "spam_or_misleading", value: reportT("spam_or_misleading") }
    ];

    return (
        <DropdownMenu>
            <DropdownMenuTrigger>
                <MoreVertical/>
            </DropdownMenuTrigger>
            <DropdownMenuContent side={'left'}>
                <DropdownMenuItem>
                    <Link href={`/foryou/${postId}`}>Redirect to Post</Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleBookmark(postId)}>
                    <span>{actionsT("bookmark")}</span>
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
                <DropdownMenuItem onClick={() => handleShareLink(postId)}>
                    <span>{actionsT("shareLink")}</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

const handleShareLink = (postId: string) => {
    const shareUrl = `${window.location.origin}/foryou/${postId}`;

    navigator.clipboard.writeText(shareUrl)
        .then(() => toast.success("Link copied to clipboard"))
        .catch((err) => console.error("Error copying link: ", err));
};