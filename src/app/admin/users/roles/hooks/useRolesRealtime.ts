import {useChannel} from "ably/react";
import {useCurrentUser} from "@/stores/useCurrentUser";
import useRolesStore from "../store/useRolesStore";

export const useRolesRealtime = () => {
    const {user} = useCurrentUser()
    const {actions} = useRolesStore();

  useChannel("roles", (message) => {
    const {name, data, clientId} = message;

    if (clientId === user?.id) return;

    switch (name) {
      case "role.created":
        actions.addRole(data.role);
        break;
      case "role.updated":
        actions.updateRole(data.role);
        break;
      case "role.deleted":
        actions.removeRole(data.roleId);
        break;
      case "roles.bulk-deleted":
        actions.removeBulkRole(data.roleIds);
        break;
      default:
        console.warn(`[Ably] Unknown event "${name}" on roles channel`);
    }
  })
}