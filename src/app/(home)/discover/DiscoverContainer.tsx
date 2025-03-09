import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {DiscoverHeader} from "@/app/(home)/discover/components/DiscoverHeader";
import {DiscoverTabContent} from "@/app/(home)/discover/components/DiscoverTabContent";


const DiscoverContainer = () => {
    const triggers = ['All', 'Gaming', 'Music', 'Sports', 'Techs', 'Foods', 'Books', 'Travels']

    return (
        <>
            <DiscoverHeader/>
            <Tabs defaultValue={triggers[0]} className={'w-full px-5 mt-2'}>
                <TabsList className={'w-full'}>
                    {triggers.map((trigger, index) =>
                        <TabsTrigger value={trigger} key={index}>
                            {trigger}
                        </TabsTrigger>
                    )}
                </TabsList>
                {triggers.map((trigger, index) =>
                    <TabsContent value={trigger} key={index}>
                        <DiscoverTabContent/>
                    </TabsContent>
                )}
            </Tabs>
        </>
    )
}


export default DiscoverContainer