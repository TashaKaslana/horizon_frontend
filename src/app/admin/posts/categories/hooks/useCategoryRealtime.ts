import {useChannel} from "ably/react";
import useCategoryStore from "../store/useCategoryStore";
import {useCurrentUser} from "@/stores/useCurrentUser";

export const useCategoryRealtime = () => {
    const {actions} = useCategoryStore();
    const {user} = useCurrentUser();

    useChannel("categories", (message) => {
        const {name, data, clientId} = message;

        if (clientId === user?.id) return; // Ignore messages from the admin client

        switch (name) {
            case "post.category.created":
                actions.addCategory(data.postCategory)
                break;
            case "post.category.updated":
                actions.updateCategory({id: data.postCategoryId, name: data.categoryName, slug: data.slug});
                break;
            case "post.category.deleted":
                actions.removeCategory(data.postCategoryId);
                break;
            case "post.categories.bulk.deleted":
                actions.bulkRemoveCategories(data.postCategoryIds);
                break

            default:
                console.warn("Unknown message name:", name);
                break;
        }
    })
}