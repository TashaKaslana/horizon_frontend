import {Label} from "@/components/ui/label";
import {Switch} from "@/components/ui/switch";
import {useConfigStore} from "@/stores/useConfigStore";
import { ConfigOption } from "@/types/types";

const VideoSetting = () => {
    const {videoSettings, changeVideoSettingByKey} = useConfigStore()

    const handleCheckedChange = (config: ConfigOption) => {
        changeVideoSettingByKey(config)
    }

    return (
        <section>
            <article className={'space-y-2'}>
                <header>
                    <h1 className={'font-bold text-2xl'}>Video Settings</h1>
                    <p className={"text-md font-md text-zinc-500"}>Customize video quality and settings</p>
                </header>
                <main className={'space-y-2 px-1'}>
                    {videoSettings.map((config) => (
                        <div key={config.key} className={'flex justify-between hover:bg-gray-100 items-center rounded px-1 cursor-pointer'}>
                            <Label htmlFor={config.key} className={"w-full"}>
                                <div>
                                    <p className={"text-xl font-lg text-gray-800"}>{config.title}</p>
                                    <p className={"text-sm font-light text-gray-400"}>{config.description}</p>
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