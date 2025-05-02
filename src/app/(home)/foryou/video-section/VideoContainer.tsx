import ActionButtonGroup from "@/app/(home)/foryou/video-section/ActionButtonGroup";
import React, {Ref, Suspense} from "react";
import {useConfigStore} from "@/stores/useConfigStore";
import {Feed} from "@/types/Feed";
import {Card, CardContent, CardFooter} from "@/components/ui/card";
import {Post} from "@/types/Post";
import {Badge} from "@/components/ui/badge";
import {formatDateTS} from "@/lib/utils";
import {UserOverview} from "@/components/common/UserInformation";
import {Clock, Grid} from "lucide-react";

interface VideoContainerProps {
    setIsCommentOpened?: React.Dispatch<React.SetStateAction<boolean>>,
    feed: Feed,
    ref?: Ref<HTMLVideoElement>,
}


const VideoContainer = ({setIsCommentOpened, feed, ref}: VideoContainerProps) => {
    return (
        <div className={'flex gap-4 items-center relative'}>
            <Suspense fallback={<div>Loading...</div>}>
                <VideoSection post={feed.post} ref={ref}/>
                <ActionButtonGroup setIsCommentOpened={setIsCommentOpened}
                                   postId={feed.post.id}
                                   statistic={feed.statistic}/>
            </Suspense>
        </div>
    )
}


const VideoSection = ({post, ref}: { post: Post, ref?: Ref<HTMLVideoElement>}) => {
    const {videoSettings} = useConfigStore()

    const getValueByKey = (key: string) => {
        const value = videoSettings.find((v) => v.key === key)?.value;

        if (typeof value === 'boolean') return value;
        if (typeof value === 'string') return value;

        return true;
    };

    return (
        <Card className={'pt-0 pb-2 gap-2'}>
            <CardContent className={'h-[22rem] rounded-xl transition aspect-video p-0'}>
                <video
                    ref={ref}
                    loop={getValueByKey('loop_video') === true}
                    controls={getValueByKey('control_video') === true}
                    playsInline
                    muted
                    className={'object-cover w-full h-full rounded-xl'}
                    src={post.videoPlaybackUrl ?? 'https://www.w3schools.com/tags/mov_bbb.mp4'}
                    poster={post.videoThumbnailUrl ?? undefined}
                />
            </CardContent>
            <CardFooter className={'h-max-56 flex-col items-start px-4'}>
                <div className={'w-full flex justify-between items-start'}>
                    <div>
                        <h4 className={'text-xl bold'}>{post.caption}</h4>
                        <p className={'text-xs text-zinc-700 dark:text-zinc-300'}>{post.description}</p>
                    </div>
                    <UserOverview user={post.user}/>
                </div>
                <div className={'w-full'}>
                    <div className={'flex justify-between items-center'}>
                        <div>
                            <Badge><Clock/> {formatDateTS(post.createdAt)}</Badge>
                        </div>
                        <div className={'flex items-center'}>
                            <Badge><Grid/> {post.categoryName}</Badge>
                        </div>
                    </div>

                    <div className={'space-x-2'}>
                        {post.tags?.map(tag => (
                            <Badge key={tag} variant={'outline'}># {tag}</Badge>
                        ))}
                    </div>
                </div>
            </CardFooter>
        </Card>

    )
}

export default VideoContainer