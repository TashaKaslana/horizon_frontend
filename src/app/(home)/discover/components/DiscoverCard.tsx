import {Dot, Heart, MessageSquare} from "lucide-react";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {AspectRatio} from "@/components/ui/aspect-ratio";
import {Card, CardContent, CardFooter, CardHeader} from "@/components/ui/card";
import {Badge} from "@/components/ui/badge";
import {formatDateTS, getFixedNumberFormat} from "@/lib/utils";
import {Feed} from "@/types/Feed";
import {DiscoverMoreAction} from "@/app/(home)/discover/components/DiscorverMoreAction";

export const DiscoverCard = (feed : Feed) => {
    const date = formatDateTS(new Date(feed.post.createdAt))
    const formatViews = /*getFixedNumberFormat(feed.statistic.view ?? 0)*/ 0
    const formatLikes = getFixedNumberFormat(feed.statistic.totalLikes)
    const formatComments = getFixedNumberFormat(feed.statistic.totalComments)

    return (
        <Card className={'py-0 h-[190px] hover:bg-gray-100 transition-colors flex flex-row box-border'}>
            <CardHeader className={'p-0 w-[21rem]'}>
                <AspectRatio ratio={16 / 9}>
                    <video controls className={'size-full object-cover rounded-xl'}>
                        <source src={feed.post.videoPlaybackUrl} type="video/mp4"/>
                    </video>
                </AspectRatio>
            </CardHeader>

            <div className={'flex flex-col justify-between py-1 w-full'}>
                <CardContent className={'pl-0 pr-4 w-full flex justify-between'}>
                    <div>
                        <h1 className={'text-xl font-bold'}>{feed.post.caption}</h1>
                        <p>{feed.post.description}</p>
                    </div>
                    <DiscoverMoreAction postId={feed.post.id}/>
                </CardContent>
                <CardFooter className={'px-0'}>
                    <div className={'w-full'}>
                        <main className={'space-y-1'}>
                            <header className={'flex items-center gap-2'}>
                                <Avatar className={'size-10'}>
                                    <AvatarImage src={feed.post.user.profileImage}/>
                                    <AvatarFallback>{feed.post.user.displayName.substring(0,2).toUpperCase()}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <h4>{feed.post.user.displayName}</h4>
                                    <i className={'text-xs font-light text-zinc-600'}>@{feed.post.user.username}</i>
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