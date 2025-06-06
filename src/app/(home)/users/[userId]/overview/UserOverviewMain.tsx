'use client'

import {PostCard} from "@/app/(home)/users/[userId]/components/PostCard";
import {getFeedByUserId} from "@/api/postApi";
import {useQuery} from "@tanstack/react-query";
import {cn} from "@/lib/utils";
import Link from "next/link";
import {useTranslations} from "next-intl";

const UserOverviewMain = ({userId}: { userId: string }) => {
    const t = useTranslations('Home.user_profile.posts');
    const {data} = useQuery({
        queryKey: ['posts'],
        queryFn: async () => {
            return await getFeedByUserId({userId});
        },
    })

    const feeds = data?.data ?? [];
    //TODO: add actual popular
    const feed = feeds.at(0)

    return (
        <div>
            <div className={'px-10 pb-3'}>
                {feeds.length > 0 ? (<div className={'flex flex-col gap-5'}>
                    <div>
                        <h2 className={'text-2xl font-bold'}>{t('most_popular')}</h2>
                        <div className={cn('flex justify-center flex-1 px-12')}>
                            {feed !== undefined && (
                                <div key={feed.post.id} className={'w-full'}>
                                    <PostCard post={feed.post}
                                              isEnableCategory
                                              direction={'horizon'}
                                              views={feed.statistic.totalViews}
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                    <div>
                        <h3 className={'text-xl font-semibold'}>{t('recent')}</h3>
                        <div className={cn('grid grid-cols-5 gap-2 w-full')}>
                            {feeds.map(feed => (
                                <div key={feed.post.id} className={'w-full'}>
                                    <Link href={`/users/${userId}/posts/${feed.post.id}`}>
                                        <PostCard post={feed.post} views={feed.statistic.totalViews}/>
                                    </Link>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>) : (
                    <div className={'flex flex-col justify-center items-center size-full'}>
                        <h2 className={'text-2xl font-bold'}>{t('no_posts')}</h2>
                        <p className={'text-muted-foreground'}>
                            {t('no_posts_description')}
                        </p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default UserOverviewMain;