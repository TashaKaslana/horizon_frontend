import {getRequestConfig} from 'next-intl/server';
import {cookies, headers} from "next/headers";

export default getRequestConfig(async () => {
    const cookieLocale = (await cookies()).get('locale')?.value;
    const headerLocale = (await headers()).get('accept-language')?.split(',')[0]?.split('-')[0];

    // Fallback order
    const locale = cookieLocale || headerLocale || 'en';

    return {
        locale,
        messages: (await import(`@/messages/${locale}.json`)).default
    };
});