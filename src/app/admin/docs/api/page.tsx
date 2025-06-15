import {redirect} from "next/navigation";
import type {Metadata} from "next";

export const metadata: Metadata = {
    title: "Horizon",
    icons: "/images/share/Logo.tsx",
};



const Page = () => {
    redirect(`${process.env.NEXT_PUBLIC_API_URL}/swagger-ui/index.html`)
}

export default Page