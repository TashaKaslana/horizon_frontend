import {MaintenanceContainer} from "@/app/admin/system/maintenance/maintenance-container";

export const metadata = {
    title: 'Maintenance Settings',
    description: 'Manage the maintenance mode of the system.',
    icons: "/images/share/Logo.tsx"
}

export default function MaintenancePage() {
    return (
        <MaintenanceContainer/>
    )
}
