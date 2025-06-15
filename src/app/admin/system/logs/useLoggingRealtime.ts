import useLoggingStore from "@/app/admin/system/logs/useLoggingStore";
import {useCurrentUser} from "@/stores/useCurrentUser";
import { useChannel } from "ably/react";

export const useLoggingRealtime = () => {
    const {actions} = useLoggingStore();
    const {user} = useCurrentUser();

    useChannel("admin.logs", (message) => {
        const {name, data, clientId} = message;

        if (clientId === user?.id) return;

        switch (name) {
            case "log.created":
                actions.addLogEntries(data.logEntry);
                break;

            default:
                console.warn(`[Ably] Unknown event "${name}" on logs channel`);
        }
    });
}