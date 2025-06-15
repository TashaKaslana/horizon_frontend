import {useChannel} from "ably/react";
import usePermissionsStore from "@/app/admin/users/permissions/stores/usePermissionsStore";
import {useCurrentUser} from "@/stores/useCurrentUser";

export const usePermissionRealtime = () => {
    const {actions} = usePermissionsStore();
    const {user} = useCurrentUser()

    useChannel("permissions", (message) => {
        const {name, data, clientId} = message;

        if (clientId === user?.id) return;

        switch (name) {
            case "permission.created":
                actions.addPermission(data.permission);
                break;
            case "permission.updated":
                actions.updatePermission(data.permission);
                break;
            case "permission.deleted":
                actions.removePermission(data.permissionId);
                break;
            case "permission.bulk.deleted":
                actions.bulkRemovePermissions(data.permissionIds);
                break;
            default:
                console.warn(`[Ably] Unknown event "${name}" on permissions channel`);
        }
})
}