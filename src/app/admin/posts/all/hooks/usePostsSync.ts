import {useEffect} from "react";
import {usePosts} from "./usePosts";
import usePostsStore from "../stores/usePostsStore";

export const usePostsSync = (postId?: string, dailyRange?: number) => {
    const posts = usePosts(postId, dailyRange);
    const {actions, posts: storePosts, selectedPost, overviewData, chartData} = usePostsStore();

    useEffect(() => {
        actions.setInfiniteQueryData(posts.postListData);
    }, [posts.postListData, actions]);

    useEffect(() => {
        if (posts.postOverviewData?.data) {
            actions.setOverviewData(posts.postOverviewData.data);
        }
    }, [posts.postOverviewData?.data, actions]);

    useEffect(() => {
        if (posts.dailyPostCount?.data) {
            actions.setChartData(posts.dailyPostCount.data);
        }
    }, [posts.dailyPostCount?.data, actions]);

    return {
        ...posts,
        posts: storePosts,
        selectedPost,
        overviewData,
        chartData,
        actions,
    };
};
