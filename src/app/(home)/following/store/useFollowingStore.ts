import {create} from "zustand";
import {FollowCardProps} from "@/app/(home)/following/types/type";

interface UserFollowingState {
    initialFollowing: FollowCardProps[]
    initialFollowers: FollowCardProps[]
    following: FollowCardProps[];
    followers: FollowCardProps[];

    setInitialFollowing: (initialFollowing: FollowCardProps[]) => void;
    setInitialFollowers: (initialFollowers: FollowCardProps[]) => void;
    setFollowing: (following: FollowCardProps[]) => void;
    setFollowers: (followers: FollowCardProps[]) => void;
}

const useFollowingStore = create<UserFollowingState>()((set) => ({
    initialFollowing: [],
    initialFollowers: [],
    following: [],
    followers: [],

    setInitialFollowing: (initialFollowing) => set({initialFollowing}),
    setInitialFollowers: (initialFollowers) => set({initialFollowers}),
    setFollowing: (following) => set({following}),
    setFollowers: (followers) => set({followers}),
}));

export default useFollowingStore;
