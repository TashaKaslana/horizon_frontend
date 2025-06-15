import {useChannel} from "ably/react";
import usePostsStore from "../stores/usePostsStore";
import {useCurrentUser} from "@/stores/useCurrentUser";
import {PostAdminViewDto, PostResponse} from "@/api/client/types.gen";

export const usePostsRealtime = () => {
    const {user} = useCurrentUser();
    const {actions} = usePostsStore();

    useChannel("posts", (message) => {
        const {name, data, clientId} = message;
        if (clientId === user?.id) return;

        switch (name) {
            case "post.created":
                actions.addPost(data as PostAdminViewDto);
                break;
            case "post.updated":
                actions.updatePost(data as PostResponse);
                break;
            case "post.deleted":
                actions.removePost(data.postId as string);
                break;
            case "posts.bulk-deleted":
                actions.removePosts(data.postIds as string[]);
                break;
            case "posts.bulk-updated":
                actions.updatePosts(data.posts as PostResponse[]);
                break;
            default:
                console.warn(`[Ably] Unknown event "${name}" on posts channel`);
        }
    });
};
