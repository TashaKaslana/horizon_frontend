import useFollowingStore from "@/app/(home)/following/store/useFollowingStore";
import { useCurrentUser } from "@/stores/useCurrentUser";
import {useChannel} from "ably/react";

export const useFollowingRealtime = () => {
    const {user} = useCurrentUser()
    const {addFollower, addFollowing, deleteFollower, deleteFollowing} = useFollowingStore()

    useChannel(`followers.${user?.id}`, (message) => {
        const {name, data} = message;

        if (name === 'user.followed') {
            if (user?.id === data.followedUserId) {
                addFollowing(data.follower)
            } else {
                addFollower(data.follower);
            }
        } else if (name === 'user.unfollowed') {
            if (user?.id === data.followedUserId) {
                deleteFollowing(data.followedUserId)
            } else {
                deleteFollower(data.followerUserId);
            }
        }
    });
}