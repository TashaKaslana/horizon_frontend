import {ScrollArea} from "@/components/ui/scroll-area";
import UserCard from "@/app/(home)/following/components/UserCard";
import useFollowingStore from "@/app/(home)/following/store/useFollowingStore";
import {UserX} from "lucide-react";

export const FollowerTab = () => {
    const {followers} = useFollowingStore()

    if (followers.length < 1) {
        return (
            <div className="flex flex-col size-full justify-center items-center gap-2">
                <UserX className={'size-32'}/>
                <p className={'text-xl text-zinc-700 font-bold dark:text-zinc-300'}>No followers</p>
            </div>
        );
    }


    return <div className={'size-full'}>
        <ScrollArea className={'overflow-y-auto size-full'}>
            <section className={'grid grid-cols-2 gap-5 px-3'}>
                {followers.map((follower, index) => (
                    // <Link href={`users/${follower.user.id}/overview`}>
                        <UserCard follow={follower} key={index} initialFollowing={false}/>
                    // </Link>
                ))}
            </section>
        </ScrollArea>
    </div>;
}