import {Switch} from "@/components/ui/switch";
import {Label} from "@/components/ui/label";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {useTranslations} from "next-intl";


const PrivacySecuritySetting = () => {
    return (
        <section className={'px-1 space-y-10'}>
            <ProfileSection/>
            <CommentSection/>
        </section>
    )
}

function ProfileSection() {
    const t = useTranslations('Home.user_dialog.settings_dialog.privacy_section');

    return (
        <article className={'px-1 space-y-2'}>
            <header className={"font-bold text-2xl"}>{t('title')}</header>
            <main className={"flex justify-between hover:bg-gray-100 items-center rounded px-1 font-md"}>
                <Label htmlFor={"public"} className={"w-full"}>
                    <div>
                        <p className={"text-xl text-gray-700"}>{t('public')}</p>
                        <p className={"text-sm font-light text-gray-400"}>{t('public_description')}</p>
                    </div>
                </Label>
                <Switch id={"public"}/>
            </main>
        </article>
    );
}

const CommentSection = () => {
    const t = useTranslations('Home.user_dialog.settings_dialog.privacy_section');

    return (
        <article className={'px-1'}>
            <header className={"font-bold text-2xl"}>{t('comments_privacy')}</header>
            <main className={"flex justify-between items-center hover:bg-gray-100 rounded px-1 font-md"}>
                <header className={'w-full'}>
                    <p className={"text-xl text-gray-700"}>{t('comments_on')}</p>
                    <p className={"text-sm font-light text-gray-400"}>{t('comments_on_description')}</p>
                </header>
                <main>
                    <Select defaultValue={'everyone'}>
                        <SelectTrigger className={'w-32'}>
                            <SelectValue placeholder={t('everyone')}/>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value={'everyone'}>{t('everyone')}</SelectItem>
                            <SelectItem value={'friends'}>{t('friends')}</SelectItem>
                            <SelectItem value={'only me'}>{t('only_me')}</SelectItem>
                        </SelectContent>
                    </Select>
                </main>
            </main>
        </article>
    )
}

export default PrivacySecuritySetting