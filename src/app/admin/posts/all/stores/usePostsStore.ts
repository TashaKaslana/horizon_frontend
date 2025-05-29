'use client'

import {create} from "zustand";
import {immer} from "zustand/middleware/immer";
import { InfiniteData } from "@tanstack/react-query";
import { PostResponse } from "@/api/client/types.gen";

export interface PostPage {
    data?: PostResponse[];
}

interface PostsState {
    posts: PostResponse[];
    selectedPost: PostResponse | null;
    infiniteQueryData: InfiniteData<PostPage> | null;
    actions: {
        setInfiniteQueryData: (data: InfiniteData<PostPage> | null) => void;
        setSelectedPost: (post: PostResponse | null) => void;
        clearAllData: () => void;
        addPost: (post: PostResponse) => void;
        updatePost: (post: PostResponse) => void;
        removePost: (postId: string) => void;
        setPosts: (posts: PostResponse[]) => void;
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

            updatePost: (updatedPost) =>
                set((state) => {
                    state.posts = state.posts.map((p) => (p.id === updatedPost.id ? updatedPost : p));
                    if (state.selectedPost?.id === updatedPost.id) {
                        state.selectedPost = { ...state.selectedPost, ...updatedPost }
                    }
                    if (state.infiniteQueryData) {
                        state.infiniteQueryData.pages = state.infiniteQueryData.pages.map((page) => ({
                            ...page,
                            data: (page.data ?? []).map((p) => (p.id === updatedPost.id ? updatedPost : p)),
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

