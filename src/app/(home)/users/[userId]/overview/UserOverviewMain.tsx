'use client'

import {PostCard} from "@/app/(home)/users/[userId]/components/PostCard";
import {getFeeds} from "@/api/postApi";
import {useQuery} from "@tanstack/react-query";
import {cn} from "@/lib/utils";

const UserOverviewMain = () => {

    const {data} = useQuery({
        queryKey: ['posts'],
        queryFn: async () => {
            return await getFeeds({page: 0, size: 10});
        },
    })

    const posts = data?.data ?? [];

    //TODO: DEMO
    return (
        <div>
            <div className={'px-10 py-3'}>
                <div className={'flex flex-col gap-5'}>
                    <div>
                        <h2 className={'text-2xl font-bold'}>The most popular post</h2>
                        <div className={cn('flex gap-2 ', posts.length < 3 && 'justify-around')}>
                            {posts.slice(0,3).map(feed => (
                                <div key={feed.post.id} className={'w-1/3'}>
                                    <PostCard post={feed.post} isEnableCategory/>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div>
                        <h3 className={'text-xl font-semibold'}>Posts</h3>
                        <div className={cn('grid grid-cols-5 gap-2 w-full')}>
                            {posts.map(feed => (
                                <div key={feed.post.id} className={'w-full'}>
                                    <PostCard post={feed.post}/>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default UserOverviewMain;