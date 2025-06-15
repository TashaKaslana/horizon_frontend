import {PermissionsContainer} from "@/app/admin/users/permissions/permissions-container";
import type {Metadata} from "next";

export const metadata: Metadata = {
    title: "Horizon",
    icons: "/images/share/Logo.tsx",
};

const Page = () => {
  return (
      <PermissionsContainer/>
  )
}

export default Page;