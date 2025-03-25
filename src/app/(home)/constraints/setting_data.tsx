import {AppleIcon, Bell, Lock, User, Video} from "lucide-react";
import AccountSetting from "@/app/(home)/components/user_dialog/settings/AccountSetting";
import PrivacySecuritySetting from "@/app/(home)/components/user_dialog/settings/PrivacySecuritySetting";
import NotificationSetting from "@/app/(home)/components/user_dialog/settings/NotificationSetting";
import VideoSetting from "@/app/(home)/components/user_dialog/settings/VideoSetting";
import AppPreferencesSetting from "@/app/(home)/components/user_dialog/settings/AppPreferencesSetting";

export const setting_data = [
    {
        label: 'Account',
        icon: <User/>,
        ui: <AccountSetting/>
    },
    {
        label: 'Privacy & Security',
        icon: <Lock/>,
        ui: <PrivacySecuritySetting/>
    },
    {
        label: 'Notifications',
        icon: <Bell/>,
        ui: <NotificationSetting/>
    },
    {
        label: 'Video Settings',
        icon: <Video/>,
        ui: <VideoSetting/>
    },
    {
        label: 'App Preferences',
        icon: <AppleIcon/>,
        ui: <AppPreferencesSetting/>
    }
]