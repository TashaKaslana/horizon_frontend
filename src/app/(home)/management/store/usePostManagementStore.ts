import {create} from "zustand";
import {PostCategory, SortType} from "../types/types";
import { Post } from "@/types/Post";
import { toast } from "sonner";

type PostManagementStore = {
    initialPosts: Post[]
    posts: Post[],
    setPosts: (posts: Post[]) => void
    setInitialPosts: (posts: Post[]) => void
    sortPosts: (option: SortType) => void
    filterPosts: (option: PostCategory) => void
    searchPosts: (filterString: string) => void
}

export const usePostManagementStore = create<PostManagementStore>()((set) => ({
    initialPosts: [],
    posts: [],

    setInitialPosts: (posts) => set({initialPosts: posts}),

    setPosts: (posts) => set({posts}),

    sortPosts: (option: SortType) => {
        set((state) => ({
            posts: [...state.posts].sort((a, b) => {
                    switch (option.toLowerCase()) {
                        case 'newest':
                            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
                        case 'oldest':
                            return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
                        case 'popular':
                            toast.error('This feature is not available yet')
                            // return b.view - a.view
                            return 0
                        case 'top_rated':
                            toast.error('This feature is not available yet')
                            // return b.likes - a.likes
                            return 0
                        case 'top_commented':
                            toast.error('This feature is not available yet')
                            // return b.comments - a.comments
                            return 0
                        default:
                            return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
                    }
                }
            )
        }));
    },

    filterPosts: (option: PostCategory) => {
        set((state) => ({
            posts: state.initialPosts.filter((post) => {
                switch (option) {
                    case 'tech':
                        return post.categoryName.toLowerCase() === 'tech'
                    case 'gaming':
                        return post.categoryName.toLowerCase() === 'gaming'
                    case 'music':
                        return post.categoryName.toLowerCase() === 'music'
                    case 'education':
                        return post.categoryName.toLowerCase() === 'education'
                    case 'entertainment':
                        return post.categoryName.toLowerCase() === 'entertainment'
                    default:
                        return true
                }
            })
        }))
    },

    searchPosts: (filterString: string) => {
        set((state) => ({
            posts: state.initialPosts.filter((post) =>
                post.caption.toLowerCase().includes(filterString.toLowerCase())
            )
        }));
    }
}))