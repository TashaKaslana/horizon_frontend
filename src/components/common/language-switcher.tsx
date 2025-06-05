'use client';

import {useEffect, useState} from 'react';
import {Button} from '@/components/ui/button';
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from '@/components/ui/dropdown-menu';
import {useRouter} from 'next/navigation';

const supportedLocales = ['en', 'vn'];
const defaultLocale = 'en';

export function LanguageSwitcher() {
    const [currentLocale, setCurrentLocale] = useState<string>('en');
    const router = useRouter();

    useEffect(() => {
        const match = document.cookie.match(/(^|;\s*)locale=([a-zA-Z-]+)/);
        const cookieLocale = match?.[2];

        // Fallback: detect from browser
        const fallback = navigator.language?.split('-')[0];

        const resolved =
            supportedLocales.includes(cookieLocale || '') ? cookieLocale :
                supportedLocales.includes(fallback || '') ? fallback :
                    defaultLocale;

        setCurrentLocale(resolved ?? defaultLocale);
        console.log(`Current locale set to: ${resolved}`);
    }, []);

    const handleLocaleChange = (locale: string) => {
        document.cookie = `locale=${locale}; path=/; max-age=31536000`;
        setCurrentLocale(locale)// 1 year
        router.refresh();
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline">
                    Language: {currentLocale.toUpperCase()}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                {supportedLocales.map((locale) => (
                    <DropdownMenuItem
                        key={locale}
                        onClick={() => handleLocaleChange(locale)}
                        className={currentLocale === locale ? 'font-semibold' : ''}
                    >
                        {locale.toUpperCase()}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
