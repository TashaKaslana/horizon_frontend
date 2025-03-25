import {create} from "zustand";
import {videoSettings} from "@/app/(home)/constraints/video_setting_data";
import {ConfigOption, ConfigType} from "@/types/types";
import {appPreferences} from "@/app/(home)/constraints/app_preferences_data";

type ConfigStore = {
    videoSettings: ConfigType[],
    setVideoSettings: (configs: ConfigType[]) => void,
    changeVideoSettingByKey: (config: ConfigOption) => void,

    appPreferences: ConfigType[],
    setAppPreferences: (configs: ConfigType[]) => void,
    changeAppPreferenceByKey: (config: ConfigOption) => void,
}

export const useConfigStore = create<ConfigStore>()((set) => ({
        videoSettings: videoSettings,
        setVideoSettings: (configs) => set({videoSettings: configs}),
        changeVideoSettingByKey: (config) => {
            set((state) => ({
                videoSettings: state.videoSettings.map((item) => {
                    return item.key === config.key ? {...item, ...config} : item
                })
            }))
        },

        appPreferences: appPreferences,
        setAppPreferences: (configs) => set({appPreferences: configs}),
        changeAppPreferenceByKey: (config) => {
            set((state) => ({
                appPreferences: state.appPreferences.map((item) => {
                    return item.key === config.key? {...item,...config} : item
                })
            }))
        }
    }),
)
