import {useQuery} from "@tanstack/react-query";
import {PostCard} from "@/app/(home)/users/[userId]/components/PostCard"
import {getFeeds} from "@/api/postApi";
import {Box} from "lucide-react";
import Link from "next/link";

interface PostListMainProps {
    userId: string
}

export const PostListMain = ({userId}: PostListMainProps) => {
    const {data} = useQuery({
        queryKey: ['posts'],
        queryFn: async () => {
            return await getFeeds({page: 0, size: 10});
        },
    })

    const posts = data?.data ?? [];

    if (posts.length < 1) {
        return <div className="flex size-full justify-center items-center">
            <div className="flex flex-col items-center">
                <Box className="size-12"/>
                <p className="text-zinc-500">User isn&#39;t display any posts</p>
            </div>
        </div>
    }

    return (
        <div className="grid grid-cols-5 w-full gap-2 px-2">
            {posts.map(feed => (
                <div key={feed.post.id} className={'w-full'}>
                    <Link href={`/users/${userId}/posts/${feed.post.id}`}>
                        <PostCard post={feed.post}/>
                    </Link>
                </div>
            ))}
        </div>
    )
}