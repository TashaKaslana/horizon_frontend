import InfoForm from "@/app/(home)/profile/edit/Info-form";
import {Separator} from "@/components/ui/separator";
import {useTranslations} from "next-intl";

const ProfileEditForm = () => {
    const t = useTranslations("Home.profile.edit");

    return <div className={'size-full flex justify-center'}>
        <div className={'my-5 bg-muted/80 w-3/4 rounded-lg'}>
            <header className={'space-y-2 p-1 rounded bg-transparent/70'}>
                <h2 className={'text-2xl font-bold text-center'}>{t("title")}</h2>
                <p className={'text-center'}>
                    {t("description")}
                </p>
            </header>
            <Separator/>
            <InfoForm/>
        </div>
    </div>
}

export default ProfileEditForm;