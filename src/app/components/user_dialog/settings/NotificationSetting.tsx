import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useState } from "react";

const NotificationSetting = () => {
    return (
        <section>
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
    const items: { title: string; value: keyof PushNotificationData; description: string }[] = [
        { title: "Likes", value: "isEnableLikes", description: "Get notified when someone likes your video." },
        { title: "Comments", value: "isEnableComments", description: "Get notified when someone comments on your video." },
        { title: "Mentions", value: "isEnableMentions", description: "Get notified when someone mentions you in a comment or post." },
        { title: "Followers", value: "isEnableFollowers", description: "Get notified when someone follows you." }
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
            <header className="font-bold text-2xl">Push Notifications</header>
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
    const [emailConfig, setEmailConfig] = useState<EmailNotification>({
        isEnableEmails: false
    });

    const handleToggle = (value: boolean) => {
        setEmailConfig({ isEnableEmails: value });
    };

    return (
        <article className="mt-6">
            <header className="font-bold text-2xl">Email Preferences</header>
            <section className="space-y-2">
                <article className="flex justify-between items-center hover:bg-gray-300 rounded px-1">
                    <Label htmlFor="isEnableEmails" className="text-lg w-full">
                        <div>
                            <h1>Email Notifications</h1>
                            <p className="text-gray-500 font-light text-sm">Receive email notifications for important updates.</p>
                        </div>
                    </Label>
                    <Switch id="isEnableEmails" checked={emailConfig.isEnableEmails} onCheckedChange={handleToggle} />
                </article>
            </section>
        </article>
    );
};

export default NotificationSetting;
