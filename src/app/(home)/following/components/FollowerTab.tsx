import {ScrollArea} from "@/components/ui/scroll-area";
import UserCard from "@/app/(home)/following/components/UserCard";
import useFollowingStore from "@/app/(home)/following/store/useFollowingStore";

export const FollowerTab = () => {
    const {followers} = useFollowingStore()

    return <ScrollArea className={'overflow-y-auto h-full'}>
        <section className={'grid grid-cols-2 gap-5 px-3'}>
            {followers.map((follower, index) => (
                <UserCard follow={follower} key={index} initialFollowing={false}/>
            ))}
        </section>
    </ScrollArea>;
}