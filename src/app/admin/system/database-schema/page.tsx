import DatabaseSchema from "@/app/admin/system/database-schema/components/db-schema-container";
import {SiteHeader} from "@/app/admin/components/site-header";
import type {Metadata} from "next";

export const metadata: Metadata = {
    title: "Horizon",
    icons: "/images/share/Logo.tsx",
};

const Page = () => {
    return (
        <div className={'h-screen w-full'}>
            <SiteHeader text={'Database Schema'}/>
            <DatabaseSchema/>
        </div>
    )
}

export default Page;