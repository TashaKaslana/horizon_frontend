'use client'

import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {Button} from "@/components/ui/button";
import {useState} from "react";
import {cn} from "@/lib/utils";
import {AchievementIcon} from "../../../../../public/images/share/AchievementIcon";
import {RankType, FollowCardProps} from "@/types/follow";
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@/components/ui/tooltip";
import {useMutation} from "@tanstack/react-query";
import {followUser, unfollowUser} from "@/api/followApi";
import {toast} from "sonner";
import { useTranslations } from "next-intl";

const UserCard = ({follow, initialFollowing = true}: { follow: FollowCardProps, initialFollowing?: boolean }) => {
    const t = useTranslations('Home.following');
    const [isFollowing, setIsFollowing] = useState(initialFollowing)

    const mutation = useMutation({
        mutationFn: async () => {
            if (isFollowing) {
                return await unfollowUser(follow.user.id)
            } else {
                return await followUser(follow.user.id)
            }
        },
        onSuccess: () => {
            setIsFollowing(!isFollowing)
        },
        onError: (error) => {
            toast.error(`${t('actions.follow')} ${isFollowing ? t('actions.unfollow').toLowerCase() : t('actions.follow').toLowerCase()}`)
            console.error(error)
        },
    })

    return (
        <article className={'border rounded bg-gray-100 hover:bg-gray-200 transition'}>
            <header className={'h-12 relative'}>
                <div className={'bg-sky-500 size-full rounded relative'}>
                    <main className={'absolute bottom-2 right-2'}>
                        <AchievementStatus variant={calcRank(follow.user.createdAt)}/>
                    </main>
                </div>
                <Avatar className={'size-16 absolute bottom-0 translate-y-1/2 left-4 border border-gray-200 bg-white/20'}>
                    <AvatarImage src={follow.user.profileImage}/>
                    <AvatarFallback>{follow.user?.displayName?.at(0)?.toUpperCase()}</AvatarFallback>
                </Avatar>
            </header>

            <main className={'flex h-24'}>
                <section className={'w-24 relative'}></section>
                <section className={'flex-1'}>
                    <h2 className={'text-zinc-800 font-semibold'}>{follow.user?.displayName ? follow.user?.displayName : null}</h2>
                    <p className={'text-sm text-gray-700 italic'}>@{follow.user.username}</p>
                    <p className={'text-sm pl-1 text-gray-800'}>{follow.user.bio}</p>
                </section>
                <section className={'p-1'}>
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    className={cn('w-32', !isFollowing && 'bg-zinc-800 hover:bg-zinc-700')}
                                    onClick={() => mutation.mutate()}
                                >
                                    {isFollowing ? t('actions.following') : t('actions.follow')}
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                {isFollowing ? t('actions.unfollow') : t('actions.follow')}
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </section>
            </main>
        </article>
    )
}

const AchievementStatus = (props: { variant: RankType }) => (
    <TooltipProvider>
        <Tooltip>
            <TooltipTrigger asChild>
                <AchievementIcon className={"size-7"} variant={props.variant}/>
            </TooltipTrigger>
            <TooltipContent>
                {props.variant}
            </TooltipContent>
        </Tooltip>
    </TooltipProvider>
);

const calcRank = (date: string) => {
    const date1 = new Date(date)
    const date2 = new Date()
    const diffTime = Math.abs(date2.getTime() - date1.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    if (diffDays < 30) {
        return 'beginner'
    } else if (diffDays < 30 * 6) {
        return 'intermediate'
    } else {
        return 'expert'
    }
}

export default UserCard