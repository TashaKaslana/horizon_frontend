'use client'

import {Tabs, TabsContent} from "@/components/ui/tabs";
import {DiscoverHeader} from "@/app/(home)/discover/components/DiscoverHeader";
import {DiscoverTabContent} from "@/app/(home)/discover/components/DiscoverTabContent";
import {triggerTabs} from "./constraints/trigger-tabs";
import {useDiscovery} from "@/app/(home)/discover/hooks/useDiscovery";

const DiscoverContainer = () => {
    const {categories} = useDiscovery()
    const allItem = categories.find(i => i.name === 'all');
    const otherItems = categories.filter(i => i.name !== 'all');

    const categoriesTrigger = [
        ...(allItem ? [allItem] : []),
        ...otherItems,
    ].map(i => formatTriggerName(i.name));

    return (
        <article className={'h-full p-6 space-y-3 relative'}>
            <Tabs defaultValue={triggerTabs[0]} className={'w-full h-full'}>
                <DiscoverHeader triggers={categoriesTrigger}/>
                {categoriesTrigger.map((trigger, index) =>
                    <TabsContent value={trigger}
                                 key={index}
                                 className={'h-full'}>
                        <DiscoverTabContent/>
                    </TabsContent>
                )}
            </Tabs>
        </article>
    )
}

const formatTriggerName = (name: string) => {
    return name.charAt(0).toUpperCase() + name.slice(1)
}


export default DiscoverContainer