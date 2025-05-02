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
    setFeeds: (newFeeds) => {
        set((state) => {
            const isSame =
                Array.isArray(newFeeds) &&
                Array.isArray(state.feeds) &&
                state.feeds.length === newFeeds.length &&
                state.feeds.every((feed, index) => {
                    const newFeed = newFeeds[index];
                    return feed?.post?.id && newFeed?.post?.id && feed.post.id === newFeed.post.id;
                });

            if (isSame) {
                return {};
            }

            console.log("Updating feeds to: ", newFeeds);
            return { feeds: newFeeds };
        });
    },
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
