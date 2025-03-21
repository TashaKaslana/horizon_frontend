import {create} from "zustand";
import {Post, PostCategory, SortType} from "../types/types";

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
                            return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
                        case 'oldest':
                            return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
                        case 'popular':
                            return b.view - a.view
                        case 'top_rated':
                            return b.likes - a.likes
                        case 'top_commented':
                            return b.comments - a.comments
                        default:
                            return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
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
                        return post.category === 'tech'
                    case 'gaming':
                        return post.category === 'gaming'
                    case 'music':
                        return post.category === 'music'
                    case 'education':
                        return post.category === 'education'
                    case 'entertainment':
                        return post.category === 'entertainment'
                    default:
                        return true
                }
            })
        }))
    },

    searchPosts: (filterString: string) => {
        set((state) => ({
            posts: state.initialPosts.filter((post) =>
                post.title.toLowerCase().includes(filterString.toLowerCase())
            )
        }));
    }
}))