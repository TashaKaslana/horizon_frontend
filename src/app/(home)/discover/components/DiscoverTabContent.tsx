import {ScrollArea} from "@/components/ui/scroll-area";
import {DiscoverCard} from "@/app/(home)/discover/components/DiscoverCard";
import {useDiscoverStore} from "@/app/(home)/discover/store/useDiscoverPostStore";
import InfiniteScroll from "@/components/ui/infinite-scroll";
import { useDiscovery } from "../hooks/useDiscovery";
import {Spinner} from "@/components/ui/spinner";

export const DiscoverTabContent = () => {
    const {feeds} = useDiscoverStore()
    const {feedIsFetching, feedHasNextPage, feedFetchNext} = useDiscovery()

    return <ScrollArea className="">
        <div className="space-y-3 lg:max-h-[calc(100vh-10rem)]">
            <InfiniteScroll isLoading={feedIsFetching} hasMore={feedHasNextPage} next={feedFetchNext}>
                {feeds.map((feed, index) => (
                    <DiscoverCard key={index} {...feed} />
                ))}
                <Spinner show={feedIsFetching}/>
            </InfiniteScroll>
        </div>
    </ScrollArea>
}