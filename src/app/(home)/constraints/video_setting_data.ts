export const videoSettings = [
    {title: 'Auto play', description: 'Auto play video every time you see a video', key: 'auto_play', value: true},
    {title: 'Control video', description: 'Enable control for every video', key: 'control_video', value: true},
    {title: 'Loop video', description: 'Enable loop video for every video', key: 'loop_video', value: true},
]

export type ConfigType = {
    title: string
    description: string
    key: string
    value: boolean
}