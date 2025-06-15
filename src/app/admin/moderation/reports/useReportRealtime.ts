import {useReportStore} from "@/app/admin/moderation/reports/useReportStore";
import {useCurrentUser} from "@/stores/useCurrentUser";
import {useChannel} from "ably/react";

export const useReportRealtime = () => {
    const {user} = useCurrentUser();
    const {actions} = useReportStore();

    useChannel("reports", (message) => {
        const {name, data, clientId} = message;

        if (clientId === user?.id) return;

        switch (name) {
            case "report.created":
                // actions.addReport({...data, createdAt: new Date(), updatedAt: new Date()});
                console.warn("[Ably] report.created event is not implemented in the UI yet.");
                break;
            case "report.updated":
                actions.updateReport(data.report);
                break;
            case "report.deleted":
                actions.removeReport(data.reportId);
                break;
            case "reports.bulk.deleted":
                actions.bulkDeleteReports(data.reportIds);
                break;
            case "reports.bulk.updated":
                actions.bulkUpdateReports(data.reportIds, {status: data.status, moderatorNotes: data.moderatorNotes});
                break;
            default:
                console.warn(`[Ably] Unknown event "${name}" on reports channel`);
        }
    });
}