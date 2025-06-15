import LandingPage from "./LandingContainer";
import type {Metadata} from "next";

export const metadata: Metadata = {
    title: "Horizon",
    icons: "/images/share/Logo.tsx",
};

export default function Home() {
    return (
        <LandingPage/>
    );
}
