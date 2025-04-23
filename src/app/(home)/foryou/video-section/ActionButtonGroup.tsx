import {Button} from "@/components/ui/button";
import {BookMarked, Heart, MessageSquareMore, MoreVertical} from "lucide-react";
import React, {useEffect} from "react";
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@/components/ui/tooltip";
import {Statistic} from "@/types/Feed";
import {UUID} from "node:crypto";
import {BookmarkAction, checkLikeStatus, LikeAction, RemoveLikeAction} from "@/app/(home)/foryou/actions/actions";

interface ActionButtonGroupProps {
    setIsCommentOpened?: React.Dispatch<React.SetStateAction<boolean>>
    postId: UUID
    statistic?: Statistic
}

const ActionButtonGroup = ({setIsCommentOpened, postId, statistic}: ActionButtonGroupProps) => {
    const [isLiked, setIsLiked] = React.useState(false);

    useEffect(() => {
        if (postId) {
            checkLikeStatus(postId)
                .then(res => setIsLiked(res));
        }
    }, [postId]);

    const toggleLike = () => {
        if (isLiked) {
            RemoveLikeAction(postId).then().catch((e) => console.error(e));
        } else {
            LikeAction(postId).then().catch((e) => console.error(e))
        }

        setIsLiked(!isLiked);
    }

    const items = [
        {
            icon: <Heart/>,
            label: 'Like',
            amount: statistic?.totalLikes ?? 0,
            action: toggleLike
        },
        {
            icon: <MessageSquareMore/>,
            label: 'Comment',
            amount: statistic?.totalComments ?? 0,
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

                                <p className={'absolute left-1/2 transform -translate-x-1/2 bottom-[-24px] text-center'}>{item.amount}</p>
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

export default ActionButtonGroup