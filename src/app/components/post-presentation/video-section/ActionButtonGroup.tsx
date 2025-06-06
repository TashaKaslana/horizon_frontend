import {Button} from "@/components/ui/button";
import {BookMarked, Heart, MessageSquareMore} from "lucide-react";
import React from "react";
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@/components/ui/tooltip";
import {Statistic} from "@/types/Feed";
import {useFeedActions} from "@/app/(home)/foryou/hooks/useFeedAction";
import {MoreAction} from "@/app/components/post-presentation/video-section/MoreAction";
import {useTranslations} from "next-intl";

interface ActionButtonGroupProps {
    setIsCommentOpened?: React.Dispatch<React.SetStateAction<boolean>>;
    postId: string;
    statistic?: Statistic;
}

const ActionButtonGroup = ({setIsCommentOpened, postId, statistic}: ActionButtonGroupProps) => {
    const t = useTranslations("Home.posts.actions");
    const {handleLike, handleBookmark} = useFeedActions();

    const handleCommentToggle = () => {
        setIsCommentOpened?.((prev) => !prev);
    };

    const items = [
        {
            icon: <Heart className={statistic?.isLiked ? 'fill-red-500 text-red-500' : ''}/>,
            label: t('like'),
            amount: statistic?.totalLikes ?? 0,
            action: () => handleLike(postId),
        },
        {
            icon: <MessageSquareMore/>,
            label: t('comment'),
            amount: statistic?.totalComments ?? 0,
            action: handleCommentToggle,
        },
        {
            icon: <BookMarked className={statistic?.isBookmarked ? 'fill-yellow-500 text-yellow-500' : ''}/>,
            label: t('bookmark'),
            action: () => handleBookmark(postId),
        },
    ];

    return (
        <div className="flex flex-col gap-8 justify-end absolute right-[-60px]">
            <TooltipProvider>
                {items.map((item, index) => (
                    <Tooltip key={index} delayDuration={500}>
                        <TooltipTrigger asChild>
                          <span className="relative">
                            <Button className="size-12 rounded-full" onClick={item.action}>
                              {item.icon}
                            </Button>
                              {item.amount !== undefined && (
                                  <p className="absolute left-1/2 transform -translate-x-1/2 bottom-[-24px] text-center text-sm">
                                      {item.amount}
                                  </p>
                              )}
                          </span>
                        </TooltipTrigger>
                        <TooltipContent>{item.label}</TooltipContent>
                    </Tooltip>
                ))}

                <MoreAction postId={postId}/>
            </TooltipProvider>
        </div>
    );
};

export default ActionButtonGroup;
