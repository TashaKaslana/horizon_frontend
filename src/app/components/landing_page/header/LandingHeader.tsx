import React from "react";
import NavigationContainer from "@/app/components/landing_page/header/NavigationContainer";
import LoginButton from "@/app/components/LoginButton";
import Logo from "../../../../../public/images/share/Logo";
import {Separator} from "@/components/ui/separator";

const LandingHeader = () => {
    return (
        <header className={'flex justify-between relative'}>
            <LogoContainer/>
            <NavigationContainer/>
            <AuthenticatedSection/>
            <Separator/>
        </header>
    )
}

const LogoContainer = () => {
    return (
        <Logo className={'size-10'}/>
    )
}

const AuthenticatedSection = () => {
    return (
        <LoginButton/>
    )
}
export default LandingHeader