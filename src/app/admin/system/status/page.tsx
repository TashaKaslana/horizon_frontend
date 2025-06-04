"use client"

import { StatusContainer } from "./components/status-container"
import {SiteHeader} from "@/app/admin/components/site-header";

export default function StatusPage() {
    return (
        <div className={'h-screen'}>
            <SiteHeader text={'System Status'}/>
            <StatusContainer/>
        </div>
    )
}
