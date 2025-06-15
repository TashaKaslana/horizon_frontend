import UserAdminContainer from "@/app/admin/users/all/user-admin-container";
import type {Metadata} from "next";

export const metadata: Metadata = {
    title: "Horizon",
    icons: "/images/share/Logo.tsx",
};

const Page = () => {
    return (
        <UserAdminContainer/>
    )
}

export default Page;