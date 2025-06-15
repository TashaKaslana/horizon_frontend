import {useEffect} from "react";
import {useFeed} from "./useFeed";
import {useFeedStore} from "../store/useFeedStore";

export const useFeedSync = (excludePostId?: string) => {
    const feed = useFeed(excludePostId);
    const {setFeeds, feeds: storeFeeds, addFeed, removeFeed, clearFeeds, updateFeed} = useFeedStore();

    useEffect(() => {
        setFeeds(feed.fetchedFeeds);
    }, [feed.fetchedFeeds, setFeeds]);

    return {
        ...feed,
        feeds: storeFeeds,
        addFeed,
        removeFeed,
        clearFeeds,
        updateFeed,
    };
};
