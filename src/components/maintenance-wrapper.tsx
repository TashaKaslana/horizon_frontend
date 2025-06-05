"use client";

import { useMaintenanceStore } from "@/stores/useMaintenanceStore";
import { MaintenanceStatusDisplay } from "@/app/components/maintenance-status-display";
import { ReactNode, useEffect, useState } from "react";
import { usePathname } from "next/navigation";

interface MaintenanceWrapperProps {
  children: ReactNode;
  bypassMaintenance?: boolean;
}

export const MaintenanceWrapper = ({ children, bypassMaintenance = false }: MaintenanceWrapperProps) => {
  const isMaintenanceMode = useMaintenanceStore((state) => state.isMaintenanceMode);
  const pathname = usePathname();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return <>{children}</>;
  }

  const isAdminRoute = pathname?.includes('/admin');

  if (isMaintenanceMode && !isAdminRoute && !bypassMaintenance) {
    return <MaintenanceStatusDisplay />;
  }

  return <>{children}</>;
};
