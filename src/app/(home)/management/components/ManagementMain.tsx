import {Card, CardContent, CardFooter} from "@/components/ui/card";
import {AspectRatio} from "@/components/ui/aspect-ratio";
import {Badge} from "@/components/ui/badge";
import {formatDateTS, getFixedNumberFormat} from "@/lib/utils";
import {Heart, MessageSquare} from "lucide-react";
import {usePostManagementStore} from "@/app/(home)/management/store/usePostManagementStore";

export const ManagementMain = () => {
    const {posts} = usePostManagementStore()

    return (
        <main className={'grid grid-cols-2 gap-5'}>
            {posts.map((post) => (
                <PostCard post={post} key={post.id}/>
            ))}
        </main>
    );
};

type PostCard = {
    title: string,
    description: string,
    src: string,
    view: number,
    timestamp: string,
    likes: number,
    comments: number,
}

const PostCard = ({post}: { post: PostCard }) => {
    const date = formatDateTS(new Date(post.timestamp))
    const formatViews = getFixedNumberFormat(post.view)
    const formatLikes = getFixedNumberFormat(post.likes)
    const formatComments = getFixedNumberFormat(post.comments)

    return (
        <Card className={'w-[36rem] pt-0 hover:bg-gray-100 transition'}>
            <CardContent className={'px-0 rounded-t-xl'}>
                <AspectRatio ratio={16 / 9}>
                    <video controls className={'size-full object-cover rounded-t-xl'}>
                        <source src={post.src} type="video/mp4"/>
                    </video>
                </AspectRatio>
            </CardContent>

            <CardFooter className={'w-full'}>
                <div className={'w-full'}>
                    <h1 className={'text-xl font-bold'}>{post.title}</h1>
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
