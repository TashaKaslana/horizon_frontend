import {DailyCountDto, OverviewStatistic} from "@/api/client";
import {create} from "zustand";
import {immer} from "zustand/middleware/immer";

interface DashboardStore {
    overviewData: OverviewStatistic[];
    userChartData: DailyCountDto[];
    postChartData: DailyCountDto[];
    commentChartData: DailyCountDto[];
    actions: {
        setOverviewData: (data: OverviewStatistic[]) => void;
        setUserChartData: (data: DailyCountDto[]) => void;
        setPostChartData: (data: DailyCountDto[]) => void;
        setCommentChartData: (data: DailyCountDto[]) => void;
        clearAllData: () => void;
    }
}

const useDashboardStore = create<DashboardStore>()(
    immer((set) => ({
        overviewData: [],
        userChartData: [],
        postChartData: [],
        commentChartData: [],
        actions: {
            setOverviewData: (data) =>
                set((state) => {
                    state.overviewData = data;
                }),
            setUserChartData: (data) =>
                set((state) => {
                    state.userChartData = data;
                }),
            setPostChartData: (data) =>
                set((state) => {
                    state.postChartData = data;
                }),
            setCommentChartData: (data) =>
                set((state) => {
                    state.commentChartData = data;
                }),
            clearAllData: () =>
                set((state) => {
                    state.overviewData = [];
                    state.userChartData = [];
                    state.postChartData = [];
                    state.commentChartData = [];
                }),
        },
    })),
);

export default useDashboardStore;

