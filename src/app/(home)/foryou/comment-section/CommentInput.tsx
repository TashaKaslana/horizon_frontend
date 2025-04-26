import {useCallback, useEffect, useRef, useState} from "react";
import {Textarea} from "@/components/ui/textarea";
import {Button} from "@/components/ui/button";
import {toast} from "sonner";
import {useMutation} from "@tanstack/react-query";
import {createComment, updateComment} from "@/app/(home)/foryou/actions/actions";
import {UUID} from "node:crypto";
import {Spinner} from "@/components/ui/spinner";

type CommentInputProps = {
    postId: UUID
    parentCommentId?: UUID | null;

    updateCommentId?: UUID;
    updatedContent?: string;
    isUpdated?: boolean;
}

export const CommentInput = ({
                                 postId,
                                 parentCommentId,
                                 updateCommentId,
                                 updatedContent,
                                 isUpdated = false
                             }: CommentInputProps) => {
    const [isFocus, setIsFocus] = useState(false)
    const textRef = useRef<HTMLTextAreaElement>(null);
    const prevContent = useRef(updatedContent ?? '');

    const mutation = useMutation({
        mutationFn: (content: string) => {
            prevContent.current = content;

            if (isUpdated) {
                return updateComment({
                    id: updateCommentId, content
                })
            } else {
                return createComment({
                    postId, parentCommentId, content
                })
            }
        },
        onSuccess: () => {
            toast.success("Comment created successfully.");
            const element = textRef.current
            if (!element) return

            element.value = ''
            element.blur()
        },
        onError: () => {
            toast.error("Comment creation failed.");
        }
    })

    const handleSubmit = useCallback(() => {
        if (mutation.isPending) return

        const element = textRef.current
        if (!element) return

        const text = element.value.trim()
        if (!text) {
            toast.error("Please enter a comment.")
            return
        }

        mutation.mutate(text)
    }, [mutation])

    useEffect(() => {
        const element = textRef.current
        if (!element) return

        if (isUpdated && updatedContent) {
            element.value = updatedContent
        }

        const handleKeyDown = (e: KeyboardEvent) => {
            const element = textRef.current
            if (!element) return

            const value = element.value.trim();

            if (value.length > 0 && e.ctrlKey && e.key === 'Enter') {
                handleSubmit()
            }
        }

        element.addEventListener("keydown", handleKeyDown);

        return () => element.removeEventListener("keydown", handleKeyDown)
    }, [updatedContent, isUpdated, mutation, handleSubmit]);

    const handleCancel = () => {
        const element = textRef.current
        if (!element) return

        prevContent.current = element.value
        element.value = ''

        toast('Restore unsubmit comment?', {
            action: {
                label: 'Restore',
                onClick: () => element.value = prevContent.current
            },
            duration: 7000
        })
    }

    const handleSwitch = (value: boolean) => {
        setTimeout(() => {
            setIsFocus(value)
        }, 200)
    }

    return (
        <div className={'space-y-2 mr-6'}>
            <Textarea
                onFocus={() => handleSwitch(true)}
                onBlur={() => handleSwitch(false)}
                className={'max-h-24 min-h-4 placeholder:text-sky-600'}
                placeholder={'Enter your comment and press Ctrl + ↵ to comment'}
                ref={textRef}
            />

            {isFocus && (
                <div className={'flex justify-end gap-4'}>
                    <Button className={'h-8'} onClick={handleCancel}>Cancel</Button>
                    <Button className={'h-8 space-x-2'}
                            onClick={handleSubmit}
                            disabled={mutation.isPending}
                    >
                        <Spinner show={mutation.isPending}/>
                        <span>{mutation.isPending ? 'Submitting' : 'Submit'}</span>
                    </Button>
                </div>
            )}
        </div>
    )
}

