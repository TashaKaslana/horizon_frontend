import React from "react";
import {Button} from "@/components/ui/button";
import Link from "next/link";
import NavigationContainer from "@/app/components/landing_page/landing_header/NavigationContainer";
import LoginButton from "@/app/components/LoginButton";

const LandingHeader = () => {
    return (
        <header className={'flex justify-between relative'}>
            <LogoContainer/>
            <NavigationContainer/>
            <AuthenticatedSection/>
        </header>
    )
}

const LogoContainer = () => {
    return (
        <h1>Horizon</h1>
    )
}

const AuthenticatedSection = () => {
    return (
        <LoginButton/>
    )
}
export default LandingHeader