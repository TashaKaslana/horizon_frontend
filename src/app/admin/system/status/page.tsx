"use client"

import { StatusContainer } from "./components/status-container"
import {SiteHeader} from "@/app/admin/components/site-header";
import type {Metadata} from "next";

export const metadata: Metadata = {
    title: "Horizon",
    icons: "/images/share/Logo.tsx",
};

export default function StatusPage() {
    return (
        <div className={'h-screen'}>
            <SiteHeader text={'System Status'}/>
            <StatusContainer/>
        </div>
    )
}
