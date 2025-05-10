import {Post} from "@/types/Post";
import {Card, CardContent, CardFooter} from "@/components/ui/card";
import {AspectRatio} from "@/components/ui/aspect-ratio";
import {Badge} from "@/components/ui/badge";
import {cn, formatDateDifference} from "@/lib/utils";
import {Clock, Dot, Eye, Grid} from "lucide-react";
import {useState} from "react";

export const PostCard = ({
                             post,
                             isEnableCategory,
                             direction = "vertical"
                         }: {
    post: Post;
    isEnableCategory?: boolean;
    direction?: "vertical" | "horizon";
}) => {
    const [isHover, setIsHover] = useState(false);
    const isHorizontal = direction === "horizon";

    return (
        <Card
            className={cn(
                "p-0 hover:bg-gray-300/30 gap-1",
                isHorizontal ? "flex flex-row gap-4 w-full" : "flex flex-col",
                !isHover && "border-transparent shadow-none"
            )}
            onMouseEnter={() => setIsHover(true)}
            onMouseLeave={() => setIsHover(false)}
        >
            <CardContent className={cn("p-0", isHorizontal ? "w-1/3 h-full" : "w-full")}>
                <AspectRatio ratio={16 / 9}>
                    <video
                        ref={(ref) => {
                            if (ref && isHover) {
                                ref.play().catch(() => {
                                });
                            } else if (ref) {
                                ref.pause();
                                ref.currentTime = 0;
                            }
                        }}
                        muted={isHover}
                        controls={isHover}
                        loop={isHover}
                        autoPlay={isHover}
                        playsInline
                        className="object-cover w-full h-full rounded-xl"
                    >
                        <source src={post.videoPlaybackUrl} type="video/mp4"/>
                        Your browser does not support the video tag.
                    </video>
                </AspectRatio>
            </CardContent>

            <div className={cn(isHorizontal ? "w-1/2 p-2 flex flex-col justify-between w-full" : "")}>
                <CardFooter
                    className={cn("gap-1", isHorizontal ? "p-0 flex-col items-start w-full" : "flex-col items-start px-2 pb-1")}>
                    <h2 className="text-md font-bold">{post.caption}</h2>

                    <div className="flex justify-between w-full items-center flex-wrap gap-2 text-zinc-600 text-xs">
                        <div className="flex items-center">
                            <span className={'flex gap-1 items-center'}><Eye className="w-4 h-4"/>1.24m views</span>
                            <Dot/>
                            <span className={'flex gap-1 items-center'}><Clock
                                className="w-4 h-4"/> {formatDateDifference(new Date(post.createdAt))}</span>
                        </div>
                        {isEnableCategory && (
                            <Badge>
                                <Grid className="w-4 h-4"/> {post.categoryName}
                            </Badge>
                        )}
                    </div>
                    {isHorizontal && post.description && (
                        <div className="pt-2 text-sm text-muted-foreground line-clamp-3 h-full">
                            {post.description}
                        </div>
                    )}
                </CardFooter>
            </div>
        </Card>
    );
};