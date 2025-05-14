'use client'

import {ManagementHeader} from "@/app/(home)/management/components/ManagementHeader";
import {ManagementMain} from "@/app/(home)/management/components/ManagementMain";

const ManagementContainer = () => {
    return (
        <article className={'h-full p-6 space-y-3'}>
            <ManagementHeader/>
            <ManagementMain/>
        </article>
    )
}

export default ManagementContainer