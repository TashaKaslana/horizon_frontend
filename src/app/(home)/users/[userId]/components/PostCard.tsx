import {Post} from "@/types/Post";
import {Card, CardContent, CardFooter} from "@/components/ui/card";
import {AspectRatio} from "@/components/ui/aspect-ratio";
import {Badge} from "@/components/ui/badge";
import {cn, formatDateDifference} from "@/lib/utils";
import {Clock, Eye, Grid} from "lucide-react";
import {useState} from "react";

export const PostCard = ({
                             post,
                             isEnableCategory,
                             direction = "vertical"
                         }: {
    post: Post,
    isEnableCategory?: boolean
    direction?: "vertical" | "horizon"
}) => {
    const [isHover, setIsHover] = useState(false)

    return (
        <Card className={cn('p-0 gap-1 hover:bg-gray-300/30',
            !isHover && 'border-transparent shadow-none')
        }
              onMouseEnter={() => setIsHover(true)}
              onMouseLeave={() => setIsHover(false)}
        >
            <CardContent className={'p-0'}>
                <div className={cn(
                    "w-full h-full flex items-center justify-center"
                )}>
                    <AspectRatio ratio={16 / 9}>
                        <video
                            ref={(ref) => {
                                if (ref && isHover) {
                                    ref.play().catch(() => {
                                    });
                                } else if (ref && !isHover) {
                                    ref.pause();
                                    ref.currentTime = 0; // rewind time burh
                                }
                            }}
                            muted={isHover}
                            controls={isHover}
                            loop={isHover}
                            autoPlay={isHover}
                            playsInline
                            className={'object-cover w-full h-full rounded-xl'}>
                            <source src={post.videoPlaybackUrl} type="video/mp4"/>
                            Your browser does not support the video tag.
                        </video>
                    </AspectRatio>
                </div>
            </CardContent>
            <CardFooter className={'flex-col items-start px-2 pb-1'}>
                <div>
                    <h2 className={'text-md font-bold'}>{post.caption}</h2>
                </div>
                <div className={'flex justify-between w-full items-center'}>
                    <div className={'flex items-center gap-2'}>
                        <Badge><Eye/> views</Badge>
                        <Badge><Clock/> {formatDateDifference(new Date(post.createdAt))}</Badge>
                    </div>
                    {isEnableCategory && <Badge><Grid/>{post.categoryName}</Badge>}
                </div>
            </CardFooter>
        </Card>
    )
}