'use client'

import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import { useUser } from "@auth0/nextjs-auth0";
import {UserIntroduction, UserSummary} from "@/types/user";

export const UserInformation = ({className}: { className?: string }) => {
    const {user} = useUser()

    return (
        <article
            className={'flex gap-2 items-center hover:bg-gray-300 p-1 rounded cursor-pointer select-none transition duration-300 ' + className}>
            <Avatar>
                <AvatarImage src={user?.picture}/>
                <AvatarFallback>
                    {user?.name?.at(0)?.toUpperCase()}
                </AvatarFallback>
            </Avatar>
            <main className={'text-start'}>
                <h1 className={'font-bold text-md'}>{user?.name}</h1>
                <p className={'font-extralight text-xs italic text-zinc-600'}>@{user?.nickname}</p>
            </main>
        </article>
    )
}

export const UserIntroductionCard = ({user, className} : {user: UserIntroduction, className?: string}) => {
    return <article
        className={'flex gap-2 items-center hover:bg-gray-300 p-1 rounded cursor-pointer select-none transition duration-300 ' + className}>
        <Avatar>
            <AvatarImage src={user.profileImage}/>
            <AvatarFallback>
                {user.displayName.at(0)?.toUpperCase()}
            </AvatarFallback>
        </Avatar>
        <main className={'text-start'}>
            <h1 className={'font-bold text-md'}>{user?.displayName}</h1>
            <p className={'font-extralight text-xs italic text-zinc-600'}>@{user?.username}</p>
        </main>
    </article>
}

export const UserSummaryCard = ({user, className} : {user: UserSummary, className?: string}) => {
    return <article
        className={'flex gap-2 items-center hover:bg-gray-300 p-1 rounded cursor-pointer select-none transition duration-300 ' + className}>
        <Avatar>
            <AvatarImage src={user.profileImage}/>
            <AvatarFallback>
                {user.displayName ? user.displayName.at(0)?.toUpperCase() : null}
            </AvatarFallback>
        </Avatar>
        <main className={'text-start'}>
            <h1 className={'font-bold text-md'}>{user.displayName ? user?.displayName : null}</h1>
            <p className={'font-extralight text-xs italic text-zinc-600'}>@{user?.username}</p>
        </main>
    </article>
}