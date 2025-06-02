import {OverviewList} from "@/app/admin/components/overview-list";
import useUsersStore from "@/app/admin/users/all/store/useUsersStore";
import useUsersManagement from "@/app/admin/users/all/hooks/useUsersManagement";

export const UserCardList = () => {
    const {overviewData} = useUsersStore()
    const {isUserOverviewLoading} = useUsersManagement()

    return <OverviewList overviewData={overviewData} isLoading={isUserOverviewLoading} />
}
