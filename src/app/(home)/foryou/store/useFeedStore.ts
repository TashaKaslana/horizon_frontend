import { create } from 'zustand';
import { Feed } from '@/types/Feed';

interface FeedStore {
    feeds: Feed[];
    setFeeds: (feeds: Feed[]) => void;
    addFeed: (feed: Feed) => void;
    updateFeed: (id: string, updater: (prev: Feed) => Feed) => void;
    removeFeed: (id: string) => void;
    clearFeeds: () => void;
}

export const useFeedStore = create<FeedStore>((set) => ({
    feeds: [],
    setFeeds: (feeds) => set({ feeds }),
    addFeed: (feed) => set((state) => ({ feeds: [feed, ...state.feeds] })),
    updateFeed: (id, updater) =>
        set((state) => ({
            feeds: state.feeds.map((f) =>
                f.post.id === id ? updater(f) : f
            ),
        })),
    removeFeed: (id) =>
        set((state) => ({
            feeds: state.feeds.filter((f) => f.post.id !== id),
        })),
    clearFeeds: () => set({ feeds: [] }),
}));
