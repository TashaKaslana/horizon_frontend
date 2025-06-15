import {TagsContainer} from "@/app/admin/posts/tags/tags-container";
import type {Metadata} from "next";

export const metadata: Metadata = {
    title: "Horizon",
    icons: "/images/share/Logo.tsx",
};

const Page = () => {
  return (
      <TagsContainer/>
  )
}

export default Page;