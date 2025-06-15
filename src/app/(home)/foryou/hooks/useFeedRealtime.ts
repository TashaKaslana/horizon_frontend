import {useChannel} from "ably/react";
import {useFeedStore} from "../store/useFeedStore";
import {useCurrentUser} from "@/stores/useCurrentUser";
import {Feed} from "@/types/Feed";

export const useFeedRealtime = () => {
    const {user} = useCurrentUser();
    const {addFeed, addFeeds, updateFeed, removeFeed, removeFeeds} = useFeedStore();

    useChannel("posts", (message) => {
        const {name, data, clientId} = message;
        if (clientId === user?.id) return;

        switch (name) {
            case "post.created":
                addFeed(data as Feed);
                break;
            case "post.updated":
                updateFeed((data as Feed).post.id, () => data as Feed);
                break;
            case "post.deleted":
                removeFeed(data.postId as string);
                break;
            case "posts.bulk-created":
                addFeeds(data.posts as Feed[]);
                break;
            case "posts.bulk-deleted":
                removeFeeds(data.postIds as string[]);
                break;
            default:
                console.warn(`[Ably] Unknown event "${name}" on posts channel`);
        }
    });
};
