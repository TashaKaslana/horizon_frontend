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
import {useTranslations} from "next-intl";

export const HistoryDialog = () => {
    const t = useTranslations("Home.user_dialog");
    const historyT = useTranslations("Home.user_dialog.history_dialog");

    const trigger = {
        icon: <Clock/>,
        title: t("history"),
    }

    const {user} = useCurrentUser();

    const {data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading} = useInfiniteQuery({
        queryKey: ['histories', user?.id],
        queryFn: async ({pageParam = 0}) => {
            return await getHistoryForMe({page: pageParam, size: 10})
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
                    <DialogTitle>{historyT("title")}</DialogTitle>
                    <DialogDescription>{t("history_dialog.description") || "Display your history activity"}</DialogDescription>
                </DialogHeader>

                <DataTable columns={historyColumns}
                           data={histories ?? []}
                           fetchNextPage={fetchNextPage}
                           hasNextPage={hasNextPage}
                           pageCount={data?.pages[0]?.metadata?.pagination?.totalPages ?? 0}
                           isFetchingNextPage={isFetchingNextPage}
                           isLoading={isLoading}
                />
            </DialogContent>
        </Dialog>
    )
}