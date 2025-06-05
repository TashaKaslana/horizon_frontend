import React from "react";
import NavigationContainer from "@/app/components/landing_page/header/NavigationContainer";
import LoginButton from "@/app/components/LoginButton";
import Logo from "../../../../../public/images/share/Logo";
import {LanguageSwitcher} from "@/components/common/language-switcher";

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
        <Logo className={'size-10'}/>
    )
}

const AuthenticatedSection = () => {
    return (
        <div className={'flex gap-2 items-center'}>
            <LanguageSwitcher/>
            <LoginButton/>
        </div>
    )
}
export default LandingHeader