import {CommentReportContainer} from "@/app/admin/comments/reports/comment-report-container";
import type {Metadata} from "next";

export const metadata: Metadata = {
    title: "Horizon",
    icons: "/images/share/Logo.tsx",
};

const Page = () => {
    return (
        <CommentReportContainer/>
    );
}

export default Page;