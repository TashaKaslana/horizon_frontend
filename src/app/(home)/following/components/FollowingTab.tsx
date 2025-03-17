import UserCard from "@/app/(home)/following/components/UserCard";
import useFollowingStore from "@/app/(home)/following/store/useFollowingStore";
import { ScrollArea } from "@/components/ui/scroll-area";

export const FollowingTab = () => {
    const {following} = useFollowingStore()

    return <ScrollArea className={'overflow-y-auto h-full'}>
        <section className={'grid grid-cols-2 gap-5 px-3'}>
            {following.map((item, index) => (
                <UserCard user={item} key={index}/>
            ))}
        </section>
    </ScrollArea>;
}