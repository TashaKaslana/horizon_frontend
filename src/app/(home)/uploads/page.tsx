import UploadContainer from "@/app/(home)/uploads/UploadContainer";
import type {Metadata} from "next";

export const metadata: Metadata = {
    title: "Horizon",
    icons: "/images/share/Logo.tsx",
};

const Page = () => {

  return <UploadContainer/>
}

export default Page