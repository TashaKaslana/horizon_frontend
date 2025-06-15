import {CategoryContainer} from "@/app/admin/posts/categories/category-container";
import type {Metadata} from "next";

export const metadata: Metadata = {
    title: "Horizon",
    icons: "/images/share/Logo.tsx",
};

const Page = () => {
  return (
      <CategoryContainer/>
  )
}

export default Page;