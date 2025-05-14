import LandingHeader from "@/app/components/landing_page/header/LandingHeader";
import LandingMain from "@/app/components/landing_page/main/LandingMain";
import LandingFooter from "@/app/components/landing_page/footer/landing-footer";

export default function Home() {
    return (
        <div className={'space-y-4 p-1'}>
            <LandingHeader/>
            <LandingMain/>
            <LandingFooter/>
        </div>
    );
}
