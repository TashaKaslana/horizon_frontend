import ActionButtonGroup from "@/app/components/post-presentation/video-section/ActionButtonGroup";
import React, {Ref, Suspense} from "react";
import {useConfigStore} from "@/stores/useConfigStore";
import {Feed} from "@/types/Feed";
import {Card, CardContent, CardFooter} from "@/components/ui/card";
import {PostSummary} from "@/types/Post";
import {Badge} from "@/components/ui/badge";
import {formatDateTS} from "@/lib/utils";
import {UserSummaryCard} from "@/components/common/UserInformation";
import {Clock, Eye, Grid} from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";

interface VideoContainerProps {
    setIsCommentOpened?: React.Dispatch<React.SetStateAction<boolean>>,
    feed: Feed,
    ref?: Ref<HTMLVideoElement>,
}

const VideoContainer = ({setIsCommentOpened, feed, ref}: VideoContainerProps) => {
    const t = useTranslations('Home.foryou');

    return (
        <div className={'flex gap-4 items-center relative'}>
            <Suspense fallback={<div>{t('loading')}</div>}>
                <VideoSection post={feed.post} ref={ref} views={feed.statistic.totalViews}/>
                <ActionButtonGroup setIsCommentOpened={setIsCommentOpened}
                                   postId={feed.post.id}
                                   statistic={feed.statistic}/>
            </Suspense>
        </div>
    )
}


const VideoSection = ({post, ref, views = 0}: { post: PostSummary, ref?: Ref<HTMLVideoElement>, views: number }) => {
    const {videoSettings} = useConfigStore()
    const t = useTranslations('Home.foryou');

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
                    <Link href={`/users/${post.user.id}/overview`}>
                        <UserSummaryCard user={post.user}/>                    
                    </Link>
                </div>
                <div className={'w-full'}>
                    <div className={'flex justify-between items-center'}>
                        <div className={'flex gap-2'}>
                            <Badge><Eye/> {views} {t('postInfo.views')}</Badge>
                            <Badge><Clock/> {formatDateTS(new Date(post.createdAt))}</Badge>
                        </div>
                        <div className={'flex items-center'}>
                            <Badge><Grid/> {t('postInfo.category')}: {post.categoryName}</Badge>
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

export default VideoContainer;
