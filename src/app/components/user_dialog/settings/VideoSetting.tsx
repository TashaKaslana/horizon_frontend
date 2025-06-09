import {Label} from "@/components/ui/label";
import {Switch} from "@/components/ui/switch";
import {useConfigStore} from "@/stores/useConfigStore";
import { ConfigOption } from "@/types/types";
import { useTranslations } from "next-intl";

const VideoSetting = () => {
    const {videoSettings, changeVideoSettingByKey} = useConfigStore();
    const t = useTranslations('Home.user_dialog.settings_dialog.video_section');

    const handleCheckedChange = (config: ConfigOption) => {
        changeVideoSettingByKey(config)
    }

    return (
        <section>
            <article className={'space-y-2'}>
                <header>
                    <h1 className={'font-bold text-2xl'}>{t('title')}</h1>
                    <p className={"text-md font-md text-zinc-500"}>{t('description')}</p>
                </header>
                <main className={'space-y-2 px-1'}>
                    {videoSettings.map((config) => (
                        <div key={config.key} className={'flex justify-between hover:bg-gray-100 items-center rounded px-1 cursor-pointer'}>
                            <Label htmlFor={config.key} className={"w-full"}>
                                <div>
                                    <p className={"text-xl font-lg text-gray-800"}>{t(`options.${config.key}.title`)}</p>
                                    <p className={"text-sm font-light text-gray-400"}>{t(`options.${config.key}.description`)}</p>
                                </div>
                            </Label>
                            <Switch id={config.key} checked={config.value as boolean}
                                    onCheckedChange={
                                        (value) => handleCheckedChange({key: config.key, value})
                                    }/>
                        </div>
                    ))}
                </main>
            </article>
        </section>
    )
}


export default VideoSetting