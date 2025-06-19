'use client';

import {ReactNode, useEffect} from "react";
import {
    getCurrentLanguage,
    setupAxiosAuthInterceptor,
    setupClientInterceptorsResponse,
} from "@/lib/setupClient";
import {useInterceptorStore} from "@/stores/useInterceptorStore";
import {Spinner} from "@/components/ui/spinner";
import moment from "moment";

const ClientSetupProvider = ({children} : {children: ReactNode}) => {
    const initialized = useInterceptorStore((s) => s.initialized);

    useEffect(() => {
        (async () => {
            await setupAxiosAuthInterceptor();
            setupClientInterceptorsResponse();
            moment.locale(await getCurrentLanguage())
        })();
    }, []);

    if (!initialized) return <div className={'w-full h-screen flex flex-col items-center justify-center gap-4'}>
        <Spinner className={'size-12'}/>
        <p>Loading...</p>
    </div>;

    return <>{children}</>;
}

export default ClientSetupProvider