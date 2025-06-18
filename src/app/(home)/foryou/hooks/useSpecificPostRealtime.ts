import { useCurrentUser } from "@/stores/useCurrentUser";
import {useFeedStore} from "@/app/(home)/foryou/store/useFeedStore";
import { useChannel } from "ably/react";

export const useSpecificPostRealtime = (postId: string) => {
    const {user} = useCurrentUser();
    const {updateFeed} = useFeedStore();

    useChannel(`posts.${postId}`, (message) => {
        const {name, clientId} = message;
        if (clientId === user?.id) return;

        switch (name) {
            case "post.interaction.created":
                updateFeed(postId, (prev) => ({
                    ...prev,
                    statistic: {
                        ...prev.statistic,
                        totalLikes: prev.statistic.totalLikes + 1,
                    },
                }));
                break;
            case "post.interaction.deleted":
                updateFeed(postId, (prev) => ({
                    ...prev,
                    statistic: {
                        ...prev.statistic,
                        totalLikes: Math.max(0, prev.statistic.totalLikes - 1),
                    },
                }));
                break;
            default:
                console.warn(`[Ably] Unknown event "${name}" on posts.${postId} channel`);
        }
    });
}