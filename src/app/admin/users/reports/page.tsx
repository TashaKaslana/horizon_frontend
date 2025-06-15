import {UserReportContainer} from "@/app/admin/users/reports/user-report-container";
import type {Metadata} from "next";

export const metadata: Metadata = {
    title: "Horizon",
    icons: "/images/share/Logo.tsx",
};

const Page = () => {
    return (
        <UserReportContainer/>
    );
}

export default Page;