import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {TabsList, TabsTrigger} from "@/components/ui/tabs";
import {useDiscoverStore} from "@/app/(home)/discover/store/useDiscoverPostStore";
import {usePostCategoryStore} from "@/app/(home)/discover/store/usePostCategoryStore";
import InfiniteScroll from "@/components/ui/infinite-scroll";
import {useDiscovery} from "@/app/(home)/discover/hooks/useDiscovery";
import {ScrollArea, ScrollBar} from "@/components/ui/scroll-area";

export const DiscoverHeader = ({triggers}: { triggers: string[] }) => {
    const viewOptions = ['Popular', 'Recent', 'Rating']
    const {sortFeeds} = useDiscoverStore()
    const {setSelectedCategory} = usePostCategoryStore()
    const {categoryHasNextPage, categoryFetchNext, categoryIsFetching} = useDiscovery()

    const handleValueChange = (value: 'popular' | 'rating' | 'recent') => {
        sortFeeds(value)
    }

    return <header className={'space-y-3 border p-1 rounded sticky'}>
        <div className={'flex justify-between'}>
            <div>
                <h1 className={'p-0 m-0 text-3xl font-semibold text-gray-900 dark:text-white/70'}>Discover</h1>
                <p className={'text-sm font-light text-zinc-600'}>Display all video by category</p>
            </div>

            <Select defaultValue={viewOptions[0].toLowerCase()} onValueChange={handleValueChange}>
                <SelectTrigger className={'w-32'}>
                    <SelectValue placeholder={viewOptions[0]}/>
                </SelectTrigger>
                <SelectContent>
                    {viewOptions.map((viewOption, index) =>
                        <SelectItem value={viewOption.toLowerCase()} key={index}>
                            {viewOption}
                        </SelectItem>
                    )}
                </SelectContent>
            </Select>
        </div>
        <TabsList className={'w-full'}>
            <ScrollArea className={'justify-between'}>
                <InfiniteScroll
                    isLoading={categoryIsFetching}
                    hasMore={categoryHasNextPage}
                    next={categoryFetchNext}
                    direction={'horizontal'}
                    rootMargin={'0px 100px 0px 0px'}
                >
                    {triggers.map((trigger, index) =>
                        <TabsTrigger
                            value={trigger}
                            key={index}
                            onClick={() => setSelectedCategory(trigger)}
                            className={'w-24'}
                        >
                            {trigger}
                        </TabsTrigger>
                    )}
                </InfiniteScroll>
                <ScrollBar orientation="horizontal"/>
            </ScrollArea>
        </TabsList>
    </header>;
}