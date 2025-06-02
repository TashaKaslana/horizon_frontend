'use client'

import {OverviewCard} from "@/app/admin/components/card-overview";
import usePostsStore from "@/app/admin/posts/all/stores/usePostsStore";
import {usePostsManagement} from "@/app/admin/posts/all/hooks/usePostsManagement";
import {Skeleton} from "@/components/ui/skeleton";

export const PostCardList = () => {
    const {overviewData} = usePostsStore()
    const {isPostOverviewLoading} = usePostsManagement()

    return (
        <>
            {
                isPostOverviewLoading ? (
                        <div className={'h-32 w-full flex-col space-y-2 px-2'}>
                            <Skeleton className={'h-3 w-1/5 bg-zinc-500'}/>
                            <Skeleton className={'h-3 w-2/5 bg-zinc-500'}/>
                            <Skeleton className={'h-3 w-3/5 bg-zinc-500'}/>
                            <Skeleton className={'h-3 w-4/5 bg-zinc-500'}/>
                            <Skeleton className={'h-3 w-full bg-zinc-500'}/>
                        </div>
                    ) :
                    <div className="*:data-[slot=card]:shadow-xs @xl/main:grid-cols-2 @5xl/main:grid-cols-4 grid grid-cols-4 gap-4
                            px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5
                            *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card lg:px-6 w-full">
                        {overviewData.map((card, index) => (
                            <OverviewCard key={index} data={card}/>
                        ))}
                    </div>
            }
        </>
    )
}