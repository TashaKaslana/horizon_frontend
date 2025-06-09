import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { useTheme } from "next-themes";
import { useConfigStore } from "@/stores/useConfigStore";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import {useCallback, useEffect, useState} from "react";

type PreferenceKey = "dark_mode" | "region" | "language";

const languageToLocale = {
    english: "en",
    vietnamese: "vn",
};

const localeToLanguage = {
    en: "english",
    vn: "vietnamese",
};

const supportedLocales = ['en', 'vn'];
const defaultLocale = 'en';

const AppPreferencesSetting = () => {
    const { appPreferences, changeAppPreferenceByKey } = useConfigStore();
    const { setTheme } = useTheme();
    const t = useTranslations('Home.user_dialog.settings_dialog.app_preferences');
    const router = useRouter();
    const [currentLanguage, setCurrentLanguage] = useState<string>("english");

    const getPreference = useCallback(<T extends boolean | string>(key: PreferenceKey, defaultValue: T): T => {
        return (appPreferences.find((item) => item.key === key)?.value as T) ?? defaultValue;
    }, [appPreferences]);

    useEffect(() => {
        const match = document.cookie.match(/(^|;\s*)locale=([a-zA-Z-]+)/);
        const cookieLocale = match?.[2];

        const fallback = navigator.language?.split('-')[0];

        const resolvedLocale =
            supportedLocales.includes(cookieLocale || '') ? cookieLocale :
            supportedLocales.includes(fallback || '') ? fallback :
            defaultLocale;

        const resolvedLanguage = localeToLanguage[resolvedLocale as keyof typeof localeToLanguage] || "english";
        
        setCurrentLanguage(resolvedLanguage);
        
        if (getPreference("language", "english") !== resolvedLanguage) {
            changeAppPreferenceByKey({ key: "language", value: resolvedLanguage });
        }
    }, [changeAppPreferenceByKey, getPreference]);



    const handleLanguageChange = (languageValue: string) => {
        changeAppPreferenceByKey({ key: "language", value: languageValue });

        const localeCode = languageToLocale[languageValue as keyof typeof languageToLocale] || "en";

        document.cookie = `locale=${localeCode}; path=/; max-age=31536000`;

        setCurrentLanguage(languageValue);

        router.refresh();
        location.reload();
    };

    const handleRegionChange = (value: string) => {
        changeAppPreferenceByKey({ key: "region", value });
    };

    const handleSwitchDarkMode = (value: boolean) => {
        changeAppPreferenceByKey({ key: "dark_mode", value });
        setTheme(value ? "dark" : "light");
    };

    return (
        <article>
            <header className="font-bold text-2xl">{t('title')}</header>
            <section className="space-y-4 mt-4 *:px-1">
                <div className="flex justify-between items-center hover:bg-gray-300 dark:hover:bg-gray-700 rounded py-1">
                    <Label htmlFor="language" className="w-full">{t('language')}</Label>
                    <Select 
                        value={currentLanguage}
                        onValueChange={handleLanguageChange}
                    >
                        <SelectTrigger className="w-40">
                            <SelectValue placeholder={t('select_language')} />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="vietnamese">{t('languages.vietnamese')}</SelectItem>
                            <SelectItem value="english">{t('languages.english')}</SelectItem>
                            <SelectItem value="spanish">{t('languages.spanish')}</SelectItem>
                            <SelectItem value="french">{t('languages.french')}</SelectItem>
                            <SelectItem value="german">{t('languages.german')}</SelectItem>
                            <SelectItem value="japanese">{t('languages.japanese')}</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="flex justify-between items-center hover:bg-gray-300 dark:hover:bg-gray-700 rounded py-1">
                    <Label htmlFor="region" className="w-full">{t('region')}</Label>
                    <Select defaultValue={getPreference("region", "us")}
                            onValueChange={handleRegionChange}>
                        <SelectTrigger className="w-40">
                            <SelectValue placeholder={t('select_region')} />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="us">{t('regions.us')}</SelectItem>
                            <SelectItem value="eu">{t('regions.eu')}</SelectItem>
                            <SelectItem value="asia">{t('regions.asia')}</SelectItem>
                            <SelectItem value="australia">{t('regions.australia')}</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="flex justify-between items-center hover:bg-gray-300 dark:hover:bg-gray-700 rounded py-1">
                    <Label htmlFor="darkMode" className="text-lg w-full">
                        <div>
                            <h1>{t('dark_mode')}</h1>
                            <p className="text-gray-500 dark:text-gray-400 font-light text-sm">
                                {t('dark_mode_description')}
                            </p>
                        </div>
                    </Label>
                    <Switch id="darkMode" checked={getPreference("dark_mode", false)}
                            onCheckedChange={handleSwitchDarkMode} />
                </div>
            </section>
        </article>
    );
};

export default AppPreferencesSetting;
