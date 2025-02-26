import {useState} from "react";
import {AlignLeft} from "lucide-react";
import {Separator} from "@/components/ui/separator";
import {ScrollArea} from "@/components/ui/scroll-area";
import {CommentSection} from "@/app/home/foryou/(comment-section)/CommentSection";

interface CommentContainerProps {
    isCommentOpened?: boolean
}

const CommentContainer = ({isCommentOpened}: CommentContainerProps) => {
    const items = [
        {
            id: 1,
            user: {
                id: 1,
                username: '@UserDisplay',
                displayName: 'UserDisplay',
                avatar: 'https://github.com/shadcn.png',
            },
            content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed vel felis vel dui faucibus tempor. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Vestibulum at velit vitae ex fermentum faucibus. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.',
            createdAt: '2022-01-01',
        },
        {
            id: 1,
            user: {
                id: 1,
                username: '@UserDisplay',
                displayName: 'UserDisplay',
                avatar: 'https://github.com/shadcn.png',
            },
            content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed vel felis vel dui faucibus tempor. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Vestibulum at velit vitae ex fermentum faucibus. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.',
            createdAt: '2022-01-01',
        },
        {
            id: 1,
            user: {
                id: 1,
                username: '@UserDisplay',
                displayName: 'UserDisplay',
                avatar: 'https://github.com/shadcn.png',
            },
            content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed vel felis vel dui faucibus tempor. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Vestibulum at velit vitae ex fermentum faucibus. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.',
            createdAt: '2022-01-01',
        },
        {
            id: 1,
            user: {
                id: 1,
                username: 'UserDisplay',
                displayName: 'UserDisplay',
                avatar: 'https://github.com/shadcn.png',
            },
            content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed vel felis vel dui faucibus tempor. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Vestibulum at velit vitae ex fermentum faucibus. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.',
            createdAt: '2022-01-01',
        }
    ]


    return (
        <article
            className={'border rounded-xl transition-all duration-500 p-3 space-y-2' + (isCommentOpened ? ' w-[28rem] h-[36rem]' : ' scale-0')}>
            <CommentHeader/>
            <Separator/>
            <ScrollArea className={'h-[calc(100%-28px)] p-2 w-[calc(100%+8px)]'}>
                <div className={'space-y-2'}>
                    {items.map(((item, index) => (
                            <CommentSection
                                key={index}
                                commentId={item.id}
                                user={item.user}
                                content={item.content}
                                createdAt={item.createdAt}
                            />
                        ))
                    )}
                </div>
            </ScrollArea>
        </article>
    )
}

const CommentHeader = () => {
    const [commentCount, ] = useState(0)

    return (
        <header className={'flex justify-between'}>
            <h1 className={'font-bold'}>
                Comments <span className={'font-light text-zinc-800'}> - {commentCount}</span>
            </h1>
            <AlignLeft/>
        </header>
    )
}

export default CommentContainer