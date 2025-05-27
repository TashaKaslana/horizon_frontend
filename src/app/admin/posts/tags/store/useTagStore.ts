import {create} from "zustand";
import {immer} from "zustand/middleware/immer";
import { InfiniteData } from "@tanstack/react-query";
import {ResponseMetadata, TagResponse} from "@/api/client/types.gen"; // Assuming PostTag type exists similar to PostCategory

export interface TagPage {
    data?: TagResponse[];
    metadata?: ResponseMetadata;
}

type SetInfiniteDataFunction = (data: InfiniteData<TagPage> | null | ((prev: InfiniteData<TagPage> | null) => InfiniteData<TagPage> | null)) => void;

interface TagState {
    tags: TagResponse[];
    infiniteQueryData: InfiniteData<TagPage> | null;
    actions: {
        setInfiniteQueryData: SetInfiniteDataFunction;
        clearAllData: () => void;
        addTag: (tag: TagResponse) => void;
        updateTag: (updatedTag: TagResponse) => void;
        removeTag: (tagId: string | number) => void;
    };
}

const useTagStore = create<TagState>()(
    immer((set) => ({
        tags: [],
        infiniteQueryData: null,
        actions: {
            setInfiniteQueryData: (data) =>
                set((state) => {
                    if (typeof data === 'function') {
                        state.infiniteQueryData = data(state.infiniteQueryData);
                    } else {
                        state.infiniteQueryData = data;
                    }
                    state.tags = state.infiniteQueryData?.pages?.flatMap((page: TagPage) => page.data ?? []) ?? [];
                }),
            addTag: (tag) =>
                set((state) => {
                    state.tags = [tag, ...state.tags];
                    if (state.infiniteQueryData && state.infiniteQueryData.pages.length > 0) {
                        const updatedFirstPageData = [tag, ...(state.infiniteQueryData.pages[0]?.data ?? [])];
                        const updatedFirstPage = {
                            ...(state.infiniteQueryData.pages[0] || {}),
                            data: updatedFirstPageData,
                        };
                        state.infiniteQueryData.pages = [updatedFirstPage, ...state.infiniteQueryData.pages.slice(1)];
                    } else {
                        state.infiniteQueryData = {
                            pages: [{ data: [tag], metadata: {} }],
                            pageParams: [0],
                        };
                    }
                }),
            updateTag: (updatedTag) =>
                set((state) => {
                    state.tags = state.tags.map(t =>
                        t.id === updatedTag.id ? updatedTag : t
                    );
                    if (state.infiniteQueryData) {
                        state.infiniteQueryData.pages = state.infiniteQueryData.pages.map(page => {
                            const pageData = page.data ?? [];
                            if (pageData.some(t => t.id === updatedTag.id)) {
                                return {
                                    ...page,
                                    data: pageData.map(t =>
                                        t.id === updatedTag.id ? updatedTag : t
                                    ),
                                };
                            }
                            return page;
                        });
                    }
                }),
            removeTag: (tagId) =>
                set((state) => {
                    state.tags = state.tags.filter(t => t.id !== tagId);
                    if (state.infiniteQueryData) {
                        state.infiniteQueryData.pages = state.infiniteQueryData.pages.map(page => {
                            const pageData = page.data ?? [];
                            if (pageData.some(t => t.id === tagId)) {
                                return {
                                    ...page,
                                    data: pageData.filter(t => t.id !== tagId),
                                };
                            }
                            return page;
                        });

                        state.infiniteQueryData.pages = state.infiniteQueryData.pages.filter(page => (page.data?.length ?? 0) > 0);
                    }
                }),
            clearAllData: () =>
                set((state) => {
                    state.tags = [];
                    state.infiniteQueryData = null;
                }),
        },
    }))
);

export default useTagStore;

