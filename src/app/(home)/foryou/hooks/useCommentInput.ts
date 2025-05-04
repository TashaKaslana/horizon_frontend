import {useCallback, useEffect, useRef, useState} from "react";
import {toast} from "sonner";
import {useMutation} from "@tanstack/react-query";
import {createComment, updateComment} from "@/api/commentApi";
import {useCommentRefStore} from "@/app/(home)/foryou/store/useCommentRefStore";

type UseCommentInputProps = {
    postId: string;
};

export function useCommentInput({
                                    postId,
                                }: UseCommentInputProps) {
    const [isFocus, setIsFocus] = useState(false);
    const textRef = useRef<HTMLTextAreaElement>(null);
    const { storedComment, mode } = useCommentRefStore();
    const prevContent = useRef('');
    
    const mutation = useMutation({
        mutationFn: (content: string) => {
            prevContent.current = content;

            if (mode === 'create')  {
                return createComment({ postId, parentCommentId: null, content });
            } else if (mode === 'update') {
                return updateComment({ id: storedComment?.id, content });
            } else {
                return createComment({ postId, parentCommentId: storedComment?.id, content });
            }
        },
        onSuccess: () => {
            toast.success(`Comment ${friendlyModeProcessedMessage(mode)} successfully!`);
            const element = textRef.current;
            if (element) {
                element.value = '';
                element.blur();
            }
        },
        onError: () => {
            toast.error(`Comment ${friendlyModeProcessedMessage(mode)} failed!`);
        }
    });

    const handleSubmit = useCallback(() => {
        if (mutation.isPending) return;

        const element = textRef.current;
        if (!element) return;

        const text = element.value.trim();
        if (!text) {
            toast.error("Please enter a comment.");
            return;
        }

        mutation.mutate(text);
    }, [mutation]);

    const handleCancel = () => {
        const element = textRef.current;
        if (!element) return;

        prevContent.current = element.value;
        element.value = '';

        toast('Restore unsubmitted comment?', {
            action: {
                label: 'Restore',
                onClick: () => {
                    if (textRef.current) {
                        textRef.current.value = prevContent.current;
                    }
                }
            },
            duration: 7000
        });
    };

    const handleSwitchFocus = (value: boolean) => {
        setTimeout(() => {
            setIsFocus(value);
        }, 200);
    };

    useEffect(() => {
        const element = textRef.current;
        if (!element || storedComment === null) return;

        if (mode === "update") {
            element.value = storedComment.content || '';
            if (document.activeElement !== element) {
                element.focus();
            }
        } else if (mode === "reply") {
            element.value = `@${storedComment.user.username} `;
            if (document.activeElement !== element) {
                element.focus();
            }
            // Scroll into view only if it's the first reply and not already scrolled
            if (!element.closest('.scrolled-to')) { // Check if it's already scrolled to
                element.scrollIntoView({ behavior: "smooth", block: "center" });
                element.classList.add('scrolled-to');
            }
        }
    }, [mode, storedComment]);


    useEffect(() => {
        const element = textRef.current;
        if (!element) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            const element = textRef.current;
            if (!element) return;

            const value = element.value.trim();
            if (value.length > 0 && e.ctrlKey && e.key === 'Enter') {
                handleSubmit();
            }
        };

        element.addEventListener("keydown", handleKeyDown);

        return () => {
            element.removeEventListener("keydown", handleKeyDown);
        };
    }, [handleSubmit]);

    return {
        textRef,
        isFocus,
        mutation,
        handleSubmit,
        handleCancel,
        handleSwitchFocus,
    };
}

const friendlyModeProcessedMessage = (mode: 'create' | 'update' | 'reply') => {
    switch (mode) {
        case 'create':
            return 'Created';
        case 'update':
            return 'Updated';
        case 'reply':
            return 'Replied';
        default:
            return 'Unknown';
    }
}
