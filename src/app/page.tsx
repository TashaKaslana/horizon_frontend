import LandingHeader from "@/app/_landing_page/landing_header/LandingHeader";
import LandingMain from "@/app/_landing_page/landing_main/LandingMain";

export default function Home() {
    return (
        <div className={'space-y-4 p-1'}>
            <LandingHeader/>
            <LandingMain/>
        </div>
    );
}
