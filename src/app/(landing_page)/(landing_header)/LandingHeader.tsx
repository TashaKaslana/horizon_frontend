import React from "react";
import {Button} from "@/components/ui/button";
import Link from "next/link";
import NavigationContainer from "@/app/(landing_page)/(landing_header)/NavigationContainer";

const LandingHeader = () => {
    return (
        <div className={'flex justify-between'}>
            <LogoContainer/>
            <NavigationContainer/>
            <AuthenticatedSection/>
        </div>
    )
}

const LogoContainer = () => {
    return (
        <h1>Horizon</h1>
    )
}

const AuthenticatedSection = () => {
    return (
        <div className={'flex gap-4'}>
            <Button>
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