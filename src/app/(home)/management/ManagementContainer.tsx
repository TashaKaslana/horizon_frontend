'use client'

import {ManagementHeader} from "@/app/(home)/management/components/ManagementHeader";
import {ManagementMain} from "@/app/(home)/management/components/ManagementMain";
import {usePostManagementStore} from "@/app/(home)/management/store/usePostManagementStore";
import {useEffect} from "react";
import {Post} from "@/app/(home)/management/types/types";

interface ManagementContainerProps {
    posts: Post[]
}

const ManagementContainer = ({posts}: ManagementContainerProps) => {
    const {setInitialPosts, setPosts} = usePostManagementStore()

    useEffect(() => {
        setPosts(posts)
        setInitialPosts(posts)
    }, [posts, setInitialPosts, setPosts]);
    
    return (
        <article className={'h-full p-6 space-y-3'}>
            <ManagementHeader/>
            <ManagementMain/>
        </article>
    )
}

export default ManagementContainer