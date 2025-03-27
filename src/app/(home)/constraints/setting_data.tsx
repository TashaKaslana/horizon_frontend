import {AppleIcon, Bell, Lock, User, Video} from "lucide-react";
import AccountSetting from "@/components/common/user_dialog/settings/AccountSetting";
import PrivacySecuritySetting from "@/components/common/user_dialog/settings/PrivacySecuritySetting";
import NotificationSetting from "@/components/common/user_dialog/settings/NotificationSetting";
import VideoSetting from "@/components/common/user_dialog/settings/VideoSetting";
import AppPreferencesSetting from "@/components/common/user_dialog/settings/AppPreferencesSetting";

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