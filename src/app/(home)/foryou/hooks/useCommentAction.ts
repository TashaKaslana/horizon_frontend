import {useMutation} from "@tanstack/react-query";
import {CommentResponse} from "@/types/Comment";
import {useCommentRefStore} from "@/app/(home)/foryou/store/useCommentRefStore";
import {toast} from "sonner";
import {deleteComment, likeComment, pinComment, reportComment, unpinComment} from "@/app/(home)/foryou/api/commentApi";
import {useCommentStore} from "@/app/(home)/foryou/store/useCommentStore";

type CommentAction = {
    comment: CommentResponse,
}

export function useCommentAction({comment}: CommentAction) {
    const {setStoredComment, setMode} = useCommentRefStore();
    const {updateComment, removeComment} = useCommentStore();

    //TODO: fix this
    const likeMutation = useMutation({
        mutationFn: () => likeComment(comment.id),
        onSuccess: () => {
            updateComment(comment.id, {
                // isLiked: true
            });
        },
        onError: () => {
            toast.error("Failed to like comment.");
        }
    });

    const deleteMutation = useMutation({
        mutationFn: () => deleteComment(comment.id),
        onSuccess: () => {
            removeComment(comment.id);
            toast.success("Comment deleted");
        },
        onError: () => {
            toast.error("Failed to delete comment.");
        }
    });

    const pinMutation = useMutation({
        mutationFn: () => pinComment(comment.id),
        onSuccess: () => {
            updateComment(comment.id, { isPinned: true });
            toast.success("Pinned comment");
        },
        onError: () => {
            toast.error("Failed to pin comment.");
        }
    });

    const unpinMutation = useMutation({
        mutationFn: () => unpinComment(comment.id),
        onSuccess: () => {
            updateComment(comment.id, { isPinned: false });
            toast.success("Unpinned comment");
        },
        onError: () => {
            toast.error("Failed to unpin comment.");
        }
    });

    const reportMutation = useMutation({
        mutationFn: (reason: string) => reportComment(comment.id, reason),
        onSuccess: () => {
            toast.success("Reported comment");
        },
        onError: () => {
            toast.error("Failed to report comment.");
        }
    });

    const handleLike = () => likeMutation.mutate();
    const handleReply = () => {
        setStoredComment(comment);
        setMode("reply");
    };
    const handleEdit = () => {
        setStoredComment(comment);
        setMode("update");
    };
    const handleDelete = () => deleteMutation.mutate();
    const handleCopy = () => {
        navigator.clipboard.writeText(comment.content).then(() => {
            toast.success("Copied to clipboard!");
        });
    };
    const handlePinComment = () => pinMutation.mutate();
    const handleUnPinComment = () => unpinMutation.mutate();
    const handleReportComment = (reason: string) => reportMutation.mutate(reason);

    return {
        handleLike,
        handleReply,
        handleEdit,
        handleDelete,
        handleCopy,
        handlePinComment,
        handleUnPinComment,
        handleReportComment,
    };
}
