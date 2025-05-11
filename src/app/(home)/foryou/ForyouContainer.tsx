'use client';

import React, {useRef} from "react";
import {useFeedActions} from "@/app/(home)/foryou/hooks/useFeedAction";
import {FeedListUI} from "@/app/components/post-presentation/FeedListUI";

export const ForyouContainer = ({ postId }: { postId?: string }) => {
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    const {
        feeds,
        isFetchingNextPage,
        fetchNextPage,
        hasNextPage,
    } = useFeedActions(postId);

    return (
        <FeedListUI
            feeds={feeds}
            isLoading={isFetchingNextPage}
            hasMore={hasNextPage ?? false}
            loadMore={fetchNextPage}
            scrollContainerRef={scrollContainerRef}
        />
    );
};

export default ForyouContainer;
