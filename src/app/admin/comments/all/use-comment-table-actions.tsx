import { FloatingBarAction } from "@/components/common/floating-bar";
import { Download, Pencil, Trash } from "lucide-react";
import { exportToExcel } from "@/lib/utils";
import { CommentAdminData } from "@/app/admin/comments/all/comment-admin-table";
import { BulkCommentEditDialog } from "@/app/admin/comments/all/bulk-comment-edit-dialog";
import useCommentsManagement from "@/app/admin/comments/all/hooks/useCommentsManagement";
import { toast } from "sonner";
import {zBulkCommentUpdateRequest} from "@/api/client/zod.gen";

export const useCommentTableActions = (items: CommentAdminData[]): FloatingBarAction[] => {
    const { deleteMultipleComments, bulkUpdateComments } = useCommentsManagement();

    return [
        {
            label: "Edit",
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
                            toast.error("Failed to update comments");
                        } finally {
                            setIsLoading(false);
                            close();
                        }
                    }}
                />
            )
        },
        {
            label: "Export",
            onClick: () => exportToExcel(items, "comments.xlsx", "Comments"),
            variant: "outline",
            icon: <Download />
        },
        {
            label: "Delete",
            onClick: async () => {
                const commentIds = items.map(item => item.id);
                await deleteMultipleComments(commentIds);
            },
            variant: "destructive",
            icon: <Trash />,
        },
    ];
};
