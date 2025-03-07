import {Clock} from "lucide-react";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";

interface CommentSectionProps {
    commentId?: number,
    user?: {
        id: number;
        username: string;
        displayName: string;
        avatar: string;
    },
    content?: string,
    createdAt?: string
}

export const CommentSection = ({commentId, user, content, createdAt}: CommentSectionProps) => {
    return (
        <section className={'border border-gray-300 duration-300 p-1 rounded-xl ' +
            'w-[calc(100%-8px)] hover:bg-gray-200 bg-gray-100'} key={commentId}>
            <header className={'flex gap-2 h-10 cursor-pointer justify-between'}>
                <div className={'flex gap-2'}>
                    <Avatar className={'size-10'}>
                        <AvatarImage src={user?.avatar}/>
                        <AvatarFallback>{user?.displayName.at(0)?.toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div>
                        <h1 className={'font-bold'}>{user?.displayName}</h1>
                        <p className={'font-extralight italic text-xs text-zinc-600'}>{user?.username}</p>
                    </div>
                </div>

                <span className={'flex text-gray-600 gap-1'}>
                     <Clock/> <span>{createdAt}</span>
                </span>
            </header>

            <main>
                <p className={'font-light text-gray-800'}>{content}</p>
            </main>
        </section>
    )
}