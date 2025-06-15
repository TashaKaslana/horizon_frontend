"use client";

import {MaintenanceSettings} from "./components/maintenance-settings";
import {SiteHeader} from "@/app/admin/components/site-header";
import type {Metadata} from "next";

export const metadata: Metadata = {
    title: "Horizon",
    icons: "/images/share/Logo.tsx",
};

export default function MaintenancePage() {
    return (
        <div className={'h-screen'}>
            <SiteHeader text={"Maintenance Settings"}/>
            <div className={'flex items-center justify-center w-full'}>
                <MaintenanceSettings/>
            </div>
        </div>
    )
}
