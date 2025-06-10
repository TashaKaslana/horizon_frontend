import { FloatingBarAction } from "@/components/common/floating-bar";
import { Download, Pencil, Trash } from "lucide-react";
import { PostAdminViewDto } from "@/api/client";
import { exportToExcel } from "@/lib/utils";
import {BulkPostEditDialog} from "@/app/admin/posts/all/bulk-post-edit-dialog";

export const postTableActions = (items: PostAdminViewDto[]): FloatingBarAction[] => {
    return [
        {
            label: "Edit",
            onClick: () => console.log("Edit post action clicked", items),
            variant: "default",
            icon: <Pencil />,
            renderDialog: close => (
                <BulkPostEditDialog
                    open={true}
                    onClose={close}
                    onConfirm={(values) =>
                        console.log("Posts updated successfully", JSON.stringify(values))
                    }
                />
            )
        },
        {
            label: "Export",
            onClick: () => exportToExcel(items, "posts.xlsx", "Posts"),
            variant: "outline",
            icon: <Download />
        },
        {
            label: "Delete",
            onClick: async () => {
                return new Promise<void>((resolve) =>
                    setTimeout(() => {
                        console.log("Delete post action clicked");
                        resolve();
                    }, 2000)
                );
            },
            variant: "destructive",
            icon: <Trash />
        },
    ];
};
