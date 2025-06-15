import { useCurrentUser } from "@/stores/useCurrentUser";
import useUsersStore from "@/app/admin/users/all/store/useUsersStore";
import {useChannel} from "ably/react";
import {toast} from "sonner";

export const useUsersRealtime = () => {
    const {user} = useCurrentUser();
    const {actions} = useUsersStore();

    useChannel("users", (message) => {
        const {name, data, clientId} = message;

        if (clientId === user?.id) return

        if (name === "user.created") {
            toast.warning("Notice that user updates are not yet implemented in the UI.");
            // actions.addUser(data);
        } else if (name === "user.updated") {
            toast.warning("Notice that user updates are not yet implemented in the UI.");
        } else if (name === "user.deleted") {
            actions.removeUser(data.userId);
        } else if (name === "users.bulk-updated") {
            // data.users.forEach((user: string) => {
            //     actions.updateUser(user);
            // });
            toast.warning("Notice that user bulk updates are not yet implemented in the UI.");
        }
        else if (name === "users.bulk-deleted") {
            data.userIds.forEach((userId: string) => {
                actions.removeUser(userId);
            });
        }
    })
}