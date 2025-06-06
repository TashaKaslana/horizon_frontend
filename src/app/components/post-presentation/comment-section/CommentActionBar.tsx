import {CommentResponse} from "@/types/Comment";
import {ThumbsUp, Reply, MoreVertical, Copy, Delete, Edit, AlertTriangle, Pin, PinOff} from 'lucide-react';
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@/components/ui/tooltip";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuPortal,
    DropdownMenuSeparator,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {useCommentAction} from "@/hooks/useCommentAction";
import {useTranslations} from "next-intl";

export const CommentActionBar = ({comment}: {
    comment: CommentResponse,
}) => {
    const t = useTranslations("Home.comments.actions");
    const reportT = useTranslations("Home.comments.report");

    const reportReasons = [
        { key: "violent", value: reportT("violent") },
        { key: "hate_speech", value: reportT("hate_speech") },
        { key: "harassment", value: reportT("harassment") },
        { key: "abusive_language", value: reportT("abusive_language") },
        { key: "misinformation", value: reportT("misinformation") },
        { key: "spam", value: reportT("spam") },
        { key: "personal_attacks", value: reportT("personal_attacks") }
    ];

    const {
        handleLike,
        handleReply,
        handleEdit,
        handleDelete,
        handleCopy,
        handlePinComment,
        handleUnPinComment,
        handleReportComment
    } = useCommentAction({comment})

    return (
        <section className="flex">
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger>
                        <ThumbsUp
                            onClick={handleLike}
                            className={'rounded-l-md border p-2 size-8 group-hover/comment:border-white'}
                        />
                    </TooltipTrigger>
                    <TooltipContent>
                        <p className={'text-sm font-light'}>{t("like")}</p>
                    </TooltipContent>
                </Tooltip>

                <Tooltip>
                    <TooltipTrigger>
                        <Reply
                            onClick={handleReply}
                            className={'border-y p-2 size-8 group-hover/comment:border-white'}
                        />
                    </TooltipTrigger>
                    <TooltipContent>
                        <p className={'text-sm font-light'}>{t("reply")}</p>
                    </TooltipContent>
                </Tooltip>

                <Tooltip>
                    <TooltipTrigger asChild>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild className={'p-2'}>
                                <MoreVertical className={'rounded-r-md border-y border-x size-8 group-hover/comment:border-white'}/>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className={'w-32'}>
                                    <DropdownMenuGroup>
                                        <DropdownMenuItem
                                            onClick={handleCopy}
                                            className={'cursor-pointer text-emerald-400'}>
                                            <Copy className={'mr-2'}/> {t("copy")}
                                        </DropdownMenuItem>
                                        {comment.isPinned ? (
                                            <DropdownMenuItem
                                                onClick={handleUnPinComment}
                                                className={'cursor-pointer text-emerald-400'}>
                                                <PinOff className={'mr-2'}/> {t("unpin")}
                                            </DropdownMenuItem>
                                        ) : (
                                            <DropdownMenuItem
                                                onClick={handlePinComment}
                                                className={'cursor-pointer text-emerald-400'}>
                                                <Pin className={'mr-2'}/> {t("pin")}
                                            </DropdownMenuItem>
                                        )}
                                    </DropdownMenuGroup>

                                    <DropdownMenuSeparator/>
                                    <DropdownMenuGroup>
                                        <DropdownMenuItem
                                            onClick={handleEdit}
                                            className={'cursor-pointer text-sky-400'}
                                        >
                                            <Edit className={'mr-2'}/> {t("edit")}
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            onClick={handleDelete}
                                            className={'cursor-pointer text-sky-400'}>
                                            <Delete className={'mr-2'}/> {t("delete")}
                                        </DropdownMenuItem>
                                    </DropdownMenuGroup>

                                    <DropdownMenuSeparator/>

                                    <DropdownMenuGroup>
                                        <DropdownMenuSub>
                                            <DropdownMenuSubTrigger
                                                className={'cursor-pointer text-red-600'}
                                            >
                                                <AlertTriangle className={'mr-2'}/> {t("report")}
                                            </DropdownMenuSubTrigger>
                                            <DropdownMenuPortal>
                                                <DropdownMenuSubContent>
                                                    {reportReasons.map(({key, value}) => (
                                                        <DropdownMenuItem
                                                            key={key}
                                                            onClick={() => handleReportComment(value)}
                                                            className={'cursor-pointer text-red-600'}>
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
                    <TooltipContent>
                        <p className={'text-sm font-light'}>{t("more")}</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        </section>
    )
}