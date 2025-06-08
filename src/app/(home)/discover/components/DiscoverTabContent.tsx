import {ScrollArea} from "@/components/ui/scroll-area";
import {DiscoverCard} from "@/app/(home)/discover/components/DiscoverCard";
import {useDiscoverStore} from "@/app/(home)/discover/store/useDiscoverPostStore";
import InfiniteScroll from "@/components/ui/infinite-scroll";
import {useDiscovery} from "../hooks/useDiscovery";
import {Spinner} from "@/components/ui/spinner";
import {useTranslations} from "next-intl";

export const DiscoverTabContent = () => {
    const {feeds} = useDiscoverStore()
    const {feedIsFetching, feedHasNextPage, feedFetchNext} = useDiscovery()
    const t = useTranslations('Home.discover');

    return <ScrollArea className="">
        <div className="space-y-3 lg:max-h-[calc(100vh-10rem)]">
            {(feeds.length === 0 && !feedIsFetching) ? (
                <div className="text-center text-muted-foreground py-10">
                    {t('noResults')}
                </div>
            ) : (
                <InfiniteScroll isLoading={feedIsFetching} hasMore={feedHasNextPage} next={feedFetchNext}>
                    {feeds.map((feed, index) => (
                        <DiscoverCard key={index} {...feed} />
                    ))}
                    <Spinner show={feedIsFetching}/>
                </InfiniteScroll>
            )}
        </div>
    </ScrollArea>
}