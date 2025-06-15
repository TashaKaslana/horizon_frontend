import {useChannel} from "ably/react";
import useTagStore from "@/app/admin/posts/tags/store/useTagStore";
import {useCurrentUser} from "@/stores/useCurrentUser";

export const useTagRealtime = () => {
    const {actions} = useTagStore()
    const {user} = useCurrentUser();

    useChannel("post-tags", (message) => {
        const {name, data, clientId} = message;

        if (clientId === user?.id) return; // Ignore messages from the admin client

        switch (name) {
            case "post.tag.created":
                actions.addTag(data.postTag);
                break;
            case "post.tag.deleted":
                actions.removeTag(data.postTagId);
                break;
        }
    })
}