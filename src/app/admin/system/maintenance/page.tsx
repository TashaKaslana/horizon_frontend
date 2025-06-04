"use client";

import {MaintenanceSettings} from "./components/maintenance-settings";
import {SiteHeader} from "@/app/admin/components/site-header";

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
