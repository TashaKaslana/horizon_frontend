import {Post} from "@/types/types";
import {create} from 'zustand'

interface DiscoverState {
    posts: Post[];
    setPosts: (posts: Post[]) => void;
    addPost: (post: Post) => void;
    removePost: (id: string) => void;
    sortPosts: (option: 'popular' | 'rating' | 'recent') => void
}

export const useDiscoverStore = create<DiscoverState>()((set) => ({
        posts: [],
        setPosts: (posts) => set({posts: posts}),

        addPost: (post) =>
            set((state) => ({
                posts: [...state.posts, post],
            })),
        removePost: (id) =>
            set((state) => ({
                posts: state.posts.filter((post) => post.id !== id),
            })),
        sortPosts: (option) => {
            set((state) => ({
                posts: [...state.posts].sort((a, b) => {
                        switch (option.toLowerCase()) {
                            case 'popular':
                                return b.view - a.view
                            case 'rating':
                                return b.likes - a.likes
                            case 'recent':
                                return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
                            default:
                                return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
                        }
                    }
                )
            }));
        }
    })
);