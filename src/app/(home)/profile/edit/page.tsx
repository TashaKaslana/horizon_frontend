import ProfileEditForm from "@/app/(home)/profile/edit/ProfileEditForm";
import type {Metadata} from "next";

export const metadata: Metadata = {
    title: "Horizon",
    icons: "/images/share/Logo.tsx",
};

const Page = () => {
    return (
      <>
          <ProfileEditForm/>
      </>
  )
}

export default Page;