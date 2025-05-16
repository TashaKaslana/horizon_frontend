import { useCallback, useMemo, useState } from "react";
import { useUserPostStore } from "../store/useUserPostStore";

type SortOption = "newest" | "oldest" | "popular";

export const useUserPost = () => {
  const {
    feeds,
    setFeeds,
    addFeed,
    updateFeed,
    removeFeed,
    clearFeeds
  } = useUserPostStore();

  const [sortOption, setSortOption] = useState<SortOption>("newest");

  const sortedFeeds = useMemo(() => {
    if (!feeds.length) return [];

    const feedsCopy = [...feeds];

    switch (sortOption) {
      case "newest":
        return feedsCopy.sort((a, b) =>
          new Date(b.post.createdAt).getTime() - new Date(a.post.createdAt).getTime()
        );
      case "oldest":
        return feedsCopy.sort((a, b) =>
          new Date(a.post.createdAt).getTime() - new Date(b.post.createdAt).getTime()
        );
      case "popular":
        return feedsCopy.sort((a, b) =>
          (b.statistic.totalViews || 0) - (a.statistic.totalViews || 0)
        );
      default:
        return feedsCopy;
    }
  }, [feeds, sortOption]);

  const handleSort = useCallback((option: SortOption) => {
    setSortOption(option);
  }, []);

  return {
    feeds: sortedFeeds,
    originalFeeds: feeds,
    sortOption,
    handleSort,
    setFeeds,
    addFeed,
    updateFeed,
    removeFeed,
    clearFeeds
  };
};