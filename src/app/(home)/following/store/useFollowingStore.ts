import {create} from "zustand";
import {UserCardProps} from "@/app/(home)/following/types/type";

interface UserFollowingState {
    initialFollowing: UserCardProps[]
    initialFollowers: UserCardProps[]
    following: UserCardProps[];
    followers: UserCardProps[];

    setInitialFollowing: (initialFollowing: UserCardProps[]) => void;
    setInitialFollowers: (initialFollowers: UserCardProps[]) => void;
    setFollowing: (following: UserCardProps[]) => void;
    setFollowers: (followers: UserCardProps[]) => void;
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
