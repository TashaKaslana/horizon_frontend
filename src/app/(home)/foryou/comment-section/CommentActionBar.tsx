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
import {useCommentAction} from "@/app/(home)/foryou/hooks/useCommentAction";

import reports from '@/../public/locales/en/report.json'

export const CommentActionBar = ({comment}: {
    comment: CommentResponse,
}) => {
    const reportReasons = reports['commentReport']

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
                        <p className={'text-sm font-light'}>Like</p>
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
                        <p className={'text-sm font-light'}>Reply</p>
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
                                            <Copy className={'mr-2'}/> Copy
                                        </DropdownMenuItem>
                                        {comment.isPinned ? (
                                            <DropdownMenuItem
                                                onClick={handleUnPinComment}
                                                className={'cursor-pointer text-emerald-400'}>
                                                <PinOff className={'mr-2'}/> Unpin
                                            </DropdownMenuItem>
                                        ) : (
                                            <DropdownMenuItem
                                                onClick={handlePinComment}
                                                className={'cursor-pointer text-emerald-400'}>
                                                <Pin className={'mr-2'}/> Pin
                                            </DropdownMenuItem>
                                        )}
                                    </DropdownMenuGroup>

                                    <DropdownMenuSeparator/>
                                    <DropdownMenuGroup>
                                        <DropdownMenuItem
                                            onClick={handleEdit}
                                            className={'cursor-pointer text-sky-400'}
                                        >
                                            <Edit className={'mr-2'}/> Edit
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            onClick={handleDelete}
                                            className={'cursor-pointer text-sky-400'}>
                                            <Delete className={'mr-2'}/> Delete
                                        </DropdownMenuItem>
                                    </DropdownMenuGroup>

                                    <DropdownMenuSeparator/>

                                    <DropdownMenuGroup>
                                        <DropdownMenuSub>
                                            <DropdownMenuSubTrigger
                                                className={'cursor-pointer text-red-600'}
                                            >
                                                <AlertTriangle className={'mr-2'}/> Report
                                            </DropdownMenuSubTrigger>
                                            <DropdownMenuPortal>
                                                <DropdownMenuSubContent>
                                                    {reportReasons.map((reason: string) => (
                                                        <DropdownMenuItem
                                                            key={reason}
                                                            onClick={() => handleReportComment(reason)}
                                                            className={'cursor-pointer text-red-600'}>
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
                    <TooltipContent>
                        <p className={'text-sm font-light'}>More</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        </section>
    )
}