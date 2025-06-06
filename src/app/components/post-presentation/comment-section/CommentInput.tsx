import {Textarea} from "@/components/ui/textarea";
import {Button} from "@/components/ui/button";
import {Spinner} from "@/components/ui/spinner";
import {useCommentInput} from "@/hooks/useCommentInput";
import {UUID} from "node:crypto";
import {useTranslations} from "next-intl";

type CommentInputProps = {
    postId: string,
    parentCommentId?: UUID | null,
    updateCommentId?: UUID,
    updatedContent?: string,
    isUpdated?: boolean,
    isVisible: boolean
};

export const CommentInput = (props: CommentInputProps) => {
    const t = useTranslations("Home.comments.input");
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
                placeholder={t("placeholder")}
                ref={props.isVisible ? textRef : null}
            />

            {isFocus && (
                <div className="flex justify-end gap-4">
                    <Button className="h-8" onClick={handleCancel}>{t("cancel")}</Button>
                    <Button
                        className="h-8 space-x-2"
                        onClick={handleSubmit}
                        disabled={mutation.isPending}
                    >
                        <Spinner show={mutation.isPending}/>
                        <span>{mutation.isPending ? t("submitting") : t("submit")}</span>
                    </Button>
                </div>
            )}
        </div>
    );
};
