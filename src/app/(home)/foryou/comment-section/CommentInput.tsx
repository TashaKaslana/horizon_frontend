import {Textarea} from "@/components/ui/textarea";
import {Button} from "@/components/ui/button";
import {Spinner} from "@/components/ui/spinner";
import {useCommentInput} from "../hooks/useCommentInput"; // adjust path if needed
import {UUID} from "node:crypto";

type CommentInputProps = {
    postId: string,
    parentCommentId?: UUID | null,
    updateCommentId?: UUID,
    updatedContent?: string,
    isUpdated?: boolean,
    isVisible: boolean
};

export const CommentInput = (props: CommentInputProps) => {
    const {
        textRef,
        isFocus,
        mutation,
        handleSubmit,
        handleCancel,
        handleSwitchFocus
    } = useCommentInput(props);

    return (
        <div className="space-y-2 mr-6">
            <Textarea
                onFocus={() => handleSwitchFocus(true)}
                onBlur={() => handleSwitchFocus(false)}
                className="max-h-24 min-h-4 placeholder:text-sky-600"
                placeholder="Enter your comment and press Ctrl + ↵ to comment"
                ref={props.isVisible ? textRef : null}
            />

            {isFocus && (
                <div className="flex justify-end gap-4">
                    <Button className="h-8" onClick={handleCancel}>Cancel</Button>
                    <Button
                        className="h-8 space-x-2"
                        onClick={handleSubmit}
                        disabled={mutation.isPending}
                    >
                        <Spinner show={mutation.isPending}/>
                        <span>{mutation.isPending ? 'Submitting' : 'Submit'}</span>
                    </Button>
                </div>
            )}
        </div>
    );
};
