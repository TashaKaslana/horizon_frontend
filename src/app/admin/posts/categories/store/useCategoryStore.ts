import {create} from "zustand";
import {immer} from "zustand/middleware/immer";
import { InfiniteData } from "@tanstack/react-query";
import {
    ResponseMetadata,
    PostCategoryWithCountDto,
    OverviewStatistic,
    TopCategoryUsageDto
} from "@/api/client/types.gen";

export interface CategoryPage {
    data?: PostCategoryWithCountDto[];
    metadata?: ResponseMetadata;
}

type SetInfiniteDataFunction = (data: InfiniteData<CategoryPage> | null | ((prev: InfiniteData<CategoryPage> | null) => InfiniteData<CategoryPage> | null)) => void;

interface CategoryState {
    categories: PostCategoryWithCountDto[];
    infiniteQueryData: InfiniteData<CategoryPage> | null;
    overviewData: OverviewStatistic[],
    chartData: TopCategoryUsageDto[],
    actions: {
        setInfiniteQueryData: SetInfiniteDataFunction;
        clearAllData: () => void;
        setOverviewData: (data: OverviewStatistic[]) => void;
        setChartData: (data: TopCategoryUsageDto[]) => void;
        addCategory: (role: PostCategoryWithCountDto) => void;
        updateCategory: (updatedRole: PostCategoryWithCountDto) => void;
        removeCategory: (roleId: string) => void;
        bulkRemoveCategories: (roleIds: string[]) => void;
    };
}

const useCategoryStore = create<CategoryState>()(
    immer((set) => ({
        categories: [],
        infiniteQueryData: null,
        overviewData: [],
        chartData: [],
        actions: {
            setInfiniteQueryData: (data) =>
                set((state) => {
                    if (typeof data === 'function') {
                        state.infiniteQueryData = data(state.infiniteQueryData);
                    } else {
                        state.infiniteQueryData = data;
                    }
                    state.categories = state.infiniteQueryData?.pages?.flatMap((page: CategoryPage) => page.data ?? []) ?? [];
                }),

            setOverviewData: (data) =>
                set((state) => {
                    state.overviewData = data;
                }),
            setChartData: (data) =>
                set((state) => {
                    state.chartData = data;
                }),

            addCategory: (category) =>
                set((state) => {
                    state.categories = [category, ...state.categories];
                    if (state.infiniteQueryData && state.infiniteQueryData.pages.length > 0) {
                        const updatedFirstPageData = [category, ...(state.infiniteQueryData.pages[0]?.data ?? [])];
                        const updatedFirstPage = {
                            ...(state.infiniteQueryData.pages[0] || {}),
                            data: updatedFirstPageData,
                        };
                        state.infiniteQueryData.pages = [updatedFirstPage, ...state.infiniteQueryData.pages.slice(1)];
                    } else {
                        state.infiniteQueryData = {
                            pages: [{ data: [category], metadata: {} }], // Added metadata placeholder
                            pageParams: [0],
                        };
                    }
                }),
            updateCategory: (updatedCategory) =>
                set((state) => {
                    state.categories = state.categories.map(r =>
                        r.id === updatedCategory.id ? updatedCategory : r
                    );
                    if (state.infiniteQueryData) {
                        state.infiniteQueryData.pages = state.infiniteQueryData.pages.map(page => {
                            const pageData = page.data ?? [];
                            if (pageData.some(r => r.id === updatedCategory.id)) {
                                return {
                                    ...page,
                                    data: pageData.map(r =>
                                        r.id === updatedCategory.id ? updatedCategory : r
                                    ),
                                };
                            }
                            return page;
                        });
                    }
                }),
            removeCategory: (categoryId) =>
                set((state) => {
                    state.categories = state.categories.filter(r => r.id !== categoryId);
                    if (state.infiniteQueryData) {
                        state.infiniteQueryData.pages = state.infiniteQueryData.pages.map(page => {
                            const pageData = page.data ?? [];
                            if (pageData.some(r => r.id === categoryId)) {
                                return {
                                    ...page,
                                    data: pageData.filter(r => r.id !== categoryId),
                                };
                            }
                            return page;
                        });

                        state.infiniteQueryData.pages = state.infiniteQueryData.pages.filter(page => (page.data?.length ?? 0) > 0);
                    }
                }),

            bulkRemoveCategories: (categoryIds) =>
                set((state) => {
                    state.categories = state.categories.filter(r => !categoryIds.includes(r.id!));
                    if (state.infiniteQueryData) {
                        state.infiniteQueryData.pages = state.infiniteQueryData.pages.map(page => {
                            const pageData = page.data ?? [];
                            if (pageData.some(r => categoryIds.includes(r.id!))) {
                                return {
                                    ...page,
                                    data: pageData.filter(r => !categoryIds.includes(r.id!)),
                                };
                            }
                            return page;
                        });

                        state.infiniteQueryData.pages = state.infiniteQueryData.pages.filter(page => (page.data?.length ?? 0) > 0);
                    }
                }),

            clearAllData: () =>
                set((state) => {
                    state.categories = [];
                    state.infiniteQueryData = null;
                }),
        },
    }))
);

export default useCategoryStore;

