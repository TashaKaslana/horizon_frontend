import {useChannel} from "ably/react";
import {useCurrentUser} from "@/stores/useCurrentUser";
import {useCommentStore} from "../store/useCommentStore";
import {CommentResponse} from "@/types/Comment";

export function useCommentRealtime(postId: string) {
    const {user} = useCurrentUser();
    const {addComment, updateComment, removeComment} = useCommentStore();

    useChannel(`comments.${postId}`, (msg) => {
        const {name, data, clientId} = msg;
        console.log(name, JSON.stringify(data));

        if (clientId === user?.id) return;

        switch (name) {
            case "comment.created":
                addComment(postId, data as CommentResponse);
                break;

            case "comment.updated":
                updateComment(postId, data.commentId, {
                    content: data.content,
                });
                break;

            case "comment.deleted":
                removeComment(postId, data.commentId);
                break;

            case "comment.pinned":
                updateComment(postId, data.commentId, {
                    isPinned: true,
                });
                break

            case "comment.unpinned":
                updateComment(postId, data.commentId, {
                    isPinned: false,
                });
                break;

            default:
                console.warn(`[Ably] Unknown event "${name}" received on comments.${postId}`);
        }
    });
}
