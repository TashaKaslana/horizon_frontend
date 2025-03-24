'use client'

import {FollowingHeader} from "@/app/(home)/following/components/FollowingHeader";
import {Tabs, TabsContent} from "@/components/ui/tabs";
import {FollowerTab} from "@/app/(home)/following/components/FollowerTab";
import {FollowingTab} from "@/app/(home)/following/components/FollowingTab";
import {UserCardProps} from "@/app/(home)/following/types/type";
import useFollowingStore from "@/app/(home)/following/store/useFollowingStore";
import {useEffect} from "react";

interface FollowingContainerProps {
    initialFollowing: UserCardProps[],
    initialFollowers: UserCardProps[]
}

const FollowingContainer = ({initialFollowing, initialFollowers}: FollowingContainerProps) => {
    const {setFollowing, setFollowers, setInitialFollowers, setInitialFollowing} = useFollowingStore()

    useEffect(() => {
        setInitialFollowing(initialFollowing)
        setInitialFollowers(initialFollowers)
        setFollowing(initialFollowing)
        setFollowers(initialFollowers)
    }, [initialFollowers, initialFollowing, setFollowers, setFollowing, setInitialFollowers, setInitialFollowing])

    return (
        <section className={'p-6 h-full'}>
            <Tabs defaultValue={'following'}>
                <FollowingHeader/>
                <main className={'border rounded py-1'}>
                    <TabsContent value={'following'} className={'h-[82vh]'}>
                        <FollowingTab/>
                    </TabsContent>
                    <TabsContent value={'followers'}>
                        <FollowerTab/>
                    </TabsContent>
                </main>
            </Tabs>
        </section>
    )
}

export default FollowingContainer