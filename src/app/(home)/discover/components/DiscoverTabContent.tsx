import {ScrollArea} from "@/components/ui/scroll-area";
import {DiscoverCard} from "@/app/(home)/discover/components/DiscoverCard";

export const DiscoverTabContent = () => {
    const items = [
        {
            id: "0",
            title: "Discovering the Sea",
            description: "A journey through the vast oceans of the world.",
            src: "https://www.w3schools.com/tags/mov_bbb.mp4",
            avatar: "https://github.com/shadcn.png/",
            author: "JaneDoe",
            username: "janedoe",
            category: "travel",
            tags: ["adventure", "water", "scuba diving"],
            view: 1234,
            timestamp: "2025-02-28T12:00:00Z",
            likes: 750,
            comments: 15,
        },
        {
            id: "1",
            title: "Exploring the Mountains",
            description: "A journey through the majestic landscapes of the Alps.",
            src: "https://www.w3schools.com/tags/mov_bbb.mp4",
            avatar: "https://github.com/shadcn.png/",
            author: "JohnDoe",
            username: "john123",
            category: "education",
            tags: ["adventure", "nature", "hiking"],
            view: 1523,
            timestamp: "2025-03-18T14:30:00Z",
            likes: 875,
            comments: 12,
        },
        {
            id: "3",
            title: "Discovering the Sea",
            description: "A journey through the vast oceans of the world.",
            src: "https://www.w3schools.com/tags/mov_bbb.mp4",
            avatar: "https://github.com/shadcn.png/",
            author: "JaneDoe",
            username: "janedoe",
            category: "travel",
            tags: ["adventure", "water", "scuba diving"],
            view: 1234,
            timestamp: "2025-02-28T12:00:00Z",
            likes: 750,
            comments: 15,
        },
        {
            id: "4",
            title: "Exploring the Mountains",
            description: "A journey through the majestic landscapes of the Alps.",
            src: "https://www.w3schools.com/tags/mov_bbb.mp4",
            avatar: "https://github.com/shadcn.png/",
            author: "JohnDoe",
            username: "john123",
            category: "education",
            tags: ["adventure", "nature", "hiking"],
            view: 1523,
            timestamp: "2025-03-18T14:30:00Z",
            likes: 875,
            comments: 12,
        },
        {
            id: "5",
            title: "Discovering the Sea",
            description: "A journey through the vast oceans of the world.",
            src: "https://www.w3schools.com/tags/mov_bbb.mp4",
            avatar: "https://github.com/shadcn.png/",
            author: "JaneDoe",
            username: "janedoe",
            category: "travel",
            tags: ["adventure", "water", "scuba diving"],
            view: 1234,
            timestamp: "2025-02-28T12:00:00Z",
            likes: 750,
            comments: 15,
        },
        {
            id: "6",
            title: "Exploring the Mountains",
            description: "A journey through the majestic landscapes of the Alps.",
            src: "https://www.w3schools.com/tags/mov_bbb.mp4",
            avatar: "https://github.com/shadcn.png/",
            author: "JohnDoe",
            username: "john123",
            category: "education",
            tags: ["adventure", "nature", "hiking"],
            view: 1523,
            timestamp: "2025-03-18T14:30:00Z",
            likes: 875,
            comments: 12,
        },
    ]

    return <ScrollArea className="">
        <div className="space-y-3 lg:max-h-[calc(100vh-10rem)]">
            {items.map((item, index) => (
                <DiscoverCard key={index} {...item} />
            ))}
        </div>
    </ScrollArea>
}