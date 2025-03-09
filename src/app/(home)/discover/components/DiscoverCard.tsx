import {Heart} from "lucide-react";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";

type DiscoverCardProps = {
    interactions: number,
    author: string,
    avatar: string
}

export const DiscoverCard = ({interactions, author, avatar} : DiscoverCardProps) => {
    return (
        <article className={'space-y-1'}>
            <main className={'h-[18rem] w-64 relative'}>
                <div className={'bg-sky-500 size-full rounded-xl border'}/>
                <span className={'absolute bottom-2 left-2 flex gap-1 text-white'}>
                    <Heart/> {interactions}
                </span>
            </main>
            <footer className={'flex gap-1 items-center'}>
                <Avatar>
                    <AvatarImage src={avatar}/>
                    <AvatarFallback>{author?.at(0)?.toUpperCase()}</AvatarFallback>
                </Avatar>
                <h2 className={'text-gray-900 text-md font-semibold'}>{author}</h2>
            </footer>
        </article>
    )
}