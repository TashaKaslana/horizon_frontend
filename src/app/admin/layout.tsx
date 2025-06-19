import {AppSidebar} from "./components/appbar/app-sidebar"
import {SidebarProvider} from "@/components/ui/sidebar";
import { getAccessToken } from "@auth0/nextjs-auth0";
// import { redirect } from "next/navigation";
import { jwtDecode } from "jwt-decode"
import React from "react";

const AdminLayout = async ({children}: { children: React.ReactNode }) => {
    // if (!checkAdmin()) {
    //     redirect("/");
    // }

    return (
        <SidebarProvider className="flex h-screen">
            <AppSidebar className="border-r"/>
            <div className={'w-full'}>
                {children}
            </div>
        </SidebarProvider>
    )
}

export async function checkAdmin() {
    const accessToken = await getAccessToken();

    if (!accessToken) {
        throw new Error("Access token missing");
    }

    const decoded = jwtDecode<{ [key: string]: any }>(accessToken);
    const roles = decoded["https://phong-corp/roles"];
    
    const isAdmin = Array.isArray(roles) && roles.includes("ADMIN");

    return isAdmin;
}

export default AdminLayout