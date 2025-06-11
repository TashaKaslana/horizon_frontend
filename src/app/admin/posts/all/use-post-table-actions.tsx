import {FloatingBarAction} from "@/components/common/floating-bar";
import {Download, Pencil, Trash} from "lucide-react";
import {PostAdminViewDto} from "@/api/client";
import {exportToExcel} from "@/lib/utils";
import {BulkPostEditDialog} from "@/app/admin/posts/all/bulk-post-edit-dialog";
import {usePostsManagement} from "@/app/admin/posts/all/hooks/usePostsManagement";
import {zBulkPostUpdateRequest} from "@/api/client/zod.gen";

export const usePostTableActions = (items: PostAdminViewDto[]): FloatingBarAction[] => {
    const {bulkDeletePosts, bulkUpdatePosts} = usePostsManagement();

    return [
        {
            label: "Edit",
            onClick: () => console.log("Edit post action clicked", items),
            variant: "default",
            icon: <Pencil/>,
            renderDialog: (close, setIsLoading) => (
                <BulkPostEditDialog
                    open={true}
                    onClose={close}
                    onConfirm={async (values) => {
                        setIsLoading(true);

                        const postIds = items.map(item => item.id!);
                        const data = zBulkPostUpdateRequest.parse({
                            ids: postIds,
                            ...values,
                        })

                        await bulkUpdatePosts(data)
                        setIsLoading(false);
                        close();
                    }}
                />
            )
        },
        {
            label: "Export",
            onClick: () => exportToExcel(items, "posts.xlsx", "Posts"),
            variant: "outline",
            icon: <Download/>
        },
        {
            label: "Delete",
            onClick: async () => {
                const postIds = items.map(item => item.id!);
                await bulkDeletePosts(postIds);
            },
            variant: "destructive",
            icon: <Trash/>,
        },
    ];
};
