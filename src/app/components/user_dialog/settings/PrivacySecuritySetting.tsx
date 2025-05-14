import {Switch} from "@/components/ui/switch";
import {Label} from "@/components/ui/label";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";


const PrivacySecuritySetting = () => {
    return (
        <section className={'px-1 space-y-10'}>
            <ProfileSection/>
            <CommentSection/>
        </section>
    )
}

function ProfileSection() {
    return (
        <article className={'px-1 space-y-2'}>
            <header className={"font-bold text-2xl"}>Profile Privacy</header>
            <main className={"flex justify-between hover:bg-gray-100 items-center rounded px-1 font-md"}>
                <Label htmlFor={"public"} className={"w-full"}>
                    <div>
                        <p className={"text-xl text-gray-700"}>Public</p>
                        <p className={"text-sm font-light text-gray-400"}>Everyone can see your profile and videos</p>
                    </div>
                </Label>
                <Switch id={"public"}/>
            </main>
        </article>
    );
}

const CommentSection = () => {
    return (
        <article className={'px-1'}>
            <header className={"font-bold text-2xl"}>Comments Privacy</header>
            <main className={"flex justify-between items-center hover:bg-gray-100 rounded px-1 font-md"}>
                <header className={'w-full'}>
                    <p className={"text-xl text-gray-700"}>Comments On</p>
                    <p className={"text-sm font-light text-gray-400"}>Allow users to comment on your posts</p>
                </header>
                <main>
                    <Select defaultValue={'everyone'}>
                        <SelectTrigger className={'w-32'}>
                            <SelectValue placeholder={'Everyone'}/>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value={'everyone'}>Everyone</SelectItem>
                            <SelectItem value={'friends'}>Friends</SelectItem>
                            <SelectItem value={'only me'}>Only Me</SelectItem>
                        </SelectContent>
                    </Select>
                </main>
            </main>
        </article>
    )
}

export default PrivacySecuritySetting