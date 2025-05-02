'use client'

import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {Button} from "@/components/ui/button";
import {useState} from "react";
import {cn} from "@/lib/utils";
import {AchievementIcon} from "../../../../../public/images/share/AchievementIcon";
import {RankType, FollowCardProps} from "@/app/(home)/following/types/type";
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@/components/ui/tooltip";

const UserCard = ({follow, initialFollowing = true} : {follow: FollowCardProps, initialFollowing?: boolean}) => {
    const [isFollowing, setIsFollowing] = useState(initialFollowing)

    const handleToggleFollowing = () => {
        setIsFollowing(!isFollowing)
    }

    return (
        <article className={'border rounded bg-gray-100 hover:bg-gray-200 transition'}>
            <header className={'h-12 relative'}>
                <div className={'bg-sky-500 size-full rounded relative'}>
                    <main className={'absolute bottom-2 right-2'}>
                        <AchievementStatus variant={"beginner"}/>
                    </main>
                </div>
                <Avatar className={'size-16 absolute bottom-0 translate-y-1/2 left-4'}>
                    <AvatarImage src={follow.user.profileImage}/>
                    <AvatarFallback>{follow.user.lastName?.at(0)?.toUpperCase()}</AvatarFallback>
                </Avatar>
            </header>

            <main className={'flex h-24'}>
                <section className={'w-24 relative'}>

                </section>
                <section className={'flex-1'}>
                    <h2 className={'text-zinc-800 font-semibold'}>{follow.user.lastName}</h2>
                    <p className={'text-sm text-gray-700 italic'}>@{follow.user.username}</p>
                    <p className={'text-sm pl-1 text-gray-800'}>Bio ####</p>
                </section>
                <section className={'p-1'}>
                    <Button className={cn('w-32', !isFollowing && 'bg-zinc-800 hover:bg-zinc-700')}
                            onClick={handleToggleFollowing}
                    >
                        {isFollowing ? 'Following' : 'Follow'}
                    </Button>
                </section>
            </main>
        </article>
    )
}

const AchievementStatus = (props: { variant: RankType }) => <TooltipProvider>
    <Tooltip>
        <TooltipTrigger asChild>
            <AchievementIcon className={"size-7"} variant={props.variant}/>
        </TooltipTrigger>
        <TooltipContent>
            {props.variant}
        </TooltipContent>
    </Tooltip>
</TooltipProvider>;

export default UserCard