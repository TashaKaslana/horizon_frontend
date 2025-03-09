import {ScrollArea} from "@/components/ui/scroll-area";
import {DiscoverCard} from "@/app/(home)/discover/components/DiscoverCard";

export const DiscoverTabContent = () => {
    const items = [{
        id: 1,
        title: 'Card Title',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec vitae neque non arcu pretium dignissim.',
        author: 'Author Name',
        avatar: 'https://github.com/shadcn.png',
        date: '2022-01-01',
        interactions: 100,
    }]

    return <ScrollArea className={'h-[calc(100vh-88px)]'}>
        <div className={'grid grid-cols-4 place-items-center gap-4'}>
            {items.map((item, index) =>
                <DiscoverCard key={index} {...item}/>
            )}
        </div>
    </ScrollArea>;
}