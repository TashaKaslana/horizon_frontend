import ManagementContainer from "@/app/(home)/management/ManagementContainer";
import { Post } from "./types/types";

const Page = () => {
    const fakePosts: Post[] = [
        {
            id: "1",
            title: "Exploring the Mountains",
            description: "A journey through the majestic landscapes of the Alps.",
            src: "https://www.w3schools.com/tags/mov_bbb.mp4",
            author: "JohnDoe",
            category: "education",
            tags: ["adventure", "nature", "hiking"],
            view: 1523,
            timestamp: "2025-03-18T14:30:00Z",
            likes: 875,
            comments: 12,
        },
        {
            id: "2",
            title: "The Future of AI",
            description: "How artificial intelligence is shaping our world.",
            src: "https://www.w3schools.com/tags/mov_bbb.mp4",
            author: "JaneSmith",
            category: "tech",
            tags: ["AI", "future", "innovation"],
            view: 3245,
            timestamp: "2025-03-19T10:00:00Z",
            likes: 1502,
            comments: 34,
        },
        {
            id: "3",
            title: "Top 10 JavaScript Tricks",
            description: "Essential JavaScript tips every developer should know.",
            src: "https://www.w3schools.com/tags/mov_bbb.mp4",
            author: "DevMaster",
            category: "tech",
            tags: ["JavaScript", "tips", "coding"],
            view: 2107,
            timestamp: "2025-03-17T18:45:00Z",
            likes: 943,
            comments: 27,
        },
        {
            id: "4",
            title: "Healthy Eating Habits",
            description: "A guide to maintaining a balanced and nutritious diet.",
            src: "https://www.w3schools.com/tags/mov_bbb.mp4",
            author: "NutritionExpert",
            category: "education",
            tags: ["diet", "nutrition", "wellness"],
            view: 1876,
            timestamp: "2025-03-16T08:20:00Z",
            likes: 678,
            comments: 19,
        },
        {
            id: "5",
            title: "The Art of Photography",
            description: "Mastering the techniques of professional photography.",
            src: "https://www.w3schools.com/tags/mov_bbb.mp4",
            author: "PhotoGuru",
            category: "entertainment",
            tags: ["photography", "camera", "editing"],
            view: 2560,
            timestamp: "2025-03-15T21:10:00Z",
            likes: 1123,
            comments: 42,
        },
    ];


    return (
        <>
            <ManagementContainer posts={fakePosts}/>
        </>
    )
}

export default Page