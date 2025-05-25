'use client';

import {ReactNode} from "react";
import {
    setupRequestInterceptor, setupResponseInterceptor,
} from "@/lib/setupClient";

const ClientSetupProvider = ({children} : {children: ReactNode}) => {
    setupRequestInterceptor()
    setupResponseInterceptor()

    return (
        <>
            {children}
        </>
    );
}

export default ClientSetupProvider