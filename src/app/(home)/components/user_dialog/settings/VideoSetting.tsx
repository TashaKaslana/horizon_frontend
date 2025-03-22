import {Label} from "@/components/ui/label";
import {Switch} from "@/components/ui/switch";
import {ConfigOption, useConfigStore} from "@/store/useConfigStore";

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
                    <p>Customize video quality and settings</p>
                </header>
                <main className={'space-y-2'}>
                    {videoSettings.map((config) => (
                        <div key={config.key} className={'flex justify-between hover:bg-gray-100 items-center rounded'}>
                            <Label htmlFor={config.key} className={"w-full"}>
                                <div>
                                    <p className={"text-xl text-gray-700"}>{config.title}</p>
                                    <p className={"text-sm font-light text-gray-400"}>{config.description}</p>
                                </div>
                            </Label>
                            <Switch id={config.key} checked={config.value}
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