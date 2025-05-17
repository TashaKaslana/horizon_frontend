'use client'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import {UserDialogTrigger} from "@/app/components/user_dialog/UserDialogTrigger";
import {Clock} from "lucide-react";
import {DataTable} from "@/components/ui/data-table";
import {historyColumns} from "@/app/components/user_dialog/history/columns";
import {History} from "@/types/History";
import {useInfiniteQuery} from "@tanstack/react-query";
import {getHistoryForMe} from "@/api/historyApi";
import {useCurrentUser} from "@/stores/useCurrentUser";
import {RestApiResponse} from "@/types/api";
import {useState} from "react";

export const HistoryDialog = () => {
    const [totalPage, setTotalPage] = useState(0)

    const trigger = {
        icon: <Clock/>,
        title: "History",
    }

    const {user} = useCurrentUser();

    const {data, fetchNextPage, hasNextPage} = useInfiniteQuery({
        queryKey: ['histories', user?.id],
        queryFn: async ({pageParam = 0}) => {
            const result = await getHistoryForMe({page: pageParam, size: 10})
            setTotalPage(result.metadata?.pagination?.totalPages ?? 0)
            return result
        },
        getNextPageParam: (lastPage: Omit<RestApiResponse<History[]>, 'error' | 'success'>) => {
            const pagination = lastPage.metadata?.pagination;
            return pagination?.hasNext ? pagination.currentPage + 1 : undefined;
        },
        initialPageParam: 0,
    })

    const histories = data?.pages.flatMap(item => item.data)

    return (
        <Dialog>
            <DialogTrigger>
                <UserDialogTrigger item={trigger}/>
            </DialogTrigger>
            <DialogContent className={'!max-w-fit '}>
                <DialogHeader>
                    <DialogTitle>{trigger.title}</DialogTitle>
                    <DialogDescription>Display your history activity</DialogDescription>
                </DialogHeader>

                <DataTable columns={historyColumns}
                           data={histories ?? []}
                           fetchNextPage={fetchNextPage}
                           hasNextPage={hasNextPage}
                           // totalPageCount={totalPage} //TODO: disable temp
                />
            </DialogContent>
        </Dialog>
    )
}