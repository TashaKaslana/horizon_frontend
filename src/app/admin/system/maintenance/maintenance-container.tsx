'use client'
import {SiteHeader} from "@/app/admin/components/site-header";
import {MaintenanceSettings} from "@/app/admin/system/maintenance/components/maintenance-settings";

export function MaintenanceContainer() {
    return <div className={"h-screen"}>
        <SiteHeader text={"Maintenance Settings"}/>
        <div className={"flex items-center justify-center w-full"}>
            <MaintenanceSettings/>
        </div>
    </div>;
}