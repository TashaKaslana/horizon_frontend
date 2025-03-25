import {ConfigType} from "@/types/types";

export const videoSettings : ConfigType[] = [
    {title: 'Auto play', description: 'Auto play video every time you see a video', key: 'auto_play', value: true},
    {title: 'Control video', description: 'Enable control for every video', key: 'control_video', value: true},
    {title: 'Loop video', description: 'Enable loop video for every video', key: 'loop_video', value: true},
]