import React, {useEffect, useRef} from "react";
import {AlignLeft, MessageSquareMore} from "lucide-react";
import {Separator} from "@/components/ui/separator";
import {CommentSection} from "@/app/(home)/foryou/comment-section/CommentSection";
import {useInfiniteQuery} from "@tanstack/react-query";
import {getCommentsByPostId} from "@/app/(home)/foryou/api/commentApi";
import {PaginationInfo} from "@/types/api";
import {UUID} from "node:crypto";
import InfiniteScroll from "@/components/ui/infinite-scroll";
import {CommentInput} from "@/app/(home)/foryou/comment-section/CommentInput";
import {Spinner} from "@/components/ui/spinner";
import {useCommentStore} from "@/app/(home)/foryou/store/useCommentStore";

interface CommentProps {
    postId: UUID,
    isCommentOpened?: boolean,
    isVisible: boolean
}

const CommentContainer = ({postId, isCommentOpened, isVisible}: CommentProps) => {
    const scrollRef = useRef<HTMLDivElement>(null);
    const {comments, setComments} = useCommentStore();

    const {data, isFetchingNextPage, fetchNextPage, hasNextPage} = useInfiniteQuery({
        queryKey: ['foryou-comments', postId],
        queryFn: async ({pageParam = 0}) => {
            return await getCommentsByPostId(postId, {page: pageParam, size: 10})
        },
        getNextPageParam: lastPage => {
            const pagination: PaginationInfo | undefined = lastPage.metadata?.pagination;

            return pagination?.hasNext ? pagination.currentPage + 1 : undefined;
        },
        initialPageParam: 0
    })

    useEffect(() => {
        if (data) {
            const allComments = data.pages.flatMap(page => page.data);
            setComments(allComments);
        }
    }, [data, setComments]);

    //prevent scroll event of parent when open comment container
    //bugs
    const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
        if (!isCommentOpened) return;

        const el = scrollRef.current;
        if (!el) return;

        const isAtTop = el.scrollTop === 0;
        const isAtBottom = el.scrollHeight - el.scrollTop === el.clientHeight;

        if ((!isAtTop && e.deltaY < 0) || (!isAtBottom && e.deltaY > 0)) {
            e.stopPropagation();
        }
    };

    return (
        <>
            <article
                className={'border rounded-xl transition-all duration-500 py-3 pl-3 gap-2 w-[28rem] h-[38rem] bg-gray-50 flex flex-col'}>
                <CommentHeader amount={comments.length}/>

                <Separator/>
                <div
                    ref={scrollRef}
                    onWheel={handleWheel}
                    className={'flex-1 min-h-0 overflow-y-auto space-y-2'}>
                    {(comments.length == 0) ? (
                            <div className={'flex justify-center items-center h-full'}>
                                <div className={'flex flex-col items-center gap-2'}>
                                    <MessageSquareMore className={'size-1/3'}/>
                                    <p>Become first person comment in this post</p>
                                </div>
                            </div>
                        ) :
                        <InfiniteScroll isLoading={isFetchingNextPage} hasMore={hasNextPage} next={fetchNextPage}>
                            {comments.map(((comment, index) => (
                                    <CommentSection
                                        key={index}
                                        comment={comment}
                                    />
                                ))
                            )}
                            <Spinner show={isFetchingNextPage} className={'text-green-500'}/>
                        </InfiniteScroll>
                    }
                </div>
                <CommentInput postId={postId} isVisible={isVisible}/>
            </article>
        </>
    )
}

interface CommentHeaderProps {
    amount?: number
}

const CommentHeader = ({amount}: CommentHeaderProps) => {
    return (
        <header className={'flex justify-between bg-gray-100 rounded px-1 mr-3'}>
            <h1 className={'font-bold'}>
                Comments <span className={'font-light text-zinc-800'}> - {amount}</span>
            </h1>
            <AlignLeft/>
        </header>
    )
}

export default CommentContainer