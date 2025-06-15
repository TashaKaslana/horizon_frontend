import { useCurrentUser } from "@/stores/useCurrentUser";
import useCommentsStore from "@/app/admin/comments/all/stores/useCommentsStore";
import { useChannel } from "ably/react";

export const useCommentRealtime = () => {
    const {user} = useCurrentUser();
    const {actions} = useCommentsStore();

    useChannel("comments", (message) => {
        const {name, data, clientId} = message;

        if (clientId === user?.id) return;

        switch (name) {
            case "comments.bulk-updated":
                actions.bulkUpdateComments(data.commentIds, data.status);
                break;
            case "comments.bulk-deleted":
                actions.bulkDeleteComments(data.commentIds);
                break;
            default:
                console.warn(`[Ably] Unknown event "${name}" on comments channel`);
        }
    });
}