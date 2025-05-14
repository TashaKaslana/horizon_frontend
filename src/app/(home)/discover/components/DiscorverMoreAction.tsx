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
import reportReason from "../../../../../public/locales/en/reportReason.json";
import {toast} from "sonner";
import Link from "next/link";

export const DiscoverMoreAction = ({postId} : {postId: string}) => {
    //TODO: use redirect to post of user personal not the foryou
    const {handleBookmark, handleReportPost} = useFeedActions();
    const reason = Object.values(reportReason.post)

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
                    <span>Bookmark</span>
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
                <DropdownMenuItem onClick={() => handleShareLink(postId)}>
                    <span>Share Link</span>
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