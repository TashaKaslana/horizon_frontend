import { FloatingBarAction } from "@/components/common/floating-bar";
import { Download, Pencil, Trash } from "lucide-react";
import { exportToExcel } from "@/lib/utils";
import {CommentAdminData} from "@/app/admin/comments/all/comment-admin-table";
import {BulkCommentEditDialog} from "@/app/admin/comments/all/bulk-comment-edit-dialog";

export const commentTableActions = (items: CommentAdminData[]): FloatingBarAction[] => {
    return [
        {
            label: "Edit",
            onClick: () => console.log("Edit comment action clicked", items),
            variant: "default",
            icon: <Pencil />,
            renderDialog: close => (
                <BulkCommentEditDialog
                    open={true}
                    onClose={close}
                    onConfirm={(data) => {
                        console.log("Comments updated successfully", JSON.stringify(data));
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
                return new Promise<void>((resolve) =>
                    setTimeout(() => {
                        console.log("Delete comment action clicked");
                        resolve();
                    }, 2000)
                );
            },
            variant: "destructive",
            icon: <Trash />
        },
    ];
};

