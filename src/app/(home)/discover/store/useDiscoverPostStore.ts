import {Feed} from "@/types/Feed";
import {create} from 'zustand'
import {toast} from "sonner";

interface DiscoverState {
    feeds: Feed[];
    setFeeds: (feed: Feed[]) => void;
    addFeed: (feeds: Feed) => void;
    removeFeed: (id: string) => void;
    sortFeeds: (option: 'popular' | 'rating' | 'recent') => void
}

export const useDiscoverStore = create<DiscoverState>()((set) => ({
        feeds: [],
        setFeeds: (feed) => set({feeds: feed}),

        addFeed: (post) =>
            set((state) => ({
                feeds: [...state.feeds, post],
            })),
        removeFeed: (id) =>
            set((state) => ({
                feeds: state.feeds.filter(feed => feed.post.id !== id),
            })),
        sortFeeds: (option) => {
            set((state) => ({
                feeds: [...state.feeds].sort((a, b) => {
                        switch (option.toLowerCase()) {
                            case 'popular':
                                toast.error("This feature is not available yet")
                                // return b.view - a.view
                                return 0
                            case 'rating':
                                return b.statistic.totalLikes - a.statistic.totalLikes
                            case 'recent':
                                return new Date(b.post.createdAt).getTime() - new Date(a.post.createdAt).getTime()
                            default:
                                return new Date(b.post.createdAt).getTime() - new Date(a.post.createdAt).getTime()
                        }
                    }
                )
            }));
        }
    })
);