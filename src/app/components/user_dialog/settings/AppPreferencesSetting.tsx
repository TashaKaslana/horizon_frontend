import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { useTheme } from "next-themes";
import { useConfigStore } from "@/stores/useConfigStore";

type PreferenceKey = "dark_mode" | "region" | "language";

const AppPreferencesSetting = () => {
    const { appPreferences, changeAppPreferenceByKey } = useConfigStore();
    const { setTheme } = useTheme();

    const getPreference = <T extends boolean | string>(key: PreferenceKey, defaultValue: T): T => {
        return (appPreferences.find((item) => item.key === key)?.value as T) ?? defaultValue;
    };

    const handleSelectChange = (key: "language" | "region", value: string) => {
        changeAppPreferenceByKey({ key, value });
    };

    const handleSwitchDarkMode = (value: boolean) => {
        changeAppPreferenceByKey({ key: "dark_mode", value });
        setTheme(value ? "dark" : "light");
    };

    return (
        <article>
            <header className="font-bold text-2xl">App Preferences</header>
            <section className="space-y-4 mt-4 *:px-1">
                <div className="flex justify-between items-center hover:bg-gray-300 dark:hover:bg-gray-700 rounded py-1">
                    <Label htmlFor="language" className="w-full">Language</Label>
                    <Select defaultValue={getPreference("language", "english")}
                            onValueChange={(value) => handleSelectChange("language", value)}>
                        <SelectTrigger className="w-40">
                            <SelectValue placeholder="Select Language" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="vietnamese">Vietnamese</SelectItem>
                            <SelectItem value="english">English</SelectItem>
                            <SelectItem value="spanish">Spanish</SelectItem>
                            <SelectItem value="french">French</SelectItem>
                            <SelectItem value="german">German</SelectItem>
                            <SelectItem value="japanese">Japanese</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="flex justify-between items-center hover:bg-gray-300 dark:hover:bg-gray-700 rounded py-1">
                    <Label htmlFor="region" className="w-full">Region</Label>
                    <Select defaultValue={getPreference("region", "us")}
                            onValueChange={(value) => handleSelectChange("region", value)}>
                        <SelectTrigger className="w-40">
                            <SelectValue placeholder="Select Region" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="us">United States</SelectItem>
                            <SelectItem value="eu">Europe</SelectItem>
                            <SelectItem value="asia">Asia</SelectItem>
                            <SelectItem value="australia">Australia</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="flex justify-between items-center hover:bg-gray-300 dark:hover:bg-gray-700 rounded py-1">
                    <Label htmlFor="darkMode" className="text-lg w-full">
                        <div>
                            <h1>Dark Mode</h1>
                            <p className="text-gray-500 dark:text-gray-400 font-light text-sm">
                                Enable dark theme for better night experience.
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
