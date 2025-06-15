import type {Metadata} from "next";
import {AdminStatusContainer} from "@/app/admin/system/status/status-container";

export const metadata: Metadata = {
    title: "Horizon",
    icons: "/images/share/Logo.tsx",
};

export default function StatusPage() {
    return (
        <AdminStatusContainer/>
    )
}
