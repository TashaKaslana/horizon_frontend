import {create} from "zustand";
import {ConfigType, videoSettings} from "@/app/(home)/constraints/video_setting_data";

type ConfigStore = {
    videoSettings: ConfigType[],
    setVideoSettings: (configs: ConfigType[]) => void,
    changeVideoSettingByKey: (config: ConfigOption) => void,
}

export type ConfigOption = {
    key: string,
    value: boolean,
}

export const useConfigStore = create<ConfigStore>()((set) => ({
        videoSettings: [
            ...videoSettings
        ],
        setVideoSettings: (configs) => set({videoSettings: configs}),
        changeVideoSettingByKey: (config) => {
            set((state) => ({
                videoSettings: state.videoSettings.map((item) => {
                    return item.key === config.key ? {...item, ...config} : item
                })
            }))
        }
    }),
)
