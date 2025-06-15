import {FloatingBarAction} from "@/components/common/floating-bar";
import {Download, Pencil, Trash} from "lucide-react";
import {PostAdminViewDto} from "@/api/client";
import {exportToExcel} from "@/lib/utils";
import {BulkPostEditDialog} from "@/app/admin/posts/all/bulk-post-edit-dialog";
import {usePostsSync} from "@/app/admin/posts/all/hooks/usePostsSync";
import {zBulkPostUpdateRequest} from "@/api/client/zod.gen";
import {useTranslations} from "next-intl";

export const usePostTableActions = (items: PostAdminViewDto[]): FloatingBarAction[] => {
    const {bulkDeletePosts, bulkUpdatePosts} = usePostsSync();
    const t = useTranslations("Admin.posts.all.table");
    const postIds = items.map(item => item.id!);

    return [
        {
            label: t("edit"),
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
            label: t("export"),
            onClick: () => exportToExcel(items, "posts.xlsx", t("postsExportFileName")),
            variant: "outline",
            icon: <Download/>
        },
        {
            label: t("deletePost"),
            onClick: () => bulkDeletePosts(postIds),
            variant: "destructive",
            icon: <Trash/>,
        }
    ];
};
