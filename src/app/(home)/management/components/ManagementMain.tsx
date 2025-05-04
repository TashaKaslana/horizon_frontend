import {Card, CardContent, CardFooter} from "@/components/ui/card";
import {AspectRatio} from "@/components/ui/aspect-ratio";
import {Badge} from "@/components/ui/badge";
import {formatDateTS, getFixedNumberFormat} from "@/lib/utils";
import {Heart, MessageSquare} from "lucide-react";
import {Feed} from "@/types/Feed";
import {usePostManagement} from "@/app/(home)/management/hooks/usePostManagement";
import InfiniteScroll from "@/components/ui/infinite-scroll";
import {Spinner} from "@/components/ui/spinner";
import React from "react";

export const ManagementMain = () => {
    const {feeds, isFetchingNextPage, fetchNextPage, hasNextPage} = usePostManagement()

    return (
        <div className={'space-y-5'}>
            <main className={'grid grid-cols-2 gap-5 place-items-center'}>
                <InfiniteScroll isLoading={isFetchingNextPage} hasMore={hasNextPage} next={fetchNextPage}>
                    {feeds?.map((feed) => (
                        <PostCard feed={feed} key={feed.post.id}/>
                    ))}
                </InfiniteScroll>
            </main>
            <Spinner show={isFetchingNextPage} className={'text-sky-500'}/>
        </div>
    );
};

const PostCard = ({feed}: { feed: Feed }) => {
    const date = formatDateTS(new Date(feed.post.createdAt))
    //TODO: add views
    const formatViews = /*getFixedNumberFormat(feed.view ?? 0)*/ 0
    const formatLikes = getFixedNumberFormat(feed.statistic.totalLikes ?? 0)
    const formatComments = getFixedNumberFormat(feed.statistic.totalComments ?? 0)

    return (
        <Card className={'w-[36rem] pt-0 hover:bg-gray-100 transition'}>
            <CardContent className={'px-0 rounded-t-xl'}>
                <AspectRatio ratio={16 / 9}>
                    <video controls className={'size-full object-cover rounded-t-xl'}>
                        <source src={feed.post.videoPlaybackUrl} type="video/mp4"/>
                    </video>
                </AspectRatio>
            </CardContent>

            <CardFooter className={'w-full'}>
                <div className={'w-full'}>
                    <h1 className={'text-xl font-bold'}>{feed.post.caption}</h1>
                    <div className={'flex justify-between text-sm text-gray-500'}>
                        <span>{date}</span>
                        <span>{formatViews} Views</span>
                    </div>
                    <div className={'flex gap-2 mt-2'}>
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
            </CardFooter>
        </Card>
    )
}
