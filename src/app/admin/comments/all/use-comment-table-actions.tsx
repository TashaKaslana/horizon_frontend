import { FloatingBarAction } from "@/components/common/floating-bar";
import { Download, Pencil, Trash } from "lucide-react";
import { exportToExcel } from "@/lib/utils";
import { CommentAdminData } from "@/app/admin/comments/all/comment-admin-table";
import { BulkCommentEditDialog } from "@/app/admin/comments/all/bulk-comment-edit-dialog";
import useCommentsManagement from "@/app/admin/comments/all/hooks/useCommentsManagement";
import { toast } from "sonner";
import { zBulkCommentUpdateRequest } from "@/api/client/zod.gen";
import { useTranslations } from "next-intl";

export const useCommentTableActions = (items: CommentAdminData[]): FloatingBarAction[] => {
    const { deleteMultipleComments, bulkUpdateComments } = useCommentsManagement();
    const t = useTranslations("Admin.comments.all.table");
    const commentIds = items.map(item => item.id);

    return [
        {
            label: t("editComment"),
            variant: "default",
            icon: <Pencil />,
            renderDialog: (close, setIsLoading) => (
                <BulkCommentEditDialog
                    open={true}
                    onCloseAction={close}
                    onSubmitAction={async (values) => {
                        const commentIds = items.map(item => item.id);
                        const updateRequest = zBulkCommentUpdateRequest.parse({
                            ids: commentIds,
                            ...values
                        });

                        setIsLoading(true);
                        try {
                            await bulkUpdateComments(updateRequest);
                        } catch (error) {
                            console.error("Failed to update comments:", error);
                            toast.error(t("editingComment.error"));
                        } finally {
                            setIsLoading(false);
                            close();
                        }
                    }}
                />
            )
        },
        {
            label: t("export"),
            onClick: () => exportToExcel(items, "comments.xlsx", t("commentsExportFileName")),
            variant: "outline",
            icon: <Download />
        },
        {
            label: t("delete"),
            onClick: () => deleteMultipleComments(commentIds),
            variant: "destructive",
            icon: <Trash />,
        },
    ];
};
