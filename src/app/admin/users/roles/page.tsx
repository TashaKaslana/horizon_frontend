import {RolesContainer} from "@/app/admin/users/roles/roles-container";
import type {Metadata} from "next";

export const metadata: Metadata = {
    title: "Horizon",
    icons: "/images/share/Logo.tsx",
};

export default function Page() {
    return (
        <RolesContainer/>
    )
}