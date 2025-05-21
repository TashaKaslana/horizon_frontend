'use client'

import {DataTable} from "@/components/ui/data-table";
import {columns} from "@/app/admin/posts/tags/tags-columns";
import {TagRowData} from "@/app/admin/posts/tags/types";
import {useState} from "react";
import { mockTagsData } from "../../components/mockData";

export const TagsTable = () => {
    const [data, setData] = useState<TagRowData[]>(mockTagsData.map(tag => ({...tag, postsCount: tag.postsCount || 0})));

    return (
        <div className={'p-4'}>
            <DataTable
                columns={columns}
                data={data}
                setData={setData}
                enableDnd={true}
                enableRowSelection={true}
                filterPlaceholder={"Search tags by slug, name, or description..."}
            />
        </div>
    )
}
