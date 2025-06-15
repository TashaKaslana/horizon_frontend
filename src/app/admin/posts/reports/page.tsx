import {PostReportContainer} from "@/app/admin/posts/reports/post-report-container";
import type {Metadata} from "next";

export const metadata: Metadata = {
    title: "Horizon",
    icons: "/images/share/Logo.tsx",
};

const Page = () => {
    return (
        <PostReportContainer/>
    );
}

export default Page;