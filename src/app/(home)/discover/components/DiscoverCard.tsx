import {Dot, Heart, MessageSquare} from "lucide-react";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {AspectRatio} from "@/components/ui/aspect-ratio";
import {Card, CardContent, CardFooter, CardHeader} from "@/components/ui/card";
import {Badge} from "@/components/ui/badge";
import {formatDateTS, getFixedNumberFormat} from "@/lib/utils";

type DiscoverCardProps = {
    id: string,
    author: string,
    username: string,
    avatar: string,
    src: string,
    view: number,
    title: string,
    description: string,
    timestamp: string,
    likes: number,
    comments: number,
}

export const DiscoverCard = (post : DiscoverCardProps) => {
    const date = formatDateTS(new Date(post.timestamp))
    const formatViews = getFixedNumberFormat(post.view)
    const formatLikes = getFixedNumberFormat(post.likes)
    const formatComments = getFixedNumberFormat(post.comments)

    return (
        <Card className={'py-0 h-[190px] hover:bg-gray-100 transition-colors flex flex-row box-border'}>
            <CardHeader className={'p-0 w-[21rem]'}>
                <AspectRatio ratio={16 / 9}>
                    <video controls className={'size-full object-cover rounded-xl'}>
                        <source src={post.src} type="video/mp4"/>
                    </video>
                </AspectRatio>
            </CardHeader>

            <div className={'flex flex-col justify-between py-1 '}>
                <CardContent className={'px-0 w-full'}>
                    <h1 className={'text-xl font-bold'}>{post.title}</h1>
                    <p>{post.description}</p>
                </CardContent>
                <CardFooter className={'px-0'}>
                    <div className={'w-full'}>
                        <main className={'space-y-1'}>
                            <header className={'flex items-center gap-2'}>
                                <Avatar className={'size-10'}>
                                    <AvatarImage src={post.avatar}/>
                                    <AvatarFallback>{post.author.substring(0,2).toUpperCase()}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <h4>{post.author}</h4>
                                    <i className={'text-xs font-light text-zinc-600'}>@{post.username}</i>
                                </div>
                            </header>
                            <div>
                                <div className={'flex gap-1 text-sm text-gray-500 items-center'}>
                                    <span>{date} </span>
                                    <Dot/>
                                    <span>{formatViews} Views</span>
                                </div>
                                <div className={'flex gap-2'}>
                                    <Badge>
                                        <Heart/>
                                        <span>{formatLikes}</span>
                                    </Badge>
                                    <Badge>
                                        <MessageSquare/>
                                        <span>{formatComments}</span>
                                    </Badge>
                                </div>
                            </div>
                        </main>
                    </div>
                </CardFooter>
            </div>
        </Card>
    )
}