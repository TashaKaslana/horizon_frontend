import {MoreHorizontal} from "lucide-react";
import React from "react";
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from "@/components/ui/dropdown-menu";
import {usePostManagement} from "@/app/(home)/management/hooks/usePostManagement";
import Link from "next/link";
import {useTranslations} from "next-intl";

export const MoreActionDropdown = ({postId} : {postId: string}) => {
    const t = useTranslations('Home.management.actions');
    const {deletePostAction} = usePostManagement()

    return (
        <DropdownMenu>
            <DropdownMenuTrigger>
                <MoreHorizontal className={'border rounded w-10'}/>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuItem>
                    <Link href={`/management/${postId}/edit`}>
                        {t('edit')}
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => deletePostAction(postId)}>
                    {t('delete')}
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}