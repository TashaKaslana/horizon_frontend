'use client';

import useMaintenanceHook from "@/app/admin/system/maintenance/hook/useMaintenanceHook";
import React from "react";

export const ClientInitProvider = ({ children }: { children: React.ReactNode }) => {
    useMaintenanceHook();

    return (
        <>
            {children}
        </>
    );
}