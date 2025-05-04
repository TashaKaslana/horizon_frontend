import UserCard from "@/app/(home)/following/components/UserCard";
import useFollowingStore from "@/app/(home)/following/store/useFollowingStore";
import { ScrollArea } from "@/components/ui/scroll-area";
import {UserX} from "lucide-react";

export const FollowingTab = () => {
    const {following} = useFollowingStore()

    if (following.length < 1) {
        return (
            <div className="flex flex-col size-full justify-center items-center gap-2">
                <UserX className={'size-32'}/>
                <p className={'text-xl text-zinc-700 font-bold dark:text-zinc-300'}>No following</p>
            </div>
        );
    }

    return <ScrollArea className={'overflow-y-auto h-full'}>
        <section className={'grid grid-cols-2 gap-5 px-3'}>
            {following.map((item, index) => (
                <UserCard follow={item} key={index}/>
            ))}
        </section>
    </ScrollArea>;
}