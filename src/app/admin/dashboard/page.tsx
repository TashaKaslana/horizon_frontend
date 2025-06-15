import DashboardContainer from './dashboard-container';
import type {Metadata} from "next";

export const metadata: Metadata = {
    title: "Horizon",
    icons: "/images/share/Logo.tsx",
};

const Page = () => {
  return (
      <DashboardContainer/>
  )
}

export default Page;