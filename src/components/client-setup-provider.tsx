'use client';

import {ReactNode, useEffect} from "react";
import {
    setupAxiosAuthInterceptor,
    setupClientInterceptorsResponse,
} from "@/lib/setupClient";
import {useInterceptorStore} from "@/stores/useInterceptorStore";
import {Spinner} from "@/components/ui/spinner";

const ClientSetupProvider = ({children} : {children: ReactNode}) => {
    const initialized = useInterceptorStore((s) => s.initialized);

    useEffect(() => {
        (async () => {
            await setupAxiosAuthInterceptor();
            setupClientInterceptorsResponse();
        })();
    }, []);

    if (!initialized) return <div className={'w-full h-screen flex flex-col items-center justify-center gap-4'}>
        <Spinner className={'size-12'}/>
        <p>Loading...</p>
    </div>;

    return <>{children}</>;
}

export default ClientSetupProvider