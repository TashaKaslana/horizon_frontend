import {create} from "zustand";
import {FollowCardProps} from "@/types/follow";

interface UserFollowingState {
    initialFollowing: FollowCardProps[]
    initialFollowers: FollowCardProps[]
    following: FollowCardProps[];
    followers: FollowCardProps[];

    setInitialFollowing: (initialFollowing: FollowCardProps[]) => void;
    setInitialFollowers: (initialFollowers: FollowCardProps[]) => void;
    setFollowing: (following: FollowCardProps[]) => void;
    setFollowers: (followers: FollowCardProps[]) => void;

    addFollowing: (user: FollowCardProps) => void;
    updateFollowing: (user: FollowCardProps) => void;
    deleteFollowing: (userId: string) => void;

    addFollower: (user: FollowCardProps) => void;
    updateFollower: (user: FollowCardProps) => void;
    deleteFollower: (userId: string) => void;
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

    addFollowing: (user) =>
        set((state) => ({ following: [...state.following, user] })),
    updateFollowing: (userProps) =>
        set((state) => ({
            following: state.following.map((u) =>
                u.user.id === userProps.user.id ? userProps : u
            ),
        })),
    deleteFollowing: (userId) =>
        set((state) => ({
            following: state.following.filter((u) => u.user.id !== userId),
        })),

    addFollower: (user) =>
        set((state) => ({ followers: [...state.followers, user] })),
    updateFollower: (userProps) =>
        set((state) => ({
            followers: state.followers.map((u) =>
                u.user?.id === userProps.user?.id ? userProps : u
            ),
        })),
    deleteFollower: (userId) =>
        set((state) => ({
            followers: state.followers.filter((u) => u.user?.id !== userId),
        })),
}));

export default useFollowingStore;
