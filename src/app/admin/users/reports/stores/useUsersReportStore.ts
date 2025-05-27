import {create} from "zustand";
import {immer} from "zustand/middleware/immer";
import { InfiniteData } from "@tanstack/react-query";
import {ReportDto, ResponseMetadata} from "@/api/client/types.gen";

export interface ReportDataWrapper {
    data?: ReportDto[];
    metadata?: ResponseMetadata;
}

type SetInfiniteDataFunction = (data: InfiniteData<ReportDataWrapper> | null | ((prev: InfiniteData<ReportDataWrapper> | null) => InfiniteData<ReportDataWrapper> | null)) => void;

interface UserReportState {
    reports: ReportDto[];
    infiniteQueryData: InfiniteData<ReportDataWrapper> | null;
    actions: {
        setInfiniteQueryData: SetInfiniteDataFunction;
        clearAllData: () => void;
        addReport: (report: ReportDto) => void;
        updateReport: (updatedRole: ReportDto) => void;
        removeReport: (reportId: string | number) => void;
    };
}

const useUsersReportStore = create<UserReportState>()(
    immer((set) => ({
        reports: [],
        infiniteQueryData: null,
        actions: {
            setInfiniteQueryData: (data) =>
                set((state) => {
                    if (typeof data === 'function') {
                        state.infiniteQueryData = data(state.infiniteQueryData);
                    } else {
                        state.infiniteQueryData = data;
                    }
                    state.reports = state.infiniteQueryData?.pages?.flatMap((page: ReportDataWrapper) => page.data ?? []) ?? [];
                }),
            addReport: (report) =>
                set((state) => {
                    state.reports = [report, ...state.reports];
                    if (state.infiniteQueryData && state.infiniteQueryData.pages.length > 0) {
                        const updatedFirstPageData = [report, ...(state.infiniteQueryData.pages[0]?.data ?? [])];
                        const updatedFirstPage = {
                            ...(state.infiniteQueryData.pages[0] || {}),
                            data: updatedFirstPageData,
                        };
                        state.infiniteQueryData.pages = [updatedFirstPage, ...state.infiniteQueryData.pages.slice(1)];
                    } else {
                        state.infiniteQueryData = {
                            pages: [{ data: [report], metadata: {} }], // Added metadata placeholder
                            pageParams: [0],
                        };
                    }
                }),
            updateReport: (updatedReport) =>
                set((state) => {
                    state.reports = state.reports.map(r =>
                        r.id === updatedReport.id ? updatedReport : r
                    );
                    if (state.infiniteQueryData) {
                        state.infiniteQueryData.pages = state.infiniteQueryData.pages.map(page => {
                            const pageData = page.data ?? [];
                            if (pageData.some(r => r.id === updatedReport.id)) {
                                return {
                                    ...page,
                                    data: pageData.map(r =>
                                        r.id === updatedReport.id ? updatedReport : r
                                    ),
                                };
                            }
                            return page;
                        });
                    }
                }),
            removeReport: (reportId) =>
                set((state) => {
                    state.reports = state.reports.filter(r => r.id !== reportId);
                    if (state.infiniteQueryData) {
                        state.infiniteQueryData.pages = state.infiniteQueryData.pages.map(page => {
                            const pageData = page.data ?? [];
                            if (pageData.some(r => r.id === reportId)) {
                                return {
                                    ...page,
                                    data: pageData.filter(r => r.id !== reportId),
                                };
                            }
                            return page;
                        });

                        state.infiniteQueryData.pages = state.infiniteQueryData.pages.filter(page => (page.data?.length ?? 0) > 0);
                    }
                }),
            clearAllData: () =>
                set((state) => {
                    state.reports = [];
                    state.infiniteQueryData = null;
                }),
        },
    }))
);

export default useUsersReportStore;

