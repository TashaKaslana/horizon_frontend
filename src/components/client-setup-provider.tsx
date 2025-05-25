'use client';

import {ReactNode} from "react";
import {
    setupClientInterceptorsResponse,
    useSetupClientInterceptorsRequest
} from "@/lib/setupClient";

const ClientSetupProvider = ({children} : {children: ReactNode}) => {
    useSetupClientInterceptorsRequest()
    setupClientInterceptorsResponse()

    return (
        <>
            {children}
        </>
    );
}

export default ClientSetupProvider