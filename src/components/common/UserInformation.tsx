import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";

export const UserInformation = ({className}: { className?: string }) => {
    const information = {
        id: 1,
        avatar: 'https://github.com/shadcn.png',
        userDisplay: 'User Display',
        username: 'UserName'
    }

    return (
        <div
            className={'flex gap-2 items-center hover:bg-gray-300 p-1 rounded cursor-pointer select-none ' + className}>
            <Avatar>
                <AvatarImage src={information.avatar}/>
                <AvatarFallback>
                    {information.userDisplay.at(0)?.toUpperCase()}
                </AvatarFallback>
            </Avatar>
            <div>
                <h1 className={'font-bold text-md'}>{information.userDisplay}</h1>
                <p className={'font-extralight text-xs italic text-zinc-600'}>@{information.username}</p>
            </div>
        </div>
    )
}