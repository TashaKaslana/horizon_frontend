import {ScrollArea} from "@/components/ui/scroll-area";
import {DiscoverCard} from "@/app/(home)/discover/components/DiscoverCard";
import {useDiscoverStore} from "@/app/(home)/discover/store/useDiscoverPostStore";

export const DiscoverTabContent = () => {
    const {posts} = useDiscoverStore()

    return <ScrollArea className="">
        <div className="space-y-3 lg:max-h-[calc(100vh-10rem)]">
            {posts.map((post, index) => (
                <DiscoverCard key={index} {...post} />
            ))}
        </div>
    </ScrollArea>
}