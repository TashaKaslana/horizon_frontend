import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useTranslations } from "next-intl";

const NotificationSetting = () => {
    const t = useTranslations('Home.user_dialog.settings_dialog.notification_section');

    return (
        <section>
            <header>
                <h1 className="font-bold text-2xl mb-4">{t('title')}</h1>
            </header>
            <PushNotification />
            <EmailPreferences />
        </section>
    );
};

type PushNotificationData = {
    isEnableLikes: boolean;
    isEnableComments: boolean;
    isEnableMentions: boolean;
    isEnableFollowers: boolean;
};

type EmailNotification = {
    isEnableEmails: boolean;
};

const PushNotification = () => {
    const t = useTranslations('Home.user_dialog.settings_dialog.notification_section');

    const items: { title: string; value: keyof PushNotificationData; description: string }[] = [
        { title: t('likes'), value: "isEnableLikes", description: t('likes_description') },
        { title: t('comments'), value: "isEnableComments", description: t('comments_description') },
        { title: t('mentions'), value: "isEnableMentions", description: t('mentions_description') },
        { title: t('followers'), value: "isEnableFollowers", description: t('followers_description') }
    ];

    const [configNotification, setConfigNotification] = useState<PushNotificationData>({
        isEnableLikes: false,
        isEnableComments: false,
        isEnableMentions: true,
        isEnableFollowers: false
    });

    const handleToggle = (key: keyof PushNotificationData, value: boolean) => {
        setConfigNotification((prev) => ({ ...prev, [key]: value }));
    };

    return (
        <article>
            <header className="font-bold text-2xl">{t('push_notifications')}</header>
            <section className="space-y-2">
                {items.map((item) => (
                    <article key={item.value} className="flex justify-between items-center hover:bg-gray-300 rounded px-1">
                        <Label htmlFor={item.value} className="text-lg w-full">
                            <div>
                                <h1>{item.title}</h1>
                                <p className="text-gray-500 font-light text-sm">{item.description}</p>
                            </div>
                        </Label>
                        <Switch id={item.value} checked={configNotification[item.value]} onCheckedChange={(value) => handleToggle(item.value, value)} />
                    </article>
                ))}
            </section>
        </article>
    );
};

const EmailPreferences = () => {
    const t = useTranslations('Home.user_dialog.settings_dialog.notification_section');

    const [emailConfig, setEmailConfig] = useState<EmailNotification>({
        isEnableEmails: false
    });

    const handleToggle = (value: boolean) => {
        setEmailConfig({ isEnableEmails: value });
    };

    return (
        <article className="mt-6">
            <header className="font-bold text-2xl">{t('email_preferences')}</header>
            <section className="space-y-2">
                <article className="flex justify-between items-center hover:bg-gray-300 rounded px-1">
                    <Label htmlFor="isEnableEmails" className="text-lg w-full">
                        <div>
                            <h1>{t('email_notifications')}</h1>
                            <p className="text-gray-500 font-light text-sm">{t('email_notifications_description')}</p>
                        </div>
                    </Label>
                    <Switch id="isEnableEmails" checked={emailConfig.isEnableEmails} onCheckedChange={handleToggle} />
                </article>
            </section>
        </article>
    );
};

export default NotificationSetting;
