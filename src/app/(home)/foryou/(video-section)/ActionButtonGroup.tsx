import {Button} from "@/components/ui/button";
import {BookMarked, Heart, MessageSquareMore, MoreVertical} from "lucide-react";
import React from "react";
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@/components/ui/tooltip";
import {toast} from "sonner";

interface ActionButtonGroupProps {
    setIsCommentOpened?: React.Dispatch<React.SetStateAction<boolean>>
}

const ActionButtonGroup = ({setIsCommentOpened}: ActionButtonGroupProps) => {
    const {likeAmount, commentAmount} = {
        likeAmount: 140,
        commentAmount: 99
    };

    const items = [
        {
            icon: <Heart/>,
            label: 'Like',
            amount: likeAmount,
            action: LikeAction
        },
        {
            icon: <MessageSquareMore/>,
            label: 'Comment',
            amount: commentAmount,
            action: () => CommentAction(setIsCommentOpened)
        },
        {
            icon: <BookMarked/>,
            label: 'Bookmark',
            action: BookmarkAction
        },
        {
            icon: <MoreVertical/>,
            label: 'More'
        }
    ]

    return (
        <div className={'flex flex-col gap-8 justify-end absolute right-[-60px]'}>
            <TooltipProvider>
                {items.map((item, index) => (
                    <Tooltip key={index} delayDuration={500}>
                        <TooltipTrigger asChild>
                            <span className={'relative'}>
                                <Button className={'size-12 rounded-full'} onClick={item?.action}>
                                    {item.icon}
                                </Button>
                                {
                                    item.amount && <p className={'absolute left-1/2 transform -translate-x-1/2 bottom-[-24px] text-center'}>{item.amount}</p>
                                }
                            </span>
                        </TooltipTrigger>
                        <TooltipContent>
                            {item.label}
                        </TooltipContent>
                    </Tooltip>
                ))}
            </TooltipProvider>
        </div>
    )
}

const CommentAction = (setIsCommentOpened: React.Dispatch<React.SetStateAction<boolean>> | undefined) => {
    if (setIsCommentOpened) {
        setIsCommentOpened(prevState => !prevState);
    }
}

const LikeAction = () => {

}

const BookmarkAction = () => {
    toast.success('Bookmark added to your book mark!', {
        description: 'You have successfully bookmarked this post.',
        duration: 3000,
    });
}

export default ActionButtonGroup