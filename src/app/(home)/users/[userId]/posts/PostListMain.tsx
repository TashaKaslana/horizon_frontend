import {useQuery} from "@tanstack/react-query";
import {PostCard} from "@/app/(home)/users/[userId]/components/PostCard"
import {getFeeds} from "@/api/postApi";
import {Box} from "lucide-react";
import Link from "next/link";
import {useUserPost} from "@/app/(home)/users/[userId]/posts/hooks/useUserPost";
import {Button} from "@/components/ui/button";
import {useEffect} from "react";
import {useTranslations} from "next-intl";

interface PostListMainProps {
    userId: string
}

export const PostListMain = ({userId}: PostListMainProps) => {
    const t = useTranslations('Home.user_profile.posts');
    const {feeds, setFeeds, handleSort} = useUserPost()

    const {data} = useQuery({
        queryKey: ['posts'],
        queryFn: async () => {
            return await getFeeds({page: 0, size: 10});
        },
    })

    useEffect(() => {
        setFeeds(data?.data ?? [])
    }, [data?.data, setFeeds]);

    if (feeds.length < 1) {
        return <div className="flex size-full justify-center items-center">
            <div className="flex flex-col items-center">
                <Box className="size-12"/>
                <p className="text-zinc-500">{t('user_no_posts')}</p>
            </div>
        </div>
    }

    return (
        <section className={'space-y-2'}>
            <header className="flex gap-2 px-4">
                <Button variant={'outline'} onClick={() => handleSort('newest')}>{t('sort.newest')}</Button>
                <Button variant={'outline'} onClick={() => handleSort('oldest')}>{t('sort.oldest')}</Button>
                <Button variant={'outline'} onClick={() => handleSort('popular')}>{t('sort.popular')}</Button>
            </header>

            <main className="grid grid-cols-5 w-full gap-2 px-2">
                {feeds.map(feed => (
                    <div key={feed.post.id} className={'w-full'}>
                        <Link href={`/users/${userId}/posts/${feed.post.id}`}>
                            <PostCard post={feed.post} views={feed.statistic.totalViews}/>
                        </Link>
                    </div>
                ))}
            </main>
        </section>
    )
}