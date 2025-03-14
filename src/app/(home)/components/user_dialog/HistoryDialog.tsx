import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import {UserDialogTrigger} from "@/app/(home)/components/user_dialog/UserDialogTrigger";
import {Clock} from "lucide-react";
import {DataTable} from "@/components/ui/data-table";
import {History, historyColumns} from "@/app/(home)/components/user_dialog/history/columns";

const histories: History[] = [
    { id: '1', type: 'watch', references: 'video_123', createdAt: '2024-03-10T10:00:00Z' },
    { id: '2', type: 'comment', references: 'comment_456', createdAt: '2024-03-10T11:15:00Z' },
    { id: '3', type: 'like', references: 'post_789', createdAt: '2024-03-10T12:30:00Z' },
    { id: '4', type: 'watch', references: 'video_987', createdAt: '2024-03-10T14:45:00Z' },
    { id: '5', type: 'comment', references: 'comment_654', createdAt: '2024-03-10T16:00:00Z' },
    { id: '6', type: 'like', references: 'post_321', createdAt: '2024-03-10T17:20:00Z' },
    { id: '1', type: 'watch', references: 'video_123', createdAt: '2024-03-10T10:00:00Z' },
    { id: '2', type: 'comment', references: 'comment_456', createdAt: '2024-03-10T11:15:00Z' },
    { id: '3', type: 'like', references: 'post_789', createdAt: '2024-03-10T12:30:00Z' },
    { id: '4', type: 'watch', references: 'video_987', createdAt: '2024-03-10T14:45:00Z' },
    { id: '5', type: 'comment', references: 'comment_654', createdAt: '2024-03-10T16:00:00Z' },
    { id: '6', type: 'like', references: 'post_321', createdAt: '2024-03-10T17:20:00Z' },
];

export const HistoryDialog = () => {
  const trigger = {
      icon: <Clock/>,
      title: "History",
  }

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

                <DataTable columns={historyColumns} data={histories}/>
            </DialogContent>
        </Dialog>
    )
}