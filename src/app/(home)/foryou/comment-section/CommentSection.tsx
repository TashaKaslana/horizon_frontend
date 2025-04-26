import {Clock} from "lucide-react";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {CommentResponse} from "@/types/Comment";
import {formatDateTS} from "@/lib/utils";

interface CommentSectionProps {
   comment: CommentResponse
}
//TODO: add displayName

export const CommentSection = ({comment}: CommentSectionProps) => {
    return (
        <section className={'border border-gray-300 duration-300 p-1 rounded-xl ' +
            'w-[calc(100%-8px)] hover:bg-gray-200 bg-gray-100'} key={comment.id}>
            <header className={'flex gap-2 h-10 cursor-pointer justify-between'}>
                <div className={'flex gap-2'}>
                    <Avatar className={'size-10'}>
                        <AvatarImage src={comment.user?.profileImage}/>
                        <AvatarFallback>{comment?.user.lastName.at(0)?.toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div>
                        <h1 className={'font-bold'}>{comment.user?.lastName}</h1>
                        <p className={'font-extralight italic text-xs text-zinc-600'}>@{comment.user?.username}</p>
                    </div>
                </div>

                <span className={'flex text-gray-600 gap-1'}>
                     <Clock/> <span>{formatDateTS(comment.createdAt)}</span>
                </span>
            </header>

            <main>
                <p className={'font-light text-gray-800'}>{comment.content}</p>
            </main>
        </section>
    )
}