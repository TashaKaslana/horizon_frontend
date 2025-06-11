import {create} from "zustand";
import {immer} from "zustand/middleware/immer";
import {InfiniteData} from "@tanstack/react-query";
import {DailyCountDto, OverviewStatistic, ResponseMetadata, TagWithCountDto, TopTagUsageDto} from "@/api/client";

export interface TagPage {
    data?: TagWithCountDto[];
    metadata?: ResponseMetadata;
}

type SetInfiniteDataFunction = (data: InfiniteData<TagPage> | null | ((prev: InfiniteData<TagPage> | null) => InfiniteData<TagPage> | null)) => void;

interface TagState {
    tags: TagWithCountDto[];
    infiniteQueryData: InfiniteData<TagPage> | null;
    overviewData: OverviewStatistic[];
    dailyCreatedCount: DailyCountDto[];
    dailyUsageCount: TopTagUsageDto[]
    actions: {
        setInfiniteQueryData: SetInfiniteDataFunction;
        setOverviewData: (data: OverviewStatistic[]) => void;
        setDailyCreatedCount: (data: DailyCountDto[]) => void;
        setDailyUsageCount: (data: TopTagUsageDto[]) => void;
        clearAllData: () => void;
        addTag: (tag: TagWithCountDto) => void;
        updateTag: (updatedTag: TagWithCountDto) => void;
        removeTag: (tagId: string) => void;
        bulkRemoveTags: (tagIds: string[]) => void;
    };
}

const useTagStore = create<TagState>()(
    immer((set) => ({
        tags: [],
        infiniteQueryData: null,
        overviewData: [],
        dailyCreatedCount: [],
        dailyUsageCount: [],
        actions: {
            setInfiniteQueryData: (data) =>
                set((state) => {
                    state.infiniteQueryData = typeof data === "function" ? data(state.infiniteQueryData) : data;
                    if (state.infiniteQueryData?.pages) {
                        // Flatten and deduplicate tags from all pages
                        const allTags = state.infiniteQueryData.pages.flatMap((page) => page.data || []);
                        state.tags = Array.from(new Map(allTags.map((tag) => [tag.id, tag])).values());
                    }
                }),
            setOverviewData: (data) =>
                set((state) => {
                    state.overviewData = data;
                }),
            setDailyCreatedCount: (data) =>
                set((state) => {
                    state.dailyCreatedCount = data;
                }),
            setDailyUsageCount: (data) =>
                set((state) => {
                    state.dailyUsageCount = data;
                }),

            clearAllData: () =>
                set((state) => {
                    state.tags = [];
                    state.infiniteQueryData = null;
                    state.overviewData = [];
                    state.dailyCreatedCount = [];
                }),
            addTag: (tag) =>
                set((state) => {
                    state.tags.push(tag);
                    if (state.infiniteQueryData && state.infiniteQueryData.pages.length > 0) {
                        const updatedFirstPageData = [tag, ...(state.infiniteQueryData.pages[0]?.data || [])];
                        const updatedFirstPage = {
                            ...(state.infiniteQueryData.pages[0] || {}),
                            data: updatedFirstPageData,
                        };
                        state.infiniteQueryData.pages = [updatedFirstPage, ...state.infiniteQueryData.pages.slice(1)];
                    } else {
                        state.infiniteQueryData = {
                            pages: [{data: [tag]}],
                            pageParams: [0],
                        };
                    }
                }),
            updateTag: (updatedTag) =>
                set((state) => {
                    const index = state.tags.findIndex((tag) => tag.id === updatedTag.id);
                    if (index !== -1) {
                        state.tags[index] = {...state.tags[index], ...updatedTag};
                    }
                    if (state.infiniteQueryData) {
                        state.infiniteQueryData.pages = state.infiniteQueryData.pages.map((page) => {
                            const pageData = page.data ?? [];
                            if (pageData.some((tag) => tag.id === updatedTag.id)) {
                                return {
                                    ...page,
                                    data: pageData.map((tag) =>
                                        tag.id === updatedTag.id ? {...tag, ...updatedTag} : tag
                                    ),
                                };
                            }
                            return page;
                        });
                    }
                }),
            removeTag: (tagId) =>
                set((state) => {
                    state.tags = state.tags.filter((tag) => tag.id !== tagId);
                    if (state.infiniteQueryData) {
                        state.infiniteQueryData.pages = state.infiniteQueryData.pages.map((page) => ({
                            ...page,
                            data: page.data?.filter((tag) => tag.id !== tagId),
                        }));
                    }
                }),
            bulkRemoveTags: (tagIds) =>
                set((state) => {
                    state.tags = state.tags.filter((tag) => !tagIds.includes(tag.id!));
                    if (state.infiniteQueryData) {
                        state.infiniteQueryData.pages = state.infiniteQueryData.pages.map((page) => ({
                            ...page,
                            data: page.data?.filter((tag) => !tagIds.includes(tag.id!)),
                        }));
                    }
                }),
        },
    }))
);

export default useTagStore;

