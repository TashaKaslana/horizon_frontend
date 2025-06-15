import ForyouContainer from "./ForyouContainer";
import type {Metadata} from "next";

export const metadata: Metadata = {
    title: "Horizon",
    icons: "/images/share/Logo.tsx",
};

const Page = async () => {

    return (
        <ForyouContainer/>
    )
}

export default Page;