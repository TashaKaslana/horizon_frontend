'use client'

import {AppleIcon, Bell, Lock, User, Video} from "lucide-react";
import AccountSetting from "@/app/components/user_dialog/settings/AccountSetting";
import PrivacySecuritySetting from "@/app/components/user_dialog/settings/PrivacySecuritySetting";
import NotificationSetting from "@/app/components/user_dialog/settings/NotificationSetting";
import VideoSetting from "@/app/components/user_dialog/settings/VideoSetting";
import AppPreferencesSetting from "@/app/components/user_dialog/settings/AppPreferencesSetting";
import {useTranslations} from "next-intl";

export const useSettingsData = () => {
    const t = useTranslations('Home.user_dialog.settings_dialog');

    return [
        {
            label: t('account_section.title'),
            icon: <User/>,
            ui: <AccountSetting/>
        },
        {
            label: t('privacy_section.title'),
            icon: <Lock/>,
            ui: <PrivacySecuritySetting/>
        },
        {
            label: t('notification_section.title'),
            icon: <Bell/>,
            ui: <NotificationSetting/>
        },
        {
            label: t('video_section.title'),
            icon: <Video/>,
            ui: <VideoSetting/>
        },
        {
            label: t('app_preferences.title'),
            icon: <AppleIcon/>,
            ui: <AppPreferencesSetting/>
        }
    ];
};