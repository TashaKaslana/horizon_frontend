import {Button} from "@/components/ui/button";
import {BookMarked, Heart, MessageSquareMore, MoreVertical} from "lucide-react";
import React from "react";

interface ActionButtonGroupProps {
    setIsCommentOpened?: React.Dispatch<React.SetStateAction<boolean>>
}

const ActionButtonGroup = ({setIsCommentOpened}: ActionButtonGroupProps) => {
    const items = [
        {
            icon: <Heart/>,
            label: 'Like',
            action: LikeAction
        },
        {
            icon: <MessageSquareMore/>,
            label: 'Comment',
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
        <div className={'flex flex-col gap-4 justify-end'}>
            {items.map((item, index) => (
                <Button key={index} className={'size-12 rounded-full'} onClick={item.action}>
                    {item.icon}
                </Button>
            ))}
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

}

export default ActionButtonGroup