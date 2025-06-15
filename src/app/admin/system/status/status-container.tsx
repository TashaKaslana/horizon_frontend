'use client';

import {SiteHeader} from "@/app/admin/components/site-header";
import { StatusContainer } from "./components/status-container";

export function AdminStatusContainer() {
    return <div className={"h-screen"}>
        <SiteHeader text={"System Status"}/>
        <StatusContainer/>
    </div>;
}