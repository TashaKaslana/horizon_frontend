import {create} from "zustand";
import {PostCategory, SortType} from "../types/types";
import {Feed} from "@/types/Feed";

type PostManagementStore = {
    initialPosts: Feed[]
    feeds: Feed[],
    setPosts: (posts: Feed[]) => void
    setInitialPosts: (posts: Feed[]) => void
    sortPosts: (option: SortType) => void
    filterPosts: (option: PostCategory) => void
    searchPosts: (filterString: string) => void
    deletePostById: (postId: string) => void
    addPost: (post: Feed) => void
}

export const usePostManagementStore = create<PostManagementStore>()((set) => ({
    initialPosts: [],
    feeds: [],

    setInitialPosts: (posts) => set({initialPosts: posts}),

    setPosts: (posts) => set({feeds: posts}),

    sortPosts: (option: SortType) => {
        set((state) => ({
            feeds: [...state.feeds].sort((a, b) => {
                    switch (option.toLowerCase()) {
                        case 'newest':
                            return new Date(b.post.createdAt).getTime() - new Date(a.post.createdAt).getTime()
                        case 'oldest':
                            return new Date(a.post.createdAt).getTime() - new Date(b.post.createdAt).getTime()
                        case 'popular':
                            return b.statistic.totalViews - a.statistic.totalViews
                        case 'top_rated':
                            return b.statistic.totalLikes - a.statistic.totalLikes
                        case 'top_commented':
                            return b.statistic.totalComments - a.statistic.totalComments
                        default:
                            return new Date(a.post.createdAt).getTime() - new Date(b.post.createdAt).getTime()
                    }
                }
            )
        }));
    },

    filterPosts: (option: PostCategory) => {
        set((state) => ({
            feeds: state.initialPosts.filter((feed) => {
                switch (option) {
                    case 'tech':
                        return feed.post?.categoryName.toLowerCase() === 'tech'
                    case 'gaming':
                        return feed.post?.categoryName.toLowerCase() === 'gaming'
                    case 'music':
                        return feed.post?.categoryName.toLowerCase() === 'music'
                    case 'education':
                        return feed.post?.categoryName.toLowerCase() === 'education'
                    case 'entertainment':
                        return feed.post?.categoryName.toLowerCase() === 'entertainment'
                    default:
                        return true
                }
            })
        }))
    },

    searchPosts: (filterString: string) => {
        set((state) => ({
            feeds: state.initialPosts.filter((feed) =>
                feed.post.caption.toLowerCase().includes(filterString.toLowerCase())
            )
        }));
    },

    deletePostById: (postId: string) => {
        set((state) => ({
            feeds: state.feeds.filter((feed) => feed.post.id !== postId),
            initialPosts: state.initialPosts.filter((feed) => feed.post.id !== postId)
        }))
    },

    addPost: (post: Feed) => set((state) => ({
        feeds: [...state.feeds, post],
        initialPosts: [...state.initialPosts, post]
    }))
}))