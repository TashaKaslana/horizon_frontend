import {Clock} from "lucide-react";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {CommentResponse} from "@/types/Comment";
import {formatDateDifference} from "@/lib/utils";
import {useMemo} from "react";
import MentionedText from "@/components/common/mention-text";
import {CommentActionBar} from "@/app/(home)/foryou/comment-section/CommentActionBar";

interface CommentSectionProps {
    comment: CommentResponse,
}

export const CommentSection = ({comment}: CommentSectionProps) => {
    const date = useMemo(() => formatDateDifference(comment.createdAt), [comment.createdAt]);

    return (
        <section
            key={comment.id}
            className="border border-gray-300 duration-300 p-1 rounded-lg w-[calc(100%-8px)] hover:bg-gray-200 bg-gray-100 group/comment"
        >
            <header className={'flex gap-2 h-10 cursor-pointer justify-between w-full'}>
                <div className={'flex gap-2 flex-1'}>
                    <Avatar className={'size-10 border'}>
                        <AvatarImage src={comment.user?.profileImage}/>
                        <AvatarFallback>{comment?.user.displayName.at(0)?.toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className={'flex justify-between h-full w-full'}>
                        <div className={'w-full flex-1'}>
                            <div className={'flex w-full items-center h-5 gap-1 justify-between'}>
                                <div className={'flex items-center h-5 gap-1'}>
                                    <h1 className={'font-bold'}>{comment.user?.displayName}</h1>
                                    <div className={'rounded-full bg-gray-500 size-1'}/>
                                    <span className={'flex h-full items-center text-gray-600 gap-x-1 text-sm'}>
                                        <Clock className={'size-4'}/> <span>{date}</span>
                                </span>
                                </div>
                            </div>
                            <p className={'font-extralight italic text-xs text-zinc-600'}>@{comment.user?.username}</p>
                        </div>
                        <div className={'justify-end'}>
                            <CommentActionBar
                                comment={comment}
                            />
                        </div>
                    </div>
                </div>
            </header>

            <main>
                <MentionedText className={'font-light text-gray-800'} content={comment.content}/>
            </main>
        </section>
    )
}

