import DatabaseSchema from "@/app/admin/system/database-schema/components/db-schema-container";
import {SiteHeader} from "@/app/admin/components/site-header";

const Page = () => {
    return (
        <div className={'h-screen w-full'}>
            <SiteHeader text={'Database Schema'}/>
            <DatabaseSchema/>
        </div>
    )
}

export default Page;