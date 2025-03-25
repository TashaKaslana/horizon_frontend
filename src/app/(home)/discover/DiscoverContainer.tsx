'use client'

import {Tabs, TabsContent} from "@/components/ui/tabs";
import {DiscoverHeader} from "@/app/(home)/discover/components/DiscoverHeader";
import {DiscoverTabContent} from "@/app/(home)/discover/components/DiscoverTabContent";
import { Post } from "@/types/types";
import { triggerTabs } from "./constraints/trigger-tabs";
import {useDiscoverStore} from "@/app/(home)/discover/store/useDiscoverPostStore";
import {useEffect} from "react";


interface DiscoverContainerProps {
    posts: Post[];
}

const DiscoverContainer = ({posts}: DiscoverContainerProps) => {
    const {setPosts} = useDiscoverStore()

    useEffect(() => {
        setPosts(posts)
    }, [posts, setPosts]);

    return (
        <article className={'h-full p-6 space-y-3 relative'}>
            <Tabs defaultValue={triggerTabs[0]} className={'w-full h-full'}>
                <DiscoverHeader triggers={triggerTabs}/>
                {triggerTabs.map((trigger, index) =>
                    <TabsContent value={trigger} key={index} className={'max-h-96'}>
                        <DiscoverTabContent/>
                    </TabsContent>
                )}
            </Tabs>
        </article>
    )
}


export default DiscoverContainer