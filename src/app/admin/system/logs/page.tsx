import {LogsContainer} from "@/app/admin/system/logs/logs-container";
import type {Metadata} from "next";

export const metadata: Metadata = {
    title: "Horizon",
    icons: "/images/share/Logo.tsx",
};

export default function Page() {
    return (
        <LogsContainer/>
    )
}