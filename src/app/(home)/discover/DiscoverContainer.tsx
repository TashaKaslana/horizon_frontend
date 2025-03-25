import {Tabs, TabsContent} from "@/components/ui/tabs";
import {DiscoverHeader} from "@/app/(home)/discover/components/DiscoverHeader";
import {DiscoverTabContent} from "@/app/(home)/discover/components/DiscoverTabContent";


const DiscoverContainer = () => {
    const triggers = ['All', 'Gaming', 'Music', 'Sports', 'Techs', 'Foods', 'Books', 'Travels']

    return (
        <article className={'h-full p-6 space-y-3 relative'}>
            <Tabs defaultValue={triggers[0]} className={'w-full h-full'}>
                <DiscoverHeader triggers={triggers}/>
                {triggers.map((trigger, index) =>
                    <TabsContent value={trigger} key={index} className={'max-h-96'}>
                        <DiscoverTabContent/>
                    </TabsContent>
                )}
            </Tabs>
        </article>
    )
}


export default DiscoverContainer