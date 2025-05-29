'use client'

import {create} from "zustand";
import {immer} from "zustand/middleware/immer";
import { InfiniteData } from "@tanstack/react-query";
import {PostAdminViewDto, PostCategorySummary, PostResponse} from "@/api/client/types.gen";

export interface PostPage {
    data?: PostAdminViewDto[];
}

interface PostsState {
    posts: PostAdminViewDto[];
    selectedPost: PostAdminViewDto | null;
    infiniteQueryData: InfiniteData<PostPage> | null;
    actions: {
        setInfiniteQueryData: (data: InfiniteData<PostPage>) => void;
        setSelectedPost: (post: PostAdminViewDto | null) => void;
        clearAllData: () => void;
        addPost: (post: PostAdminViewDto) => void;
        updatePost: (postUpdate: PostResponse) => void;
        removePost: (postId: string) => void;
        setPosts: (posts: PostAdminViewDto[]) => void;
    };
}

const usePostsStore = create<PostsState>()(
    immer((set) => ({
        posts: [],
        infiniteQueryData: null,
        selectedPost: null,
        actions: {
            setInfiniteQueryData: (data) =>
                set((state) => {
                    state.infiniteQueryData = data;
                    state.posts = data?.pages?.flatMap((page: PostPage) => page.data ?? []) ?? [];
                }),

            setSelectedPost: (post) =>
                set((state) => {
                    state.selectedPost = post;
                }),

            addPost: (newPost) =>
                set((state) => {
                    state.posts.unshift(newPost);
                    if (state.infiniteQueryData) {
                        const firstPage = state.infiniteQueryData.pages[0];
                        if (firstPage) {
                            firstPage.data = [newPost, ...(firstPage.data ?? [])];
                        }
                    }
                }),

            updatePost: (postUpdate) =>
                set((state) => {
                    const { id, categoryName, ...otherUpdateData } = postUpdate;

                    const applyUpdate = (post: PostAdminViewDto): PostAdminViewDto => ({
                        ...post,
                        ...otherUpdateData,
                        id: id,
                        visibility: otherUpdateData.visibility as PostAdminViewDto['visibility'],
                        category: categoryName ? { ...(post.category || {}), name: categoryName } as PostCategorySummary : post.category,
                    });

                    state.posts = state.posts.map((p) =>
                        p.id === id ? applyUpdate(p) : p
                    );

                    const selected = state.selectedPost;
                    if (selected && selected.id === id) {
                        state.selectedPost = applyUpdate(selected);
                    }

                    if (state.infiniteQueryData) {
                        state.infiniteQueryData.pages = state.infiniteQueryData.pages.map((page) => ({
                            ...page,
                            data: (page.data ?? []).map((p) =>
                                p.id === id ? applyUpdate(p) : p
                            ),
                        }));
                    }
                }),

            removePost: (postId) =>
                set((state) => {
                    state.posts = state.posts.filter((p) => p.id !== postId);
                    if (state.selectedPost?.id === postId) {
                        state.selectedPost = null;
                    }
                    if (state.infiniteQueryData) {
                        state.infiniteQueryData.pages = state.infiniteQueryData.pages
                            .map((page) => ({
                                ...page,
                                data: (page.data ?? []).filter((p) => p.id !== postId),
                            }))
                            .filter((page) => (page.data?.length ?? 0) > 0);
                    }
                }),

            setPosts: (newPosts) =>
                set((state) => {
                    state.posts = newPosts;
                    if (state.infiniteQueryData) {
                        const remainingPosts = [...newPosts];
                        state.infiniteQueryData.pages = state.infiniteQueryData.pages.map(page => {
                            const pagePostsCount = page.data?.length || 0;
                            const postsForThisPage = remainingPosts.splice(0, pagePostsCount);
                            return {
                                ...page,
                                data: postsForThisPage
                            };
                        }).filter(page => page.data && page.data.length > 0);

                        if (newPosts.length > 0 && state.infiniteQueryData.pages.length === 0) {
                            state.infiniteQueryData.pages = [{ data: newPosts }];
                            state.infiniteQueryData.pageParams = [0];
                        }
                    }
                }),

            clearAllData: () =>
                set((state) => {
                    state.posts = [];
                    state.infiniteQueryData = null;
                    state.selectedPost = null;
                }),
        },
    }))
);

export default usePostsStore;

