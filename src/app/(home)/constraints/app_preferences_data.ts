import {ConfigType} from "@/types/types";

export const appPreferences : ConfigType[] =  [
    {title: 'Dark mode', description: 'Enable dark mode for the entire app', key: 'dark_mode', value: false},
    {title: 'Region', description: 'Region where you live or prefer to choose', key: 'region', value: 'us'},
    {title: 'Language', description: 'Choose your preferred language', key: 'language', value: 'english'},
]