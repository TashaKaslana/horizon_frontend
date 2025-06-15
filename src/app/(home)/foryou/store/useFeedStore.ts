import { create } from 'zustand';
import { Feed } from '@/types/Feed';

interface FeedStore {
    feeds: Feed[];
    setFeeds: (feeds: Feed[] | ((prev: Feed[]) => Feed[])) => void;
    addFeed: (feed: Feed) => void;
    addFeeds: (feeds: Feed[]) => void;
    updateFeed: (id: string, updater: (prev: Feed) => Feed) => void;
    updateFeeds: (updates: Feed[]) => void;
    removeFeed: (id: string) => void;
    removeFeeds: (ids: string[]) => void;
    clearFeeds: () => void;
}

export const useFeedStore = create<FeedStore>((set) => ({
    feeds: [],
    setFeeds: (feedsOrUpdater) => {
        set((state) => {
            const nextFeeds =
                typeof feedsOrUpdater === 'function'
                    ? feedsOrUpdater(state.feeds)
                    : feedsOrUpdater;

            const isSame =
                Array.isArray(nextFeeds) &&
                Array.isArray(state.feeds) &&
                state.feeds.length === nextFeeds.length &&
                state.feeds.every((feed, index) => {
                    const newFeed = nextFeeds[index];
                    return feed?.post?.id && newFeed?.post?.id && feed.post.id === newFeed.post.id;
                });

            if (isSame) {
                return {};
            }

            console.log("Updating feeds to: ", nextFeeds);
            return { feeds: nextFeeds };
        });
    },
    addFeed: (feed) => set((state) => ({ feeds: [feed, ...state.feeds] })),
    addFeeds: (newFeeds) => set((state) => ({ feeds: [...newFeeds, ...state.feeds] })),
    updateFeed: (id, updater) =>
        set((state) => ({
            feeds: state.feeds.map((f) =>
                f.post.id === id ? updater(f) : f
            ),
        })),
    updateFeeds: (updates) =>
        set((state) => ({
            feeds: state.feeds.map((f) => {
                const updated = updates.find((u) => u.post.id === f.post.id);
                return updated ? updated : f;
            }),
        })),
    removeFeed: (id) =>
        set((state) => ({
            feeds: state.feeds.filter((f) => f.post.id !== id),
        })),
    removeFeeds: (ids) =>
        set((state) => ({
            feeds: state.feeds.filter((f) => !ids.includes(f.post.id)),
        })),
    clearFeeds: () => set({ feeds: [] }),
}));
