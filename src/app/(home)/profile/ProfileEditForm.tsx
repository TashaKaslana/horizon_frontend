import InfoForm from "@/app/(home)/profile/Info-form";
import {Separator} from "@/components/ui/separator";

const ProfileEditForm = () => {
    return <div className={'size-full bg-linear-to-t from-sky-400 to-indigo-400 flex justify-center'}>
        <div className={'my-5 bg-muted/80 w-3/4 rounded-lg'}>
            <header className={'space-y-2 p-1 rounded bg-transparent/70'}>
                <h2 className={'text-2xl font-bold text-center'}>Edit Profile</h2>
                <p className={'text-center'}>
                    Update your profile information to keep your account secure and up to date.
                </p>
            </header>
            <Separator/>
            <InfoForm/>
        </div>
    </div>
}

export default ProfileEditForm;