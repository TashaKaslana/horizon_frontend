"use client"

import {AppSidebar} from "./components/appbar/app-sidebar"
import {SidebarProvider} from "@/components/ui/sidebar";
import React from "react";

const AdminLayout = ({children}: { children: React.ReactNode }) => {
    return (
        <SidebarProvider className="flex h-screen">
            <AppSidebar className="border-r"/>
            <div className={'w-full'}>
                {children}
            </div>
        </SidebarProvider>
    )
}

export default AdminLayout