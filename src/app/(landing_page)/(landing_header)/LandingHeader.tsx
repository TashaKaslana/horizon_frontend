import React from "react";
import {Button} from "@/components/ui/button";
import Link from "next/link";
import NavigationContainer from "@/app/(landing_page)/(landing_header)/NavigationContainer";

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
        <h1 className={""}>Horizon</h1>
    )
}

const AuthenticatedSection = () => {
    return (
        <div className={'flex gap-4'}>
            <Button className={"w-64"}>
                <Link href={"/login"}>
                    Login
                </Link>
            </Button>
            <Button>
                <Link href={"/register"}>
                    Register
                </Link>
            </Button>
        </div>
    )
}
export default LandingHeader