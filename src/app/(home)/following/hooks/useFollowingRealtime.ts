import useFollowingStore from "@/app/(home)/following/store/useFollowingStore";
import { useCurrentUser } from "@/stores/useCurrentUser";
import {useChannel} from "ably/react";

export const useFollowingRealtime = () => {
    const {user} = useCurrentUser()
    const {deleteFollower, deleteFollowing} = useFollowingStore()

    useChannel(`followers.${user?.id}`, (message) => {
        const {name, data} = message;

        if (name === 'user.followed') {
            if (user?.id === data.followerUserId) {
                //TODO adjust backend to send only the follower data
                // addFollowing(data.)
            } else {
                // addFollower(data);
            }
        } else if (name === 'user.unfollowed') {
            if (user?.id === data.followerUserId) {
                deleteFollowing(data.followedUserId)
            } else {
                deleteFollower(data.followerUserId);
            }
        }
    });
}