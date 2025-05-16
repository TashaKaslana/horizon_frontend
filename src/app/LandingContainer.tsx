'use client'
import { useUser } from "@auth0/nextjs-auth0";
import LandingFooter from "./components/landing_page/footer/landing-footer";
import LandingHeader from "./components/landing_page/header/LandingHeader";
import LandingMain from "./components/landing_page/main/LandingMain";
import { Suspense } from "react";
import { Spinner } from "@/components/ui/spinner";

export default function LandingPage() {
    return (
        <div className={'space-y-4 p-1'}>
            <Suspense fallback={
                <div className="size-full justify-center items-center">
                    <Spinner/>
                </div>
            }>
                <LandingHeader/>
                <LandingMain/>
                <LandingFooter/>
            </Suspense>
        </div>
    )
}